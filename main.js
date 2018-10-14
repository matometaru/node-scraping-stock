const {siteUrl} = require('./config.js');

// httpモジュールより簡潔
const request = require('request');
// const url = require('url');
const fs = require('fs');
// 文字コードを変換する
const iconv = require('iconv-lite');
// csv
const transform = require('stream-transform');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify');
const generate = require('csv-generate');

// 証券コード
const code = process.argv[2];

// csvのヘッダー
const csvHeaders = ['date','open','high','low','close','volume','close_adj'];

// 引数の指定がないならエラー
if (!code) {
  console.error('引数を指定してください');
  return;
}

// 保存先のディクレトリ作成
const saveDir = `${__dirname}/download/${code}`;
if (!fs.existsSync(saveDir)) {
  fs.mkdirSync(saveDir);
}

// 指定したurlからダウンロード
const download = (targetUrl) => {
  const years = ['2018', '2017'];
  const options = {
    url: targetUrl,
    method: 'POST',
    form: {
      'code': code,
    },
  };

  years.filter((year) => {
    options.form.year = year;
    request(options).pipe(iconv.decodeStream("utf-8")).pipe(fs.createWriteStream(`${saveDir}/${year}.csv`));
  });
};

// csvファイルのパスを配列で返す
const getCsvFiles = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) throw err;
      const fileList = files
        .map((file) => { return `${dir}/${file}`; })
        .filter((filePath) => { return fs.statSync(filePath).isFile() && /.*\.csv$/.test(filePath) });
      resolve(fileList);
    });
  });
}

const generateAllCsv = (dir) => {
  getCsvFiles(dir).then(
    (csvFiles) => {
      /* 途中 */
      let all = [];
      all[0] = csvHeaders;
      csvFiles.filter((csvFile) => {
        const data = fs.readFileSync(csvFile);
        const d = parse(data, {
          relax_column_count: true
        });
        let a = d.splice(0, 2);
        all = all.concat(d);
      });
      const dest = fs.createWriteStream('dest.txt', 'utf8');
      all.pipe(dest);
      /* 途中 */
    },
    (err) => {
      console.log(err);
    }
  );
}

// download(`${siteUrl}/stock/file.php`);
// console.log(saveDir);
generateAllCsv(saveDir);
// const a = generate({
//   delimiter: '|',
//   length: 20
// }).pipe(dest);
