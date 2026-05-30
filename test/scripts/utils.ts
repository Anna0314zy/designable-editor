import fs from "fs";
import path from "path";

export function listFilesInDirectory(directoryPath, onlyFiles = false) { 
    const files = fs.readdirSync(directoryPath).map(file => {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile() || (!onlyFiles && stat.isDirectory())) {
            return filePath;
        }
    });

    return files.filter(Boolean);  // 过滤掉 null 和 undefined
}


export function createOrDeleteFolder(pathname: string, create = true) {
    if (create) {
      if (fs.existsSync(pathname)) {
        if (fs.statSync(pathname).isDirectory()) {
          fs.rmdirSync(pathname, { recursive: true });
        } else {
          fs.unlinkSync(pathname);
        }
      }
  
      fs.mkdirSync(pathname, { recursive: true });
    } else {
      if (fs.existsSync(pathname)) {
        if (fs.statSync(pathname).isDirectory()) {
          fs.rmdirSync(pathname, { recursive: true });
        } else {
          fs.unlinkSync(pathname);
        }
      }
    }
  }