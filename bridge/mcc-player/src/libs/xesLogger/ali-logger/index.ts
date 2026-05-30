import type { WebTrackingUtil } from './webTrackingUtil';
import { AliMobileLogger } from './aliMobileLogger';
import { AliPcLogger } from './aliPcLogger';
import { isIos, isAndroid } from '../../utils';
import { AxiosInstance } from 'axios';
import { BATCH_LOG_FREQUENCY_LEVEL, Role } from '../../../interface';

export class AliLogger {
  private logger: WebTrackingUtil;

  constructor() {
    if (!isIos() && !isAndroid()) {
      this.logger = new AliPcLogger();
    } else {
      this.logger = new AliMobileLogger();
    }
  }

  /** 设置日志元数据 */
  public setMeta(key: string, value: any) {
    this.logger.setMeta(key, value);
  }

  /** 设置网络请求工具类 */
  public setHttpUtil(
    httpUtil: AxiosInstance | { get: Function; post: Function }
  ) {
    this.logger.setHttpUtil(httpUtil);
  }

  /** 设置当前用户身份 */
  public setRole(role: Role) {
    if (this.logger instanceof AliMobileLogger) {
      this.logger.setRole(role);
    }
  }

  /**
   * 设置日志上报频率
   * @param batchLogFrequencyLevel - 上报频率等级
   */
  public setBatchLogFrequencyLevel(
    batchLogFrequencyLevel: BATCH_LOG_FREQUENCY_LEVEL
  ) {
    this.logger.setBatchLogFrequencyLevel(batchLogFrequencyLevel);
  }

  /** 一次上报一条 */
  public singleLog(level: string, msg: string) {
    return this.logger.batchLog(level, msg);
  }

  /** 一次上报多条 */
  public batchLog(level: string, msg: string) {
    return this.logger.batchLog(level, msg);
  }

  /** 日志上报 */
  public log(level: string, msg: string) {
    return this.logger.log(level, msg);
  }
}
