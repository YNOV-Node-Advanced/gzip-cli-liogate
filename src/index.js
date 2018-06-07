const
    fs = require('fs'),
    path = require('path'),
    { promisify } = require('util'),
    zlib = require('zlib');

function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code !== 'EEXIST') {
          console.log(err);
      }
    }

    return curDir;
  }, initDir);
}

const readdir = promisify(fs.readdir).bind(fs);
const fsstat = promisify(fs.stat).bind(fs);
async function walk (dir) {
    const list = await readdir(dir);
    let pending = list.length;
    if(!pending) return [];

    const promises = list.map(async file => {
        file = path.resolve(dir, file);
        let stat = await fsstat(file);
        if (stat && stat.isDirectory()) {
            return await walk(file);
        } else {
            return file;
        }
    });
    let results = [];
    let promResults = (await Promise.all(promises)).map(res => results = results.concat(res));
    return results;
};

async function init(cacheDir) {
    let files = await walk('./src');
    var zip = zlib.createGunzip();
    const currentDir = path.dirname(__filename);
    const tmpDir = 'tmp'
    //relativeiles = files.map(file => file.replace(currentDir, ''))
    files.map(filePath => {
        relativePath = filePath.replace(currentDir, '');
        mkDirByPathSync(path.dirname(tmpDir + relativePath));
        const gzip = zlib.createGzip();
        const ws = fs.createWriteStream(tmpDir + relativePath + '.gz');
        fs.createReadStream(filePath).pipe(gzip).pipe(ws);
    });
    console.log(files.length + ' files writted successfully');
}
const cacheDir = './tmp'

init('./tmp');

module.exports = {
    walk,
    mkDirByPathSync,
}
