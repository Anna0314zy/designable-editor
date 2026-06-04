const config = require("./config");
const puppeteer = require("puppeteer");
const fs = require("fs");

// 热实例内复用同一个 browser；冷启动或平台扩容时，每个实例会各自维护一份。
let browser;
let browserPromise;

function getLayerExecutablePath() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "/opt/bin/chromium",
    "/opt/bin/chromium-browser",
    "/opt/chromium/chrome",
    "/opt/headless-chromium",
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function createLaunchOptions(options) {
  if (options) return options;

  const layerExecutablePath = getLayerExecutablePath();
  if (layerExecutablePath) {
    return {
      headless: true,
      executablePath: layerExecutablePath,
      args: config.launchOptionForFC,
      dumpio: !!exports.DEBUG,
    };
  }

  try {
    const chromium = require("@sparticuz/chromium");
    return {
      headless: chromium.headless,
      executablePath: await chromium.executablePath(),
      args: [...chromium.args, ...config.launchOptionForFC],
      dumpio: !!exports.DEBUG,
    };
  } catch (error) {
    console.log("未找到可用 Chromium Layer 或 @sparticuz/chromium", error.message);
  }

  return {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: config.launchOptionForFC,
    dumpio: !!exports.DEBUG,
  };
}

exports.getBrowser = async (options) => {
  const launchOptions = await createLaunchOptions(options);

  // 如果已经有请求在启动浏览器，直接等待同一个启动任务。
  if (browserPromise) {
    console.log("本地浏览器正在启动中,等待同一个启动任务");
    return browserPromise;
  }

  const checkedBrowser = browser;

  // 已有浏览器且连接正常时直接复用，避免每次截图都重新启动 Chromium。
  if (await isBrowserAvailable(checkedBrowser)) {
    console.log("reuse browser", await checkedBrowser.version());
    return checkedBrowser;
  }

  // 上面的 await 会让出执行权；如果这期间别的请求已经启动或替换了 browser，
  // 当前请求不要基于旧检查结果继续清空/启动，递归走一遍最新状态即可。
  if (browserPromise) {
    console.log("本地浏览器正在启动中,等待同一个启动任务");
    return browserPromise;
  }
  if (browser !== checkedBrowser) {
    return exports.getBrowser(options);
  }

  // browser 存在但已不可用时丢弃引用，下方会重新拉起一个新实例。
  browser = undefined;

  // 并发请求同时进来时，只允许第一个请求真正 launch；
  // 后续请求 await 同一个 Promise，避免启动多个浏览器实例抢内存。
  console.log("本地浏览器未启动或已断开,开始启动本地浏览器");
  browserPromise = Promise.resolve()
    .then(() => puppeteer.launch(launchOptions))
    .then(async (newBrowser) => {
      browser = newBrowser;
      console.log(`launch done: ${await browser.version()}`);
      return browser;
    })
    .catch((error) => {
      // 启动失败时清空 browser，避免后续请求复用半初始化状态。
      browser = undefined;
      throw error;
    })
    .finally(() => {
      // 无论启动成功还是失败，都释放启动锁；失败后下一次调用可以重试。
      browserPromise = undefined;
    });

  return browserPromise;
};

const isBrowserAvailable = async (browser) => {
  if (!browser) return false;

  try {
    await browser.version();
  } catch (e) {
    return false;
  }
  return true;
};
