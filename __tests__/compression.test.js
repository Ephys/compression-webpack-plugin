import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import expect from 'expect';
import rimraf from 'rimraf';
import CompressionPlugin from '../src';

const BUNDLE_FILE = 'bundle.js';
const RES_DIR = path.join(__dirname, 'resources');
const BUILD_DIR = path.join(__dirname, 'build');

describe('CompressPlugin', () => {
  beforeEach((cb) => {
    rimraf(BUILD_DIR, cb);
  });

  it('Uses zlib.gzip by default', async () => {
    await run();

    expect(fileExists(path.join(BUILD_DIR, 'bundle.js.gz'))).toEqual(true, '.gz file should exist');
    expect(fileExists(path.join(BUILD_DIR, 'bundle.js.br'))).toEqual(false, '.br file should not exist');
  });

  it('Has support for node-zopfli', async () => {
    await run({
      algorithm: 'zopfli',
    });

    expect(fileExists(path.join(BUILD_DIR, 'bundle.js.gz'))).toEqual(true, '.gz file should exist');
    expect(fileExists(path.join(BUILD_DIR, 'bundle.js.br'))).toEqual(false, '.br file should not exist');
  });

  it('Has support for brotli', async () => {
    await run({
      algorithm: 'brotli',
    });

    expect(fileExists(path.join(BUILD_DIR, 'bundle.js.gz'))).toEqual(false, '.gz file should not exist');
    expect(fileExists(path.join(BUILD_DIR, 'bundle.js.br'))).toEqual(true, '.br file should exist');
  });

  it('Can run multiple compression algorithms', async () => {
    await run([{
      algorithm: 'gzip',
    }, {
      algorithm: 'brotli',
    }]);

    expect(fileExists(path.join(BUILD_DIR, 'bundle.js.gz'))).toEqual(true, '.gz file should exist');
    expect(fileExists(path.join(BUILD_DIR, 'bundle.js.br'))).toEqual(true, '.br file should exist');
  });

  afterAll((cb) => {
    rimraf(BUILD_DIR, cb);
  });
});

function run(opts) {
  const compiler = webpack(buildConfig(opts));
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stats);
    });
  });
}

function buildConfig(opts = {}) {
  return {
    entry: path.join(RES_DIR, 'app.js'),
    output: {
      filename: BUNDLE_FILE,
      path: BUILD_DIR,
    },
    plugins: [
      new CompressionPlugin(opts),
    ],
  };
}

function fileExists(file) {
  try {
    fs.statSync(file);
    return true;
  } catch (e) {
    return false;
  }
}
