import axios from 'axios';
import { protocol } from './protocol';

interface IsRemoteResourceExistOptions {
  retryCount?: number; // 重试次数，默认为 0
  retryDelay?: number; // 重试延迟时间（毫秒），默认为 1000
  timeout?: number;
}

/**
 * 判断远程资源是否存在
 * @param url 资源的 URL
 * @param options 可选参数，包括重试次数和重试延迟时间
 * @returns Promise，当资源存在时 resolve true，否则 resolve false
 */
export const isRemoteResourceExist = async (
  url: string,
  options: IsRemoteResourceExistOptions = {}
): Promise<boolean> => {
  const { retryCount = 0, retryDelay = 1000, timeout = 2000 } = options;
  try {
    const { status } = await axios.head(url, { timeout });
    if (protocol.is.file(url)) {
      return status === 0 || (status >= 200 && status < 300);
    } else {
      return status >= 200 && status < 300;
    }
  } catch (error) {
    if (retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return await isRemoteResourceExist(url, {
        retryCount: retryCount - 1,
        retryDelay,
      });
    } else {
      return false;
    }
  }
};
