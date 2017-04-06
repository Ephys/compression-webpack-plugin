/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra
 */

import { defaultsDeep } from 'lodash';
import { FILE_EXTENSIONS, getOptionalDependency } from '../util';
import type { CompressorOptions } from '../util';

export default function zopfliAlgorithm(options: CompressorOptions) {
  const iltorb = getOptionalDependency('iltorb');

  defaultsDeep(options, { asset: `[path].${FILE_EXTENSIONS.brotli}[query]` });

  return function compress(content, callback) {
    iltorb.compress(content, options.algorithmOptions, callback);
  };
}
