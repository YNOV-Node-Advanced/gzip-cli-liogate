const
    { promisify } = require('util'),
    fs = require('fs'),
    zlib = require('zlib'),
    path = require('path');

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
  return true;
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

const currentDir = path.dirname(__filename);
function compress(dstDir, filePath) {
    return new Promise((resolve, reject) => {
        let zip = zlib.createGunzip();
        relativePath = filePath.replace(currentDir, '');
        mkDirByPathSync(path.dirname(dstDir + relativePath));
        const gzip = zlib.createGzip();
        const ws = fs.createWriteStream(dstDir + relativePath + '.gz');
        const rs = fs.createReadStream(filePath);
        rs
          .on('end', resolve)
          .on('error', reject);
        rs.pipe(gzip).pipe(ws);
    });
}

module.exports = {
    mkDirByPathSync,
    walk,
    compress
}
