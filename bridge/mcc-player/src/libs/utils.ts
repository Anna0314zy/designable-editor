// 本地生成唯一uid
// function uuid(a?: number): string {
//   return a
//     ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
//     : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
// }

// 获取URL参数
function getUrlKey(name, url = window.location.href) {
return (
    decodeURIComponent(
    // eslint-disable-next-line no-sparse-arrays
    (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [
        ,
        '',
    ])[1].replace(/\+/g, '%20')
    ) || null
);
}
  
function isIos(): boolean {
const UA = window.navigator.userAgent.toLowerCase();
// var isIE = UA && /msie|trident/.test(UA);
// var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
// var isEdge = UA && UA.indexOf('edge/') > 0;
// var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
// var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
// var isPhantomJS = UA && /phantomjs/.test(UA);
// var isFF = UA && UA.match(/firefox\/(\d+)/);
return !!isIOS;
}
function isAndroid(): boolean {
const UA = window.navigator.userAgent.toLowerCase();
return !!UA && UA.indexOf('android') > 0;
}

export { getUrlKey, isIos, isAndroid };
  