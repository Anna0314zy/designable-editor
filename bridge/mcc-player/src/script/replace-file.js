/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const packageConfig = require("../../package.json");

const filePath = `dist/${packageConfig.version}/cocos.html`;
// 向 cocos.html 中插入script标签，引入fetch.min.js
const scriptTag = '<script src="./fetch.min.js" charset="utf-8"></script>\n';

fs.readFile(filePath, "utf8", function (err, data) {
  if (err) {
    return console.error("读取文件时出错:", err);
  }

  // 查找第一个<script>标签
  const scriptIndex = data.indexOf("<script");

  // 如果找到<script>标签，则插入到第一个<script>标签前面
  if (scriptIndex !== -1) {
    const updatedData =
      data.substring(0, scriptIndex) + scriptTag + data.substring(scriptIndex);
    writeFile(filePath, updatedData);
  } else {
    // 如果没有找到<script>标签，查找</body>标签
    const bodyEndIndex = data.indexOf("</body>");
    if (bodyEndIndex !== -1) {
      // 插入到</body>标签前面
      const updatedData =
        data.substring(0, bodyEndIndex) +
        scriptTag +
        data.substring(bodyEndIndex);
      writeFile(filePath, updatedData);
    } else {
      console.error("没有找到</body>标签");
    }
  }
});

function writeFile(filePath, updatedData) {
  fs.writeFile(filePath, updatedData, "utf8", function (err) {
    if (err) {
      return console.error("写入文件时出错:", err);
    }
    console.log("文件已更新，新的<script>标签已插入。");
  });
}
