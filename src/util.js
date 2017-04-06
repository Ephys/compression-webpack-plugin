/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra
 */

export function getOptionalDependency(module) {
  try {
    // eslint-disable-next-line global-require
    return require(module);
  } catch (err) {
    throw new Error(`Dependency ${module} not found, please run npm install --save-dev ${module}`);
  }
}

export function toBuffer(contents) {
  if (Buffer.isBuffer(contents)) {
    return contents;
  }

  return new Buffer(contents, 'utf-8');
}

export const FILE_EXTENSIONS = {
  brotli: 'br',
  gzip: 'gz',
  deflate: 'zz',
};

export type CompressorOptions = {
  algorithm: string | Function,
  algorithmOptions: Object,
  asset: string,
  test: RegExp | RegExp[],
  threshold: number,
  minRatio: number,
  deleteOriginalAssets: boolean,
};
