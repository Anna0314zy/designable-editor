import { Base64 } from '../../base64/base64';
import { WebTrackingUtil } from './webTrackingUtil';
import {
  ALI_SLS_ENDPOINT,
  ALI_SLS_PROJECT,
  ALI_SLS_LOGSTORE,
} from '../../../constants/xesLog';
import { Role } from '../../../interface';
import { isIos } from '../../utils';

export class AliMobileLogger extends WebTrackingUtil {
  /** 当前用户角色 */
  private role: Role;

  constructor() {
    super({
      endpoint: ALI_SLS_ENDPOINT,
      project: ALI_SLS_PROJECT,
      logstore: ALI_SLS_LOGSTORE,
    });
  }

  /** lz4压缩 */
  // protected compress(data: Uint8Array): Uint8Array | number[] | string {
  //   const compressed: Uint8Array = super.compress(data);

  //   /**
  //    * ios学生端需要端上帮忙发起网络请求，
  //    * ios中jsbridge无法传递uint8array及arraybuffer，
  //    * 所以转成base64，端上负责把base64转换成二进制数据
  //    */
  //   if (this.role === Role.Student && isIos()) {
  //     return Base64.fromUint8Array(compressed);
  //   }

  //   return compressed;
  // }

  /** 更改网络请求工具 */
  // public setHttpUtil(httpUtil: { get: Function, post: Function }) {
  //   const _httpUtil = {
  //     get: (...args) => httpUtil.get(...args),
  //     post: (url: string, body: any, config: any) => {
  //       const headers: any = config.headers;

  //       if (this.role === Role.Student) {
  //         // 此配置用于设置是否需要端上把body从base64转为二进制类型
  //         config.needConvertBodyToBin = ('x-log-compresstype' in headers);
  //       }

  //       return httpUtil.post(url, body, config);
  //     }
  //   }

  //   this.httpUtil = _httpUtil;
  // }

  public setRole(role: Role) {
    this.role = role;
  }
}
