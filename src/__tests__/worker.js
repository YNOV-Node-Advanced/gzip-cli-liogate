const
    fs = require('fs'),
    path = require('path'),
    { mkDirByPathSync, walk, compress } = require('../worker');

describe('mkDirByPathSync', () => {
    it('should create a directory in folder tmp', async () => {
        const path = './tmp/tests';
        mkDirByPathSync(path);
        expect(fs.existsSync(path)).toBe(true);
    });
});
describe('walk', () => {
    it('should find a unique file testing', async () => {
        const files = await walk('./src/__tests__');
        expect(files.length).toEqual(1);
    });
});

describe('compress', () => {
    it('should find the compressed file with .gz', async () => {
        const
         cacheDir = path.resolve(path.dirname(__filename), '../../tmp/tests');
         rawFile = path.resolve(path.dirname(__filename), 'worker.js'),
         compressedFile = path.resolve(cacheDir, '__tests__/worker.js.gz');
        expect(fs.existsSync(compressedFile)).toBe(false);
        try {
            await compress('./tmp/tests', rawFile);
        } catch (err) {
            console.log(err);
        }
        expect(fs.existsSync(compressedFile)).toBe(true);
    });
});
