import axios from "axios";

export enum PROTOCOL {
  HTTPS = "https",
  HTTP = "http",
  WS = "ws",
  WSS = "wss",
  FILE = "file",
  FTP = "ftp",
  FTPS = "ftps",
  ABOUT = "about",
  MAILTO = "mailto",
  OWCR = "owcr",
}

export const protocol = {
  is: {
    [PROTOCOL.HTTPS]: (url: string): boolean => /^https:\/\//.test(url),
    [PROTOCOL.HTTP]: (url: string): boolean => /^http:\/\//.test(url),
    [PROTOCOL.WS]: (url: string): boolean => /^ws:\/\//.test(url),
    [PROTOCOL.WSS]: (url: string): boolean => /^wss:\/\//.test(url),
    [PROTOCOL.FILE]: (url: string): boolean => /^file:\/\//.test(url),
    [PROTOCOL.FTP]: (url: string): boolean => /^ftp:\/\//.test(url),
    [PROTOCOL.FTPS]: (url: string): boolean => /^ftps:\/\//.test(url),
    [PROTOCOL.ABOUT]: (url: string): boolean => /^about:\/\//.test(url),
    [PROTOCOL.MAILTO]: (url: string): boolean => /^mailto:\/\//.test(url),
    [PROTOCOL.OWCR]: (url: string): boolean => /^owcr:\/\//.test(url),
    localHost: (url: string): boolean => url.indexOf("localhost:") > -1,
  },
  get: (url: string): string => {
    if (protocol.is[PROTOCOL.HTTPS](url)) {
      return PROTOCOL.HTTPS;
    }
    if (protocol.is[PROTOCOL.HTTP](url)) {
      if (protocol.is.localHost(url)) {
        return "localhost";
      }
      return PROTOCOL.HTTP;
    }
    if (protocol.is[PROTOCOL.WS](url)) {
      return PROTOCOL.WS;
    }
    if (protocol.is[PROTOCOL.WSS](url)) {
      return PROTOCOL.WSS;
    }
    if (protocol.is[PROTOCOL.FILE](url)) {
      return PROTOCOL.FILE;
    }
    if (protocol.is[PROTOCOL.FTP](url)) {
      return PROTOCOL.FTP;
    }
    if (protocol.is[PROTOCOL.FTPS](url)) {
      return PROTOCOL.FTPS;
    }
    if (protocol.is[PROTOCOL.ABOUT](url)) {
      return PROTOCOL.ABOUT;
    }
    if (protocol.is[PROTOCOL.MAILTO](url)) {
      return PROTOCOL.MAILTO;
    }
    if (protocol.is[PROTOCOL.OWCR](url)) {
      return PROTOCOL.OWCR;
    }
    return "";
  },
};
export const isLocalHost = (url: string): boolean => protocol.is.localHost(url);

const getLocalUrl = (
  local: {
    localRootPath: string;
    pathConfigList: [{ path: string; type: string }];
    cdnPathList: [];
  },
  name: string,
  type: string
): string => {
  if (!local || !Array.isArray(local.pathConfigList)) return '';
  const pathItem = local.pathConfigList.find((item) => item.type === type);
  if (pathItem) {
    const path = pathItem.path;
    const rootPath = local.localRootPath;
    console.log("pathItem", pathItem, name, rootPath);

    const url = `${rootPath}${path}/${name}`;
    return url;
  }
  return '';
};
const getRemoteUrl = (
  remote: {
    pathConfigList: [{ path: string; type: string }];
    cdnPathList: string[];
  },
  name: string,
  type: string,
  fileItem: { cosFullPath: string },
  pathPropName = "cosFullPath"
): string[] => {
  if (!remote) return [];
  if (!Array.isArray(remote.pathConfigList))
    return [remote.cdnPathList[0] + fileItem[pathPropName]];
  if (remote.pathConfigList && remote.pathConfigList.length > 0) {
    const pathItem = remote.pathConfigList.find((item) => item.type === type);
    if (pathItem) {
      const path = pathItem.path;
      const cdnPathList = remote.cdnPathList;
      if (!Array.isArray(cdnPathList)) return [];
      return cdnPathList.map((host) => `${host}${path}/${name}`);
    }
  }
  return [];
};

// 通过 head 请求进行判断是否存在

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
  options: IsRemoteResourceExistOptions = {
    retryCount: 0,
    retryDelay: 0,
    timeout: 5000,
  }
): Promise<boolean> => {
  if(!url) return false
  let { retryDelay, timeout } = options;
  if (!url.startsWith("http")) {
    options.retryCount = 0;
  }
  try {
    const { status } = await axios.head(url, { timeout });
    return status === 0 || (status >= 200 && status < 300);
  } catch (error) {
    const retryCount = options.retryCount || 0; // 重试次数，默认为 0
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

// 获取需要进行加载的 url
// 加载应该是依次的，有优先级，优先加载本地，然后加载远程
// 本地加载的时候，需要判断是否存在，如果不存在，就加载远程的
// 远程加载的时候，需要判断是否存在，如果不存在，就切换链路
//   resourceConfig fileList
export const getUrls = (
  resourceConfig,
  fileList,
  src,
  resourceType,
  filePropName = "ossFileName",
  pathPropName = "cosFullPath",
  fileType = ""
) => {
  const { local, remote } = resourceConfig;
  const list = fileList.filter((item) => item.resourceType === resourceType);
  if (list.length > 0) {
    const fileItem = list.find(
      (item: { fileMd5: string }) => item.fileMd5 === src
    );
    if (fileItem) {
      const { derivativeList } = fileItem;
      if (derivativeList && derivativeList.length > 0) {
        const derivativeItem = derivativeList.find(
          (item) => item.resourceType === resourceType
        );
        if (derivativeItem) {
          const name = derivativeItem[filePropName];
          const type = fileType || derivativeItem.resourceType;
          const urls = [
            getLocalUrl(local, name, type),
            ...getRemoteUrl(remote, name, type, derivativeItem, pathPropName),
          ].filter(Boolean);
          // TODO： 如果为空数组，则说明文件不存在，需要进行上报处理
          return urls;
        }
      } else {
        const name = fileItem[filePropName];
        const type = fileItem.resourceType;
        const urls = [
          getLocalUrl(local, name, type),
          ...getRemoteUrl(remote, name, type, fileItem, pathPropName),
        ].filter(Boolean);
        // TODO： 如果为空数组，则说明文件不存在，需要进行上报处理
        return urls;
      }
    }
  }
  return [];
};

export const getVideoDuration = (
  resourceConfig,
  fileList,
  src,
  resourceType
) => {
  const list = fileList.filter((item) => item.resourceType === resourceType);
  if (list.length > 0) {
    const fileItem = list.find(
      (item: { fileMd5: string }) => item.fileMd5 === src
    );
    if (fileItem) {
      const { derivativeList } = fileItem;
      if (derivativeList && derivativeList.length > 0) {
        const derivativeItem = derivativeList.find(
          (item) => item.resourceType === resourceType
        );
        if (derivativeItem) {
          return derivativeItem.durationSecond;
        }
      } else {
        return fileItem.durationSecond;
      }
    }
  }
};
