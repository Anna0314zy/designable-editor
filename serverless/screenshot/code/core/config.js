const launchOptionForFC = [
  // error when launch(); No usable sandbox! Update your kernel
  "--no-sandbox",
  // error when launch(); Failed to load libosmesa.so
  "--disable-gpu",
  // freeze when newPage()
  // '--single-process',
  "--proxy-server=direct://",
  "--proxy-bypass-list=*",
  "--allow-file-access-from-files",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--no-first-run",
  "--no-zygote",
  "--ignore-certificate-errors",
];
// "--no-sandbox",
// 禁用 Chromium 沙箱。很多云函数环境内核权限不足，会报：
// "--disable-setuid-sandbox",
// 禁用 setuid sandbox。通常和 --no-sandbox 一起出现在容器/Serverless 里，避免沙箱权限问题。
// "--disable-gpu",
// 禁用 GPU。Serverless 通常没有可用 GPU 或图形库，可能报：
// "--no-first-run",
// "--no-zygote",

// "--proxy-server=direct://",
// "--proxy-bypass-list=*",
// 所有地址都绕过代理。配合上一个参数，基本就是强制直连。
// "--allow-file-access-from-files",
// 允许 file:// 页面访问其他本地文件。比如打开本地 HTML、加载本地资源时可能用到。但如果截图页都是 HTTP/HTTPS，这个不一定必要。


module.exports = {
    launchOptionForFC
};
