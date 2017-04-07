/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra
 */

import async from 'async';
import Compressor from './Compressor';
import type { CompressorOptions } from './util';

export default class CompressionPlugin { // eslint-disable-line

  constructor(options: CompressorOptions | CompressorOptions[]) {
    if (Array.isArray(options)) {
      this.compressors = options.map(o => new Compressor(o));
    } else {
      this.compressors = [new Compressor(options)];
    }
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, optimizeCallback) => {
      const { assets } = compilation;

      async.forEach(this.compressors, (compressor, cb) => {
        compressor.processAssets(assets, cb);
      }, optimizeCallback);
    });
  }
}
