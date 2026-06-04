
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
     
    ],
  });
  
  const page = await browser.newPage();
  page.on("console", (msg) => {
    console.log("console", msg.text());
  });
  page.on("error", (err) => {
    console.log("error happen at the page: ", err);
  });
  await page.goto("http://10.254.53.115:5501/common/slide-shot/dist/index.html");
//   await page.screenshot({ path: "test/screenshots/example.png" });
//   await browser.close();
})();
import Axios from "axios";
import { download } from "./download";
import { zipDir } from "./config";
import { listFilesInDirectory, createOrDeleteFolder } from "./utils";

// 下载资源
// 启动浏览器
// 模拟端上行为

const loadTask = async () => {
  await createOrDeleteFolder(zipDir, false);
  await createOrDeleteFolder(zipDir);
  const res = await Axios.get(
    ""
  );
  const resources = res.data.data;
  const {
    baseResource,
    pageResourceList,
    gameTemplateResourceList,
    gameCustomResourceList,
    commonResourceList,
  } = resources;
  // 下载基础资源
  await Promise.all(
    [
      ...commonResourceList,
      ...pageResourceList,
      ...gameTemplateResourceList,
      ...gameCustomResourceList,
      baseResource,
    ].map(async (resource) => {
      await download(resource.urlList[0], zipDir);
    })
  );

  // 解压资源
  const files = listFilesInDirectory(zipDir);
  
  console.log(files);
};
loadTask();

