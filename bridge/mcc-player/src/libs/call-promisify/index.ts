import { logger } from '../logger';
interface CallInfo {
  timer: number;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}
type TimerCallback = () => void;
export default class CallPromisify {
  private callInfoMap = new Map<string, CallInfo[]>();
  
  record<T>(id: string, timeout: number, timeoutReason?: unknown, timerCallback?: TimerCallback): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        logger.log(`cw message timeout:${id} ${timeoutReason}`);
        timerCallback && timerCallback()
        this.reject(id, timeoutReason);
      }, timeout);
      this.addCallInfo(id, { timer, resolve, reject });
    });
  }

  resolve(id: string, value?: unknown): void {
    this.handleCall(id, false, value);
  }

  resolveAll(value?: unknown): void {
    this.handleAllCall(false, value);
  }

  reject(id: string, reason?: unknown): void {
    this.handleCall(id, true, reason);
  }

  rejectAll(reason?: unknown): void {
    this.handleAllCall(true, reason);
  }

  private addCallInfo(callId: string, info: CallInfo) {
    const infos = this.callInfoMap.get(callId);
    if (infos) {
      infos.push(info);
    } else {
      this.callInfoMap.set(callId, [info]);
    }
  }

  private handleCall(callId: string, reject: boolean, value?: unknown): void {
    const infos = this.callInfoMap.get(callId);
    if (infos) {
      for (const item of infos) {
        this.handleOneInfo(item, reject, value);
      }
      this.callInfoMap.delete(callId);
    }
  }

  private handleAllCall(reject: boolean, value?: unknown): void {
    // TODO map的遍历兼容ES5
    this.callInfoMap.forEach((infos) => {
      for (const info of infos) {
        this.handleOneInfo(info, reject, value);
      }
    });
    this.callInfoMap.clear();
  }

  private handleOneInfo(
    info: CallInfo,
    reject: boolean,
    value?: unknown
  ): void {
    clearTimeout(info.timer);
    if (reject) {
      info.reject(value);
    } else {
      info.resolve(value);
    }
  }
}
