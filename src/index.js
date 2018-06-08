const
    { walk, compress } = require('./worker'),
    zlib = require('zlib');

async function init(sourceDir, cacheDir) {
    let files = await walk(sourceDir);
    files.map(async filePath => await compress(cacheDir, filePath));
    console.log(files.length + ' files writted successfully');
}
const
    args = process.argv.splice(2),
    srcDir = args[0] || 'src',
    dstDir = args[1] || 'tmp';
console.log('Reading on ' + srcDir + ' and writting on ' + dstDir);

init(srcDir, dstDir);
