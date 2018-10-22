/**
 * # 使用モジュール
 * - request     : httpモジュールより簡潔
 * - fs          : ファイルシステム
 * - iconv       : 文字コード変換
 * - cheerio     : html解析
 * - path        : ファイルパスの文字列操作
 * - bl          : ストリームをコレクション
 * - transform   : csvデータの置換
 * - parse       : csvを解析
 * - stringify   : csvのストリームを文字列化
 */
import * as request from 'request';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import * as cheerio from 'cheerio';
import * as path from 'path';
// 型定義がないモジュール
const bl = require('bl');
const transform = require('stream-transform');
const parse = require('csv-parse');
const stringify = require('csv-stringify');

import { sleep } from '../utils/useful';

interface Context {
  parseUrl: string;
  downloadUrl: string;
  delay: number;
}

const csvHeaders = 'code,date,open,high,low,close,volume,close_adj';
const isFourDigits = (v: string) => /^[0-9]{4}$/.test(v);

export default class Downloader {

  static defaults: Context = {
    parseUrl: '',
    downloadUrl: '',
    delay: 2000,
  };

  private code: string;
  private saveDir: string = '';
  private options: Context;

  constructor(code: string, options: Context) {
    this.code = code;
    this.options = Object.assign(Downloader.defaults, options);
    this.boot();
  }

  /**
   * 引数チェック、ファイル作成などの初期化処理
   */
  boot() {
    if (!this.code) {
      throw new Error('引数がありません!!');
    }
    if (!isFourDigits(this.code)) {
      throw new Error('証券コード以外の値が入力されました!!');
    }

    // 保存先のディクレトリ作成
    this.saveDir = `${__dirname}/../download/${this.code}`;
    if (!fs.existsSync(this.saveDir)) {
      fs.mkdirSync(this.saveDir);
    }
  }

  /**
   * メイン実行
   */
  run() {
    console.log("run");
    (async () => {
      console.log("開始");
      const years: string[] = await this.parseYears();
      await this.downloadByYears(years);
      const csvFiles: string[] = await this.getCsvFiles(this.saveDir);
      await this.generateAllCsv(csvFiles);
      console.log("終了");
    })();
  }

  /**
   * ゲッター
   * @return {string}
   */
  getSaveDir() {
    return this.saveDir;
  }

  /**
   * ゲッター
   * @return {Object}
   */
  getOption(): Context {
    return this.options;
  }

  /**
   * htmlから年をスクレイピングして配列で返す
   * @return {Promise} 年の配列
   */
  parseYears(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const years: string[] = [];
      request({ uri: `${this.options.parseUrl}${this.code}/` }, (err, res, body) => {
        const $ = cheerio.load(body);
        $('.stock_yselect li').each(function (this: Cheerio) {
          const year: string = $(this).text();
          if (isFourDigits(year)) {
            years.push(year);
          }
        });
        if (res.statusCode !== 200) {
          reject(`parseYears: ${res.statusCode} ${err}`);
        }
        resolve(years);
      });
    });
  }

  /**
   * 年の配列からcsvファイルのダウンロードする
   * @param {Array.<number>}  years ダウンロードする年の配列
   * @return {Promise} 保存完了したかどうか
   */
  downloadByYears(years: string[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        url: this.options.downloadUrl,
        method: 'POST',
        form: {
          'code': this.code,
          'year': '',
        },
      };

      (async () => {
        for (let i = 0; i < years.length; i++) {
          requestOptions.form.year = years[i];
          request(requestOptions).on('response', (res: any) => {
            if (res.statusCode !== 200) {
              throw new Error(`
                リクエストに失敗しました。
                status: ${res.statusCode},
                url   : ${this.options.downloadUrl},
                code  : ${this.code},
                year  : ${years[i]},
              `);
            }
          }).pipe(iconv.decodeStream("utf-8")).pipe(bl((err: Error, data: string) => {
            if (err) {
              reject(err);
            }
            const dest = fs.createWriteStream(`${this.saveDir}/${years[i]}.csv`, 'utf8');
            dest.write(data);
            if (i === years.length - 1) {
              resolve(true);
            }
          }));
          await sleep(this.options.delay);
        }
      })();
    });
  }

  /**
   * ディレクトリにあるcsvファイルのパス配列を返す
   * @param {string} ディレクトリの絶対パス
   * @return {Promise} パスの配列
   */
  getCsvFiles(dir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err: Error, files: string[]) => {
        if (err) reject(err);
        const fileList = files
          .map((file: string) => { return `${dir}/${file}`; })
          .filter((filePath: string) => {
            // 拡張子がcsvであり、ファイル名が4桁の数字である
            return /.*\.csv$/.test(filePath) && isFourDigits(path.basename(filePath, '.csv'));
          });
        resolve(fileList);
      });
    });
  }

  /**
   * 全てのcsvファイルを加工&結合し、新しいcsvを作成する
   * @param {Array.<string>} csvFiles
   */
  generateAllCsv(csvFiles: string[]): Promise<{}> {
    return new Promise((resolve, reject) => {
      let count = 0;
      const results: string[] = [];
      csvFiles.filter((csvFile) => {
        // csv形式のデータ
        const csvData = fs.readFileSync(csvFile);
        parse(csvData, {
          from: 3,
          relax_column_count: true, // 不整合な列数を破棄
        })
          .pipe(transform((record: string[]) => {
            record.unshift(this.code);
            return record;
          }))
          .pipe(stringify())
          .pipe(bl((err: Error, data: string) => {
            if (err) reject(err);
            results[count] = data;
            count++;
            if (count === csvFiles.length) {
              this.writeResults(results);
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
  writeResults(results: string[]) {
    const filepath = `${this.saveDir}/all.csv`;
    let data = `${csvHeaders}\n`;
    for (let i = 0; i < results.length; i++) {
      data += results[i];
    }
    fs.writeFileSync(filepath, data);
  }

}
