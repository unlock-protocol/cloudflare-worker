// module.exports = {
//   target: 'webworker',
//   mode: "production"
// };

// We need this because https://github.com/ethers-io/ethers.js/issues/1886
// But we should be able to remove that soon and just use
// `skipFetchSetup`
module.exports = {
  target: 'webworker',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            {
              search: 'request.mode = "cors";',
              replace: '/* request.mode = "cors"; */',
            },
            {
              search: 'request.cache = "no-cache";',
              replace: '/* request.cache = "no-cache"; */',
            },
            {
              search: 'request.credentials = "same-origin";',
              replace: '/* request.credentials = "same-origin"; */',
            },
            {
              search: 'request.referrer = "client";',
              replace: '/* request.referrer = "client"; */',
            },
          ],
        },
      },
    ],
  },
}
