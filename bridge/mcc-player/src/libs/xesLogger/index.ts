import {
  Role,
  BATCH_LOG_FREQUENCY_LEVEL,
} from '../../interface/index';
import { AliLogger } from './ali-logger';
// import { EndLogger } from './end-logger';
import { Axios } from '../http/axios';
import { isIos, isAndroid } from '../utils';

type FnLogHandler = (level: string, msg: string) => void;

const LogLevel = {
  error: 0,
  warn: 1,
  info: 2,
  cwerror: 3,
  cwwarn: 4,
  cwinfo: 5,
  detail: 6,
  cwdetail: 7,
};

class Logger {
  /** 当前环境是否是pc */
  private static readonly isPc = !isIos() && !isAndroid();

  /** 当前用户角色 */
  private static role: Role;

  /** 阿里云上报工具类 */
  private static aliLogger = new AliLogger();

  /** 客户端辅助上报工具类 */
  // private static endLogger = new EndLogger();

  /** 内容云课件日志等级 */
  private static reportLevel = LogLevel.cwerror;

  /** 额外的logger（即除了默认console.log以外的logger）列表 */
  private static externalHandler: FnLogHandler[] = [
    (level, msg) => {
      // if (Logger.isPc && Logger.role === Role.Student) {
      //   // Logger.endLogger.log(level, msg);
      // } else {
      Logger.aliLogger.log(level, msg);
      // }
    },
  ];

  static setLogHandler(handler: FnLogHandler): void {
    Logger.externalHandler.push(handler);
  }

  static setRemoteLogInfo(classId: string, userId: string): void {
    Logger.aliLogger.setMeta('src', `${classId} - ${userId}`);
    // Logger.endLogger.setMeta('src', `${classId} - ${userId}`);
  }

  static setReportLevel(reportLevel: number) {
    Logger.reportLevel = reportLevel || LogLevel.cwerror;
  }

  /**
   * 初始化时设置角色
   * @param user 用户角色
   */
  static setRole(user: Role) {
    console.log('role: ', user);
    Logger.role = user;
    Logger.aliLogger.setRole(user);
  }

  /**
   * 初始化时设置PC端上报日志方法
   * @param fn PC端上报日志方法
   */
  static setLogFn(fn: PcStuLogStoreFn) {
    // Logger.endLogger.setLogFn(fn);
  }

  /**
   * 设置阿里云上报时使用的网络请求工具方法
   * @param postFn - 发起http post请求的工具方法
   */
  static setHttpUtils(
    postFn: (
      url: string,
      body: any,
      config: { headers: any; [keys: string]: any }
    ) => Promise<any>
  ) {
    Logger.aliLogger.setHttpUtil({
      get: (...args) => Axios.get(...args),
      post: postFn,
    });
  }

  /**
   * 设置批量上报阿里云日志的频率
   * @param level - 频率等级
   */
  static setBatchLogFrequencyLevel(level: BATCH_LOG_FREQUENCY_LEVEL) {
    Logger.aliLogger.setBatchLogFrequencyLevel(level);
  }

  constructor(private prefix: string = '') {}

  log(msg: unknown, ...data: unknown[]): void {
    this.info(msg, ...data);
  }

  info(msg: unknown, ...data: unknown[]): void {
    this.logIt('info', msg, ...data);
  }

  warn(msg: unknown, ...data: unknown[]): void {
    this.logIt('warn', msg, ...data);
  }

  error(msg: unknown, ...data: unknown[]): void {
    this.logIt('error', msg, ...data);
  }

  log2(level: string, msg: unknown, ...data: unknown[]): void {
    this.logIt(level, msg, ...data);
  }

  detail(msg: unknown, ...data: unknown[]): void {
    // 密集日志
    this.logIt('detail', msg, ...data);
  }

  public cwlog(level: string, msg: string) {
    if (
      Logger.externalHandler.length > 0 &&
      Logger.reportLevel >= LogLevel[`cw${level}`]
    ) {
      for (const h of Logger.externalHandler) {
        h(level, msg);
      }
      this.consoleHandler(level, msg);
    }
  }

  private logIt(level: string, msg: unknown, ...data: unknown[]): void {
    if (
      Logger.externalHandler.length > 0 &&
      Logger.reportLevel >= LogLevel[level]
    ) {
      const dataMsg = `${msg} ${this.stringifyMsg(...data)}`;
      const newMsg = this.prefix ? this.prefix + dataMsg : dataMsg;
      for (const h of Logger.externalHandler) {
        h(level, newMsg);
      }
    }
    this.consoleHandler(level, msg, ...data);
  }

  private stringifyMsg(...data: unknown[]): string {
    return data
      .map((i) => (typeof i === 'string' ? i : JSON.stringify(i)))
      .join(' ');
  }

  private consoleHandler(
    level: string,
    msg: unknown,
    ...data: unknown[]
  ): void {
    switch (level) {
      case 'info':
        console.info(this.prefix + msg, ...data);
        break;
      case 'warn':
        console.warn(this.prefix + msg, ...data);
        break;
      case 'error':
        console.error(this.prefix + msg, ...data);
        break;
      case 'detail':
        console.log(this.prefix + msg, ...data);
        break;
    }
  }
}

const logger = new Logger();

export { logger };
export default Logger;
