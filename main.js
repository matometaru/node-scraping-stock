const {PARSE_URL, DOWNLOAD_URL, DELAY} = require('./config.js');

/** 
 * # 使用モジュール
 * - request   : httpモジュールより簡潔
 * - fs        : ファイルシステム
 * - bl        : ストリームをコレクション
 * - iconv     : 文字コード変換
 * - client    : クライアント、html解析
 * - transform : csvデータの置換
 * - parse     : csvを解析
 * - stringify : csvのストリームを文字列化
 * - path      : ファイルパスの文字列操作
 */
const request = require('request');
const fs = require('fs');
const bl = require('bl');
const iconv = require('iconv-lite');
const client = require('cheerio-httpcli');
const transform = require('stream-transform');
const parse = require('csv-parse');
const stringify = require('csv-stringify');
const path = require('path');

// 証券コード
const code = process.argv[2];

const isFourDigits = (v) => /^[0-9]{4}$/.test(v);

// csvのヘッダー
const csvHeaders = 'code,date,open,high,low,close,volume,close_adj';

if (!code) {
  throw new Error('引数がありません!!');
}

if (!isFourDigits(code)) {
  throw new Error('証券コード以外の値が入力されました!!');
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
        if(isFourDigits(year)) {
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
      for (let i = 0; i < years.length; i++) {
        options.form.year = years[i];
        request(options).pipe(iconv.decodeStream("utf-8")).pipe(bl((err, data) => {
          const dest = fs.createWriteStream(`${saveDir}/${years[i]}.csv`, 'utf8');
          dest.write(data);
          if ( i === years.length - 1 ) {
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
        .filter((filePath) => { 
          return fs.statSync(filePath).isFile() && /.*\.csv$/.test(filePath) && isFourDigits(path.basename(filePath, '.csv'));
        });
      console.log(fileList);
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
  const filepath = `${saveDir}/all.csv`;
  // ここストリームの必要ある？
  // const stream = fs.createWriteStream(filepath, 'utf8');
  // stream.write(`${csvHeaders}\n`);
  // for (let i = 0; i < results.length; i++) {
  //   stream.write(results[i]);
  // }
  // stream.end();

  // 上書き処理
  let data = `${csvHeaders}\n`;
  for (let i = 0; i < results.length; i++) {
    data += results[i];
  }
  fs.writeFileSync(filepath, data);
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
