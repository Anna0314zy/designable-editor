const config = require("./config");
const puppeteer = require("puppeteer");

exports.getBrowser = (() => {
  let browser;
  let Starting = false;
  return async (
    options = {
      headless: true,
      args: config.launchOptionForFC,
      dumpio: !!exports.DEBUG,
    }
  ) => {
    console.log(
      "ishavebrowser",
      typeof browser === "undefined",
      !(await isBrowserAvailable(browser))
    );

    if (
      typeof browser === "undefined" ||
      !(await isBrowserAvailable(browser))
    ) {
      // 本地浏览器正在启动中
      if (Starting) {
        console.log("本地浏览器正在启动中,队列等待");
        await (() => {
          return new Promise((resolve, reject) => {
            setInterval(() => {
              if (browser) {
                resolve();
              }
            }, 10);
          });
        })();
      } else {
        console.log("本地浏览器未启动,开始启动本地浏览器");
        Starting = true;
        browser = await puppeteer.launch(options);
        Starting = false;
        console.log(async (b) => `launch done: ${await browser.version()}`);
      }
    }
    console.log(await browser.version());
    return browser;
  };
})();

const isBrowserAvailable = async (browser) => {
  try {
    await browser.version();
  } catch (e) {
    return false;
  }
  return true;
};
