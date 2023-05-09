// const isEnvProduction = process.env.NODE_ENV === 'production';
// const isEnvDevelopment = process.env.NODE_ENV === 'development';
// // 注意要和webpack css 的一致

const isPro = process.env.NODE_ENV === 'production'

const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'entry',
      corejs: 3,
      exclude: [
        'transform-typeof-symbol'
      ]
    }
  ],
  "@babel/preset-typescript"
]

const plugins = [
  isPro && ['babel-plugin-clean-code', {
    clearConsole: true,
    consoleLevel: ['log', 'error', 'info', 'warn'],
    clearDebugger: true,
  }]
].filter(Boolean)
module.exports = { presets, plugins };
