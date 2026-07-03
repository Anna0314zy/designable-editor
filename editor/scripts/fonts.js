import fs from 'fs';
import path from 'path';

function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
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

let srcFolder = path.join(process.cwd(), 'node_modules', '@slide/fonts', 'fonts');
let destFolder = path.join(process.cwd(), 'public', 'fonts');

copyFolder(srcFolder, destFolder);
