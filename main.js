const {PARSE_URL, DOWNLOAD_URL, DELAY} = require('./config.js');

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
// クライアント、html抽出
const client = require('cheerio-httpcli');

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

/** 
 * htmlから年をスクレイピングして配列で返す
 * @return {Array} 年の配列
 */
const parseYears = () => {
  return new Promise((resolve, reject) => {
    const param = {};
    const years = [];
    const html = client.fetch(`${PARSE_URL}${code}/`, param, (err, $, res) => {
      $('.stock_yselect li').each(function(idx) {
        const year = $(this).text();
        if(year.match('^[0-9]{4}$')) {
          years.push(year);
        }
      });
      resolve(years);
    });
  });
}

/** 
 * 年の配列からcsvファイルのダウンロードする
 * @param {Array}  years ダウンロードする年の配列
 * @return {boolean} 保存完了したかどうか
 */
const downloadByYears = (years) => {
  return new Promise((resolve, reject) => {
    const options = {
      url: DOWNLOAD_URL,
      method: 'POST',
      form: {
        'code': code,
      },
    };

    (async () => {
      for (let i = 0; i <= years.length; i++) {
        options.form.year = years[i];
        request(options).pipe(iconv.decodeStream("utf-8")).pipe(bl((err, data) => {
          const dest = fs.createWriteStream(`${saveDir}/${years[i]}.csv`, 'utf8');
          dest.write(data);
          console.log(i);
          if ( i === years.length - 1 ) {
            console.log('downloadByYears 解決');
            resolve(true);
          }
        }));
        await sleep(DELAY);
      }
    })();
  });
}

/** 
 * ディレクトリにあるcsvファイルのパス配列を返す
 * @param {string} ディレクトリの絶対パス
 * @return {Array} パスの配列
 */
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

/** 
 * 全てのcsvファイルを加工&結合し、新しいcsvを作成する
 * @param {Array} csvFiles
 */
const generateAllCsv = (csvFiles) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const results = [];
    csvFiles.filter((csvFile) => {
      // csv形式のデータ
      const csvData = fs.readFileSync(csvFile);
      parse(csvData, {
        from: 3,
        relax_column_count: true, // 不整合な列数を破棄
      })
      .pipe(transform((record) => {
        record.unshift(code);
        return record;
      }))
      .pipe(stringify())
      .pipe(bl((err, data) => {
        results[count] = data;
        count++;
        if (count === csvFiles.length) {
          writeResults(results);
          resolve();
        }
      }));
    });
  });
}

/** 
 * 文字列配列をcsvに書き出す
 * @param {Array} 文字列配列
 */
const writeResults = (results) => {
  const dest = fs.createWriteStream('dest.txt', 'utf8');
  dest.write(`${csvHeaders}\n`);
  for (let i = 0; i < results.length; i++) {
    dest.write(results[i]);
  }
  dest.end();
}

/** 
 * 非同期処理内で使うスリープ
 * @param {number} 待機時間(ms)
 */
const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

const main = async () => {
  const years = await parseYears();
  await downloadByYears(years);
  const csvFiles = await getCsvFiles(saveDir);
  await generateAllCsv(csvFiles);
  console.log('完了');
}

// 実行
main();
