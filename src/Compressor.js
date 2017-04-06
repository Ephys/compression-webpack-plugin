/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra
 */

import url from 'url';
import zlib from 'zlib';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';
import zlibAlgorithm from './algorithms/zlib';
import zopfli from './algorithms/zopfli';
import brotli from './algorithms/brotli';
import { toBuffer } from './util';
import type { CompressorOptions } from './util';

export default class Compressor {

  // options can be an array
  constructor(options: CompressorOptions = {}) {
    options.algorithm = options.algorithm || 'gzip';
    options.algorithmOptions = options.algorithmOptions || {};

    this.algorithm = getAlgorithm(options.algorithm)(options);

    if (typeof this.algorithm !== 'function') {
      throw new TypeError('algorithm option must be a factory function. Take a look at built-in algorithms for examples.');
    }

    this.asset = options.asset || '[path].gz[query]';
    this.test = options.test;
    this.threshold = options.threshold || 0;
    this.minRatio = options.minRatio || 0.8;
    this.deleteOriginalAssets = options.deleteOriginalAssets !== void 0 ? options.deleteOriginalAssets : false;
  }

  processAssets(assets, callback) {
    async.forEach(Object.keys(assets), (fileName, asyncCallback) => {
      this.processFile(fileName, assets[fileName], (err, compressedSource) => {
        if (err) {
          asyncCallback(err);
          return;
        }

        if (!compressedSource) {
          return;
        }

        const parse = url.parse(fileName);
        const sub = {
          fileName,
          path: parse.pathname,
          query: parse.query || '',
        };

        const newFile = this.asset.replace(/\[(file|path|query)\]/g, (p0, p1) => sub[p1]);
        assets[newFile] = compressedSource;
        if (this.deleteOriginalAssets) {
          delete assets[fileName];
        }

        asyncCallback();
      });
    }, callback);
  }

  mayProcessFile(file) {
    if (!this.test) {
      return true;
    }

    if (Array.isArray(this.test)) {
      return !this.test.every(test => !test.test(file));
    }

    return this.test.test(file);
  }

  processFile(fileName, asset, callback) {
    if (!this.mayProcessFile(fileName)) {
      callback();
      return;
    }

    const contents = toBuffer(asset.source());
    const originalSize = contents.length;

    if (originalSize < this.threshold) {
      return callback();
    }

    this.algorithm(contents, { fileName, asset }, (err, result) => {
      if (err) {
        return callback(err);
      }

      if (result.length / originalSize > this.minRatio) {
        return callback();
      }

      callback(null, new RawSource(result));
    });
  }
}

const algorithms = {
  zopfli,
  zlib: zlibAlgorithm,
  brotli,
};

function getAlgorithm(algorithm) {

  switch (typeof algorithm) {
    case 'function':
      // version custom, user-defined
      return algorithm;

    case 'string':
      // algorithm supported by compression-webpack-plugin
      if (algorithms[algorithm]) {
        return algorithms[algorithm];
      }

      // algorithm present inside node's zlib
      if (zlib[algorithm]) {
        return zlibAlgorithm;
      }

      throw new TypeError(`Unknown algorithm name ${algorithm}.`);

    default:
      throw new TypeError(`Unknown algorithm option type ${typeof algorithm}.`);
  }
}
