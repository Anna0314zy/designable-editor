import type { AxiosInstance } from 'axios';
import { BaseLogUtil } from '../baseLogUtil';
import { Axios } from '../../http/axios';
import { lz4 } from '../../lz4/lz4';
import { BATCH_LOG_FREQUENCY_LEVEL } from '../../../interface';
import { ALI_SLS_LOG_FREQUENCY_CONFIG } from '../../../constants';
import { TaskArrayManager } from './logCache';

interface Options {
  endpoint: string;
  project: string;
  logstore: string;
}

class WebTrackingUtil extends BaseLogUtil {
  private baseUrl: string;

  /** 多条上报时的上报频率，单位：条/s */
  private putTimeSpan: number = ALI_SLS_LOG_FREQUENCY_CONFIG.LOW.PUTTIMESPAN;

  /** 多条上报时的单次上报条数 */
  private putMaxCount: number = ALI_SLS_LOG_FREQUENCY_CONFIG.LOW.PUTMAXCOUNT;

  /** 单个上报队列 */
  private singleQueue = [];

  /** 批量上报队列 */
  private batchQueue = new TaskArrayManager('batchQueue', 'batchQueueTasks');

  /** 单次多条上报的定时器 */
  private batchTaskTimer = null;

  /** 批量上报频率 */
  private batchLogFrequencyLevel = BATCH_LOG_FREQUENCY_LEVEL.LOW;

  /** 标记当前是否有正在进行的单次单条上报任务 */
  private isSingleTaskRunning = false;

  /** 网络请求工具 */
  protected httpUtil: AxiosInstance | { get: Function; post: Function } = Axios;

  constructor(options: Options) {
    super();

    const { endpoint, project, logstore } = options;
    this.baseUrl = `https://${project}.${endpoint}/logstores/${logstore}/track?APIVersion=0.6.0`;
  }

  /** 发送单条日志数据 */
  private sendWebTracking(log: any) {
    return this.httpUtil
      .get(this.baseUrl, {
        params: log,
      })
      .catch((err) => {
        console.error('fail to send log', err);
      });
  }

  /** lz4压缩 */
  protected compress(data: Uint8Array): Uint8Array | any {
    const compressedBuffer = new ArrayBuffer(
      lz4.compressBound(data.byteLength)
    );
    const compressed = new Uint8Array(compressedBuffer);
    const compressedSize = lz4.compress(data, compressed);
    const res = compressed.slice(0, compressedSize);

    return res;
  }

  /** 压缩发送多条日志 */
  private putWebTrackings(logs: any[], taskId: number) {
    let body: any = { __logs__: logs };

    const headers = {
      'x-log-apiversion': '0.6.0',
      'x-log-bodyrawsize': JSON.stringify(body).length,
    };

    // string转arraybuffer，并压缩
    if (logs.length >= 2) {
      const rawBody = JSON.stringify(body);
      const enc = new TextEncoder();
      const rawBodyBin = enc.encode(rawBody);
      const compressedBody = this.compress(rawBodyBin);

      body = compressedBody;

      // body原始大小
      const bodyRawSize = rawBodyBin.byteLength;

      headers['x-log-bodyrawsize'] = bodyRawSize;
      headers['x-log-compresstype'] = 'lz4';

      if (
        compressedBody instanceof Uint8Array ||
        compressedBody instanceof ArrayBuffer
      ) {
        headers['Content-Type'] = 'application/octet-stream';
      }
    }
    return this.httpUtil
      .post(this.baseUrl, body, { headers })
      .then(() => {
        this.batchQueue.taskSucceeded(taskId);
      })
      .catch((err) => {
        this.batchQueue.taskFailed(taskId);
        console.error('fail to send log, err: ', err);
      });
  }

  /** 一次多条上报 辅助函数 */
  private batchLogHelper() {
    if (this.batchTaskTimer) {
      return;
    }

    const uploadLogs = (that) => {
      const taskId = that.batchQueue.spliceAndGetTaskID(0, that.putMaxCount);
      const logs = that.batchQueue.getItemsByTaskID(taskId);
      Array.isArray(logs) && that.putWebTrackings(logs, taskId);

      that.batchTaskTimer = null;
      if (that.batchQueue.length > 0) {
        that.batchLogHelper();
      }
    };
    // 如果当前队列超出当前上报频率的最大条数，则立即上报
    // 否则，等待当前上报频率的时间间隔后上报
    this.batchQueue.length > this.putMaxCount
      ? uploadLogs(this)
      : (this.batchTaskTimer = setTimeout(() => {
          uploadLogs(this);
        }, this.putTimeSpan));
  }

  /**
   * 设置日志上报频率
   * @param batchLogFrequencyLevel - 上报频率等级
   */
  public setBatchLogFrequencyLevel(
    batchLogFrequencyLevel: BATCH_LOG_FREQUENCY_LEVEL
  ) {
    if (batchLogFrequencyLevel === BATCH_LOG_FREQUENCY_LEVEL.OFF) {
      batchLogFrequencyLevel = BATCH_LOG_FREQUENCY_LEVEL.HIGH;
    }
    this.batchLogFrequencyLevel = batchLogFrequencyLevel;

    const { PUTTIMESPAN, PUTMAXCOUNT } =
      ALI_SLS_LOG_FREQUENCY_CONFIG[batchLogFrequencyLevel.toUpperCase()] || {};
    PUTTIMESPAN !== null &&
      PUTTIMESPAN !== undefined &&
      (this.putTimeSpan = PUTTIMESPAN);
    PUTMAXCOUNT !== null &&
      PUTMAXCOUNT !== undefined &&
      (this.putMaxCount = PUTMAXCOUNT);
  }

  public setHttpUtil(httpUtil: { get: Function; post: Function }) {
    // this.httpUtil = httpUtil;
  }

  /** 一次一条上报 */
  public async singleLog(level: string, msg: string) {
    const t = this.createFormattedTimeString();
    const log = this.createLog(level, msg, t);
    this.singleQueue.push(log);

    if (!this.isSingleTaskRunning) {
      this.isSingleTaskRunning = true;
      while (this.singleQueue.length > 0) {
        const log = this.singleQueue.shift();
        await this.sendWebTracking(log);
      }
      this.isSingleTaskRunning = false;
    }
  }

  /** 一次多条上报 */
  public async batchLog(level: string, msg: string) {
    // console.log('batchlogs ', level, msg, this.batchLogFrequencyLevel, new Date().getTime());
    const t = this.createFormattedTimeString();
    const log = this.createLog(level, msg, t);
    this.batchQueue.addItem(log);

    this.batchLogHelper();
  }

  /** 日志上报 */
  public log(level: string, msg: string) {
    // if (this.batchLogFrequencyLevel === BATCH_LOG_FREQUENCY_LEVEL.OFF) {
    //   return this.singleLog(level, msg);
    // } else {
    return this.batchLog(level, msg);
    // }
  }
}

export { WebTrackingUtil };
