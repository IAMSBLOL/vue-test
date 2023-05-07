// const postcssNormalize = require('postcss-normalize');
// hideNothingWarning: true
// 开发时貌似默认不搞这个，所以会警告，禁止就行了
module.exports = {
  sourceMap: false,
  plugins: [
    // postcssNormalize(),
    // require('postcss-flexbugs-fixes'),
    require('tailwindcss'),
    require('postcss-preset-env')({
      autoprefixer: {
      }
      // stage: 3,
    })
  ],
  hideNothingWarning: true
}
