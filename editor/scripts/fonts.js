import fs from 'fs';
import path from 'path';

function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  let items = fs.readdirSync(src);

  items.forEach(item => {
    let oldPath = path.join(src, item);
    let newPath = path.join(dest, item);

    if (fs.statSync(oldPath).isDirectory()) {
      // 如果是目录，递归复制
      copyFolder(oldPath, newPath);
    } else {
      // 如果是文件，直接复制
      fs.copyFileSync(oldPath, newPath);
    }
  });
}

let srcFolder = path.join(process.env.PWD, 'node_modules', '@slide/fonts', 'fonts');
let destFolder = path.join(process.env.PWD, 'public', 'fonts');

copyFolder(srcFolder, destFolder);