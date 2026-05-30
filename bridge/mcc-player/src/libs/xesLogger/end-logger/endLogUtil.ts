import type { PcStuLogStoreFn } from '../../../interface';
import { BaseLogUtil } from '../baseLogUtil';
import { PcStuLogStore } from '../../../interface';

class EndLogUtil extends BaseLogUtil {
  private logFn: PcStuLogStoreFn;

  constructor() {
    super();
  }

  setLogFn(logFn: PcStuLogStoreFn) {
    this.logFn = logFn;
  }

  /** 通过端上报日志 */
  public log(level: string, msg: string) {
    const t = this.createFormattedTimeString();
    const logData = this.createLog(level, msg, t);
    if (this.logFn) {
      this.logFn(PcStuLogStore, logData);
    }
  }
}

export { EndLogUtil };
