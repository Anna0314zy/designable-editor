import { uuid } from '@/utils';

class BaseLogUtil {
  /** 日志序列号 */
  protected seq = 0;

  /** 日志元数据 */
  protected meta = {
    uuid: uuid(),
  };

  /** 补充'0' */
  protected pad(n: number, len: number): string {
    return ('0'.repeat(len) + n).slice(-len);
  }

  /** 构建格式化的时间字符串 */
  protected createFormattedTimeString() {
    const d = new Date();
    return (
      d.getFullYear() +
      '-' +
      this.pad(d.getMonth() + 1, 2) +
      '-' +
      this.pad(d.getDate(), 2) +
      'T' +
      this.pad(d.getHours(), 2) +
      ':' +
      this.pad(d.getMinutes(), 2) +
      ':' +
      this.pad(d.getSeconds(), 2) +
      '.' +
      this.pad(d.getMilliseconds(), 3)
    );
  }

  /** 构建一个日志对象 */
  protected createLog(level: string, msg: string, timeStr: string): any {
    const log: any = {};
    for (const [k, v] of Object.entries(this.meta)) {
      log[k] = v;
    }
    log.seq = '' + ++this.seq;
    log.t = timeStr;
    log.level = level;
    log.msg = msg.length > 3000 ? msg.slice(0, 3000) : msg;
    return log;
  }

  public setMeta(key: string, value: any) {
    this.meta[key] = value;
  }
}

export { BaseLogUtil };
