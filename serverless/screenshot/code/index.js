const fs = require("fs");
const path = require("path");

const COS = require("cos-nodejs-sdk-v5");
const { v4: uuidV4 } = require("uuid");
const axios = require("axios");
const setup = require("./core/setup");
// COS 返回的 Location 可能带 bucket 域名，这里维护已知 bucket 到域名的映射，
// 后面会把完整地址清洗成业务侧需要的 OSS 相对路径。
const cosMap = {
  "qiqi2-1329132138":"https://qiqi2-1329132138.cos.ap-beijing.myqcloud.com",
  "qiqi2-1329132138":"https://qiqi2-1329132138.cos.ap-beijing.myqcloud.com"
}
const cosHost =
  cosMap[process.env.COS_BUCKET] ||
  (process.env.COS_BUCKET && process.env.COS_REGION
    ? `${process.env.COS_BUCKET}.cos.${process.env.COS_REGION}.myqcloud.com`
    : "");

const Host = process.env.HOST;

// COS 配置齐全时上传到 COS；否则走本地落盘，方便本地调试截图服务。
const canUploadToCos = Boolean(
  process.env.COS_BUCKET &&
    process.env.COS_REGION &&
    process.env.COS_SECRET_ID &&
    process.env.COS_SECRET_KEY
);

const cosInstance = canUploadToCos
  ? new COS({
      SecretId: process.env.COS_SECRET_ID,
      SecretKey: process.env.COS_SECRET_KEY,
    })
  : null;

module.exports.initializer = async (context, callback) => {
  console.log("initializer");
  // 云函数冷启动时预热浏览器，减少第一张截图的等待时间。
  // 预热失败不能阻塞函数初始化，真实请求进来时 getBrowser 还会再尝试启动。
  setup.getBrowser().catch((error) => {
    console.log("browser preload failed", error.message);
  });
  callback(null, "");
};

async function injectVariable(page, key, value) {
  // 在截图页自己的 JS 执行前注入 window[key]。
  // common/slide-shot 会读取 window.json 来还原当前页的页面结构和资源列表。
  await page.evaluateOnNewDocument(
    ({ key, value }) => {
      Object.defineProperty(window, key, {
        get: function () {
          return value;
        },
      });
    },
    { key, value }
  );
}

async function persistScreenshot(buffer, key) {
  const objectKey = `slides/resources/screenshot/${key}`;
  const screenshotOssPath = `/${objectKey}`;

  // 线上环境：把 Puppeteer 截到的 PNG buffer 上传到 COS，并返回业务使用的相对路径。
  if (canUploadToCos) {
    console.log("开始上传 COS", {
      bucket: process.env.COS_BUCKET,
      region: process.env.COS_REGION,
      key: objectKey,
    });
    const data = await cosInstance.putObject({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Key: objectKey,
      Body: buffer,
    });
    const location = data.Location
      ? data.Location.replace(/^https?:\/\//, "").replace(cosHost, "")
      : screenshotOssPath;
    return {
      mode: "cos",
      screenshotOssPath: location.startsWith("/") ? location : `/${location}`,
      cosLocation: data.Location,
    };
  }

  // 本地环境：没有 COS 密钥时直接写本地文件，但返回路径仍保持 OSS 路径格式。
  const outputDir =
    process.env.LOCAL_SCREENSHOT_DIR ||
    path.resolve(__dirname, ".tmp", "screenshots");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, key);
  fs.writeFileSync(outputPath, buffer);
  console.log("未配置 COS，截图已写入本地", outputPath);
  return {
    mode: "local",
    screenshotOssPath,
    localFilePath: outputPath,
  };
}

async function callbackScreenshot(pageSnapshotId, screenshotOssPath) {
  // 可选回调：通知业务服务“某个页面快照截图完成”，业务侧再把路径写回数据库。
  if (!Host) {
    console.log("未配置 HOST，跳过截图回调", {
      pageSnapshotId,
      screenshotOssPath,
    });
    return;
  }
  await axios.post(`${Host}/classroom-slides/node/callback/page-screenshot`, {
    pageSnapshotId,
    screenshotOssPath,
  });
}

function readRequestBody(request) {
  // 云函数 HTTP 入参是 stream，这里手动聚合成完整 JSON 字符串。
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8") || "{}"));
    request.on("error", reject);
  });
}

function getHeader(headers = {}, key) {
  const lowerKey = key.toLowerCase();
  const matchedKey = Object.keys(headers).find((headerKey) => headerKey.toLowerCase() === lowerKey);
  return matchedKey ? headers[matchedKey] : undefined;
}

function parseTencentEventBody(event = {}) {
  // 腾讯云事件函数通过 event.body 传入 HTTP 请求体；base64 场景要先解码再 JSON.parse。
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf-8")
    : event.body || "{}";
  return typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
}

function createTencentResponse() {
  let done;
  const headers = {};
  const result = {
    isBase64Encoded: false,
    statusCode: 200,
    headers,
    body: "",
  };
  const promise = new Promise((resolve) => {
    done = resolve;
  });

  return {
    // 复用 screenshot 内部的 response 写法，把阿里云 response API 适配成腾讯云返回对象。
    response: {
      setStatusCode(statusCode) {
        result.statusCode = statusCode;
      },
      setHeader(key, value) {
        headers[key] = value;
      },
      send(body) {
        result.body = body;
        done(result);
      },
    },
    promise,
  };
}

