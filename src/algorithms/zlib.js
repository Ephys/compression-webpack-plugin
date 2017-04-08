/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra
 */

import { defaultsDeep } from 'lodash';
import { FILE_EXTENSIONS, getOptionalDependency } from '../util';
import type { CompressorOptions } from '../util';

export default function zlibAlgorithm(options: CompressorOptions) {
  const zlib = getOptionalDependency('zlib');

  const algorithmOptions = defaultsDeep(options.algorithmOptions, {
    level: zlib.constants.Z_BEST_COMPRESSION,
    // flush: options.flush,
    // chunkSize: options.chunkSize,
    // windowBits: options.windowBits,
    // memLevel: options.memLevel,
    // strategy: options.strategy,
    // dictionary: options.dictionary,
  });

  let format = algorithmOptions.format || options.algorithm;
  if (typeof format !== 'string' || format === 'zlib') {
    format = 'gzip';
  }

  const fileExtension = FILE_EXTENSIONS[format] || FILE_EXTENSIONS.gzip;
  defaultsDeep(options, {
    asset: `[path].${fileExtension}[query]`,
  });

  const algorithm = zlib[format];
  if (!algorithm) {
    throw new TypeError(`Invalid zlib algorithm ${format}: Not in zlib.`);
  }

  return function compress(content, metadata, callback) {
    algorithm(content, algorithmOptions, callback);
  };
}
