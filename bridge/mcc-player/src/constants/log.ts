/** 阿里云日志仓库endpoint */
export const ALI_SLS_ENDPOINT = 'cn-beijing.log.aliyuncs.com';

/** 阿里云日志仓库项目名 */
export const ALI_SLS_PROJECT = 'ledu-saas-lele';

/** 阿里云日志仓库库名 */
export const ALI_SLS_LOGSTORE = 'player';

type ALI_SLS_LOG_FREQUENCY_LEVEL = 'HIGH' | 'MEDIUM' | 'LOW';
interface ALI_SLS_LOG_FREQUENCY_VALUES {
  PUTTIMESPAN: number;
  PUTMAXCOUNT: number;
}

export const ALI_SLS_LOG_FREQUENCY_CONFIG: Record<
  ALI_SLS_LOG_FREQUENCY_LEVEL,
  ALI_SLS_LOG_FREQUENCY_VALUES
> = {
  HIGH: {
    PUTTIMESPAN: 3000,
    PUTMAXCOUNT: 50,
  },
  MEDIUM: {
    PUTTIMESPAN: 5000,
    PUTMAXCOUNT: 50,
  },
  LOW: {
    PUTTIMESPAN: 7000,
    PUTMAXCOUNT: 50,
  },
};

/**
 * 批量上报日志频率设置
 * 参考 src/constants/log.ts ALI_SLS_LOG_FREQUENCY_CONFIG
 */
export enum BATCH_LOG_FREQUENCY_LEVEL {
  /** 关闭批量上报，使用单次单个上报 */
  OFF = 'off',
  /** 低频次，（时间间隔2000ms，单次上限100条） */
  LOW = 'low',
  /** 中频次，（时间间隔1000ms，单次上限50条） */
  MEDIUM = 'medium',
  /** 高频次，（时间间隔200ms，单次上限50条） */
  HIGH = 'high',
}
