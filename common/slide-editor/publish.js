const fs = require('fs');

// 读取 package.json 文件
const packageJsonPath = './package.json';
const packageJson = require(packageJsonPath);

// 解析当前版本号
const currentVersion = packageJson.version;

// 更新版本号
const newVersion = incrementVersion(currentVersion); // 自定义逻辑来更新版本号

// 更新 package.json 中的版本号
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`版本号已更新为 ${newVersion}`);

// 自定义逻辑来递增版本号
function incrementVersion(version) {
  const versionParts = version.split('.');
  const major = parseInt(versionParts[0]);
  const minor = parseInt(versionParts[1]);
  const patch = parseInt(versionParts[2]);

  // 自定义逻辑来递增版本号，这里以增加 patch 版本号为例
  const newPatch = patch + 1;

  return `${major}.${minor}.${newPatch}`;
}