const {siteUrl} = require('./config.js');

// httpモジュールより簡潔
const request = require('request');
// const url = require('url');
const fs = require('fs');
// ストリームをコレクション
const bl = require('bl');
// 文字コードを変換する
const iconv = require('iconv-lite');
// csv 
const transform = require('stream-transform');
const parse = require('csv-parse');
const stringify = require('csv-stringify');
const generate = require('csv-generate');

// 証券コード
const code = process.argv[2];

// csvのヘッダー
const csvHeaders = 'code,date,open,high,low,close,volume,close_adj';

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
      let count = 0;
      const results = [];
      // csvFiles = ['/Users/ryosuke/works/node-scraping-stock/download/3798/2017.csv']
      csvFiles.filter((csvFile) => {
        // csv形式のデータ
        const csvData = fs.readFileSync(csvFile);
        parse(csvData, {
          from: 3,
          relax_column_count: true, // 不整合な列数を破棄
        })
        .pipe(transform((record) => {
          // console.log(`${count}:${record[0]}`);
          record.unshift(code);
          return record;
        }))
        .pipe(stringify())
        .pipe(bl((err, data) => {
          results[count] = data;
          count++;
          if(count === 2) {
            printResults(results);
          }
        }));
      });
    },
    (err) => {
      console.log(err);
    }
  );
}

const printResults = (results) => {
  const dest = fs.createWriteStream('dest.txt', 'utf8');
  dest.write(`${csvHeaders}\n`);
  for (let i = 0; i < results.length; i++) {
    dest.write(results[i]);
  }
  dest.end();
}

// download(`${siteUrl}/stock/file.php`);
// console.log(saveDir);
generateAllCsv(saveDir);
// const a = generate({
//   delimiter: '|',
//   length: 20
// }).pipe(dest);
