const fs = require("fs");
const COS = require("cos-nodejs-sdk-v5");
const { v4: uuidV4 } = require("uuid");
const getRawBody = require("raw-body");
const axios = require("axios");
const setup = require("./core/setup");
const cosMap = {
  "class-slides-res-test-1313601664":"class-slides-res-test-1313601664.cos.ap-beijing.myqcloud.com",
  "slides-resources-prod-1313601664":"slides-resources-prod-1313601664.cos.ap-beijing.myqcloud.com"
}
const cosHost = cosMap[process.env.COS_BUCKET];

const Host = process.env.HOST;

const cosInstance = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

module.exports.initializer = async (context, callback) => {
  console.log("initializer");
  setup.getBrowser();
  callback(null, "");
};

async function injectVariable(page, key, value) {
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

async function screenshot(response, body, pageSnapshotId) {
  (async () => {
    body.mainContentStructure =
      typeof body.mainContentStructure === "string"
        ? JSON.parse(body.mainContentStructure)
        : body.mainContentStructure;
    const browser = await setup.getBrowser();

    const url = process.env.SHOT_URL;
    const uid = uuidV4();
    const key = uid + ".png";
    const page = await browser.newPage();
    await injectVariable(page, "json", JSON.stringify(body));
    await page.setViewport({
      width: 1300,
      height: 1300,
    });
    // page.on("console", (msg) => {
    //   console.log("console",msg.text());
    // });
    // page.on("error", (err) => {
    //   console.log("error happen at the page: ", err);
    // });
    await page.exposeFunction("generateScreenShot", async () => {
      await page.waitForSelector("#preview");
      console.log("渲染完成");
      const element = await page.$("#preview");
      const buffer = await element.screenshot({
        encoding: "binary",
        type: "png",
      });
      console.log("buffer", buffer);
      await page.close();
      try {
        console.log("开始上传", cosInstance);
        const data = await cosInstance.putObject({
          Bucket: process.env.COS_BUCKET,
          Region: process.env.COS_REGION,
          Key: "/slides/resources/screenshot/" + key,
          Body: buffer,
        });
        console.log("截图完成", data);
        const location = data.Location.replace(cosHost, "");
        console.log("发送的数据", pageSnapshotId, location);
        axios
          .post(`${Host}/classroom-slides/node/callback/page-screenshot`, {
            pageSnapshotId: pageSnapshotId,
            screenshotOssPath: location,
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (error) {
        console.log("截图报错", error);
      }
      response.setStatusCode(200);
      response.setHeader("content-type", "application/json");
      response.send("success");
    });

    let retry = 0;
    let success = false;
    do {
      try {
        await page.goto(url);
        success = true;
      } catch (e) {
        retry++;
        if (retry >= 6) {
          throw e;
        }
      }
    } while (!success && retry < 6);
  })().catch((err) => {
    console.log("catch error", err.message);
  });
}

module.exports.handler = function (request, response, context) {
  console.log("request", request.headers);
  const pageSnapshotId = request.headers.pagesnapshotid;
  getRawBody(
    request,
    {
      length: request.headers["content-length"],
      limit: "10mb",
      encoding: "utf-8",
    },
    function (err, data = "{}") {
      if (err) {
        console.log("err1", err);
        // response.setStatusCode(500);
        // response.setHeader('content-type', 'text/plain');
        // response.send(err.message);
      }

      var body = JSON.parse(data);
      screenshot(response, body, pageSnapshotId)
        .then((outputFile) => {
          // Get screenshot successful return
        })
        .catch((err) => {
          // Get screenshot failed return
          console.log("err2", err);
          response.setStatusCode(500);
          response.setHeader("content-type", "text/plain");
          response.send(err.message);
        });
    }
  );
};
