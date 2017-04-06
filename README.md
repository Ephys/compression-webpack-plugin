[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![chat][chat]][chat-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>Compression Plugin</h1>
  <p>Compression plugin for Webpack.<p>
</div>

## Install

```bash
npm i -D compression-webpack-plugin
```

## Base Usage

```javascript
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  plugins: [
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
```

Options:

* `asset: string`: The target asset name. `[file]` is replaced with the original asset. `[path]` is replaced with the path of the original asset and `[query]` with the query. 
   Defaults depend on the used compression algorithm.
* `algorithm`: The name of one of the built-in algorithms, or a function which returns a compress function.
* `algorithmOptions`: An object containing the options of the algorithm. Defaults depend on the used algorithm.
* `test: RegExp|RegExp[]`: All assets matching this RegExp are processed. Defaults to every asset.
* `threshold: number`: Only assets bigger than this size are processed. In bytes. Defaults to `0`.
* `minRatio: number`: Only assets that compress better that this ratio are processed. Defaults to `0.8`.
* `deleteOriginalAssets: boolean`: Whether to delete the original assets or not. Defaults to `false`.

## Algorithm Options

```javascript
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  plugins: [
    new CompressionPlugin({
      test: /\.(js|html)$/,
      algorithm: "gzip",
      algorithmOptions: {
        // options for the gzip compression algorithm
        level: zlib.constants.Z_BEST_COMPRESSION,
      },
    }),
  ],
};
```

## Algorithms

### `zlib` (aliases: `gzip`, `deflate`)

Option for gzip and deflate can be found [in the zlib documentation](https://nodejs.org/api/zlib.html#zlib_class_options)
* format: Default: gzip,
* level: Default: zlib.constants.Z_BEST_COMPRESSION,

If you specify `gzip` or `deflate` as the algorithm name, `zlib` will be used instead, with the requested format.
```javascript
// e.g. 
{ algorithm: 'deflate' }
// is interpreted as
{ algorithm: 'zlib', algorithmOptions: { format: 'deflate' } }
```

### `zopfli`

You need to have `node-zopfli` installed to use this compression algorithm.

Option arguments for Zopfli (see [node-zopfli](https://github.com/pierreinglebert/node-zopfli#options) doc for details):
* format: Default: gzip,
* verbose: Default: false,
* verbose_more: Default: false,
* numiterations: Default: 15,
* blocksplitting: Default: true,
* blocksplittinglast: Default: false,
* blocksplittingmax: Default: 15

### `brotli`

You need to have `iltorb` installed to use this compression algorithm.

The options for brotli can be found [in the ilorb documentation](https://github.com/MayhemYDG/iltorb#brotliparams)

### Custom

You can pass a factory function instead of strings as values for `algorithm`. There are examples of such functions in
 `src/algorithms`.

## Using multiple compression algorithms

You can compress your assets using different compression algorithms by passing an array or configuration objects instead
of a single object. Useful when you want to support newer algorithms but need to stay compatible with older browsers.

```javascript
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  plugins: [
    new CompressionPlugin([{
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }, {
      asset: "[path].br[query]",
      algorithm: "brotli",
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 1.0,
    }]),
  ],
};
```

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/533616?v=3&s=150">
        </br>
        <a href="https://github.com/SpaceK33z">Kees Kluskens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/3408176?v=3&s=150">
        </br>
        <a href="https://github.com/TheLarkInn">Sean Larkin</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/webpack-loader-seed.svg
[npm-url]: https://npmjs.com/package/webpack-loader-seed

[deps]: https://david-dm.org/webpack-contrib/webpack-loader-seed.svg
[deps-url]: https://david-dm.org/webpack-contrib/webpack-loader-seed

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
