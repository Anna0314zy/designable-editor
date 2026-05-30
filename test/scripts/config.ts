import path from 'path';

const baseDir = path.resolve(process.env.PWD, 'temp');

const zipDir = path.resolve(baseDir, 'zip');

const unzipDir = path.resolve(baseDir, 'unzip');

export {
    baseDir,
    zipDir,
    unzipDir
}