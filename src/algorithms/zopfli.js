/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra
 */

import { defaultsDeep } from 'lodash';
import { FILE_EXTENSIONS, getOptionalDependency } from '../util';
import type { CompressorOptions } from '../util';

export default function zopfliAlgorithm(options: CompressorOptions) {
  const zopfli = getOptionalDependency('node-zopfli');

  const algorithmOptions = defaultsDeep(options.algorithmOptions, {
    format: 'gzip',
    verbose: false,
    verbose_more: false,
    numiterations: 15,
    blocksplitting: true,
    blocksplittinglast: false,
    blocksplittingmax: 15,
  });

  const { format } = algorithmOptions;
  delete algorithmOptions.format;

  const fileExtension = FILE_EXTENSIONS[format] || FILE_EXTENSIONS.gzip;
  defaultsDeep(options, {
    asset: `[path].${fileExtension}[query]`,
  });

  return function compress(content, metadata, callback) {
    zopfli.compress(content, format, algorithmOptions, callback);
  };
}
