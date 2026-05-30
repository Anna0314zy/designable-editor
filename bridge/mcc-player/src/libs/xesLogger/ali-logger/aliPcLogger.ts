import { WebTrackingUtil } from './webTrackingUtil';
import { ALI_SLS_ENDPOINT, ALI_SLS_PROJECT, ALI_SLS_LOGSTORE } from '../../../constants/xesLog';

export class AliPcLogger extends WebTrackingUtil {
  constructor() {
    super({
      endpoint: ALI_SLS_ENDPOINT,
      project: ALI_SLS_PROJECT,
      logstore: ALI_SLS_LOGSTORE,
    });
  }
}
