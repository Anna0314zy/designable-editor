/**
 * @description: 获取url参数
 * @param {string} url  url
 * @param {string} key 对应key
 * @return {*}
 */
export function getUrlParams(url: string, key?: string): string | Record<string, string> {
  const searchParams = new URLSearchParams(url.split('?')[1]);

  if (key) {
    return searchParams.get(key) || '';
  }

  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}