async function screenshot(response, body, pageSnapshotId) {
  let page;
  let completed = false;

  // 所有成功、失败都从这里返回，completed 防止截图回调重复响应。
  const sendJson = (statusCode, payload) => {
    if (completed) return;
    completed = true;
    response.setStatusCode(statusCode);
    response.setHeader("content-type", "application/json");
    response.send(JSON.stringify(payload));
  };

  try {
    body.mainContentStructure =
      typeof body.mainContentStructure === "string"
        ? JSON.parse(body.mainContentStructure)
        : body.mainContentStructure;
    const browser = await setup.getBrowser();

    // SHOT_URL 指向 common/slide-shot 构建出的静态页面，它负责把 window.json 渲染成 #preview。
    const url = process.env.SHOT_URL;
    if (!url) {
      throw new Error("缺少 SHOT_URL 配置");
    }
    const uid = uuidV4();
    const key = uid + ".png";
    page = await browser.newPage();

    // 把本次请求的页面结构和资源列表注入到截图页，截图页加载时会读取 window.json。
    await injectVariable(page, "json", JSON.stringify(body));

    // 视口略大于实际课件尺寸 1280x960，真正截图区域由 #preview 元素决定。
    await page.setViewport({
      width: 1300,
      height: 1300,
    });

    // 把浏览器内部日志透传到云函数日志，便于排查资源加载、渲染报错。
    page.on("console", (msg) => {
      console.log("page console", msg.type(), msg.text());
    });
    page.on("pageerror", (err) => {
      console.log("page error", err.message);
    });
    page.on("requestfailed", (request) => {
      console.log("request failed", request.url(), request.failure()?.errorText);
    });

    // 暴露给截图页调用：前端确认图片/背景等资源加载完后，会调用 window.generateScreenShot()。
    await page.exposeFunction("generateScreenShot", async () => {
      if (completed) return;
      try {
        await page.waitForSelector("#preview", { timeout: 10_000 });
        console.log("渲染完成");

        // 只截课件画布元素，不截整个浏览器窗口。
        const element = await page.$("#preview");
        // waitForSelector 理论上已经保证元素存在；这里保留防御，避免空句柄导致报错信息不清晰。
        if (!element) {
          throw new Error("未找到 #preview 元素");
        }
        const buffer = await element.screenshot({
          encoding: "binary",
          type: "png",
        });
        console.log("截图 buffer 大小", buffer.length);
        await page.close();

        // 截图落 COS 或本地，然后把路径同步给调用方和可选回调接口。
        const result = await persistScreenshot(buffer, key);
        console.log("截图完成", result);
        // 回调业务服务失败不抹掉截图结果：调用方仍能拿到 screenshotOssPath，业务侧可重试补写。
        await callbackScreenshot(pageSnapshotId, result.screenshotOssPath).catch((error) => {
          console.log("截图回调失败", {
            pageSnapshotId,
            screenshotOssPath: result.screenshotOssPath,
            message: error.message,
          });
        });
        sendJson(200, {
          success: true,
          pageSnapshotId,
          ...result,
        });
      } catch (error) {
        console.log("截图报错", error);
        if (page) await page.close().catch(() => {});
        sendJson(500, {
          success: false,
          pageSnapshotId,
          message: error.message,
        });
      }
    });

    let retry = 0;
    let success = false;
    do {
      try {
        // 只等 DOMContentLoaded，具体资源是否加载完由截图页自己判断并回调 generateScreenShot。
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
        success = true;
      } catch (e) {
        retry++;
        if (retry >= 6) {
          throw e;
        }
      }
    } while (!success && retry < 6);
  } catch (err) {
    console.log("catch error", err.message);
    if (page) await page.close().catch(() => {});
    sendJson(500, {
      success: false,
      pageSnapshotId,
      message: err.message,
    });
  }
}

module.exports.handler = async function (request, response, context) {
  console.log("request", request.headers);
  // pageSnapshotId 用来把截图结果和发布快照中的具体页面关联起来。
  const pageSnapshotId = request.headers.pagesnapshotid;
  try {
    const data = await readRequestBody(request);
    const body = JSON.parse(data);
    await screenshot(response, body, pageSnapshotId);
  } catch (err) {
    console.log("err2", err);
    response.setStatusCode(500);
    response.setHeader("content-type", "application/json");
    response.send(JSON.stringify({
      success: false,
      message: err.message,
    }));
  }
};

module.exports.main_handler = async function (event, context) {
  console.log("tencent event headers", event.headers);
  const { response, promise } = createTencentResponse();

  try {
    const body = parseTencentEventBody(event);
    // 腾讯云事件函数的 HTTP 头可能保留原始大小写，这里做大小写不敏感读取。
    const pageSnapshotId = getHeader(event.headers, "pagesnapshotid");
    await screenshot(response, body, pageSnapshotId);
    return await promise;
  } catch (err) {
    console.log("tencent handler error", err);
    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: err.message,
      }),
    };
  }
};
