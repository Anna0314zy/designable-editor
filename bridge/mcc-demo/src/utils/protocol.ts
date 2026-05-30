export enum PROTOCOL {
  HTTPS = 'https',
  HTTP = 'http',
  WS = 'ws',
  WSS = 'wss',
  FILE = 'file',
  FTP = 'ftp',
  FTPS = 'ftps',
  ABOUT = 'about',
  MAILTO = 'mailto',
  OWCR = 'owcr',
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
    localHost: (url: string): boolean => url.indexOf('localhost:') > -1,
  },
  get: (url: string): string => {
    if (protocol.is[PROTOCOL.HTTPS](url)) {
      return PROTOCOL.HTTPS;
    }
    if (protocol.is[PROTOCOL.HTTP](url)) {
      if (protocol.is.localHost(url)) {
        return 'localhost';
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
    return '';
  },
};
export const isLocalHost = (url: string): boolean => protocol.is.localHost(url);
