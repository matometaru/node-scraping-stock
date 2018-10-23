module.exports = {
  target: "electron-main",
  node: {
    __dirname: false,
    __filename: false,
  },
  mode: 'development',
  // ビルドのエントリーポイント（起点）
  entry: {
    "main/index": "./src/main/index.ts",
    "renderer/app": "./src/renderer/app.tsx",
  },
  // 出力先
  output: {
    path: __dirname + '/dist',
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.tsx?$/,
        // TypeScript をコンパイルする
        use: ['ts-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json']
  },
};
