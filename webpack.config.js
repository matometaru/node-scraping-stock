module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  mode: 'development',
  // ビルドのエントリーポイント（起点）
  entry: {
    "index": './src/index.ts'
  },
  // 出力先
  output: {
    path: __dirname + '/dist',
    // nameには、entryでkeyに指定したエントリーポイントの名前が入る
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: ['ts-loader']
      }
    ]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
};
