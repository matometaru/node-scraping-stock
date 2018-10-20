/*! @preserve node-scraping-stock v1.0.0 - Ryosuke | MIT License */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('cheerio-httpcli')) :
    typeof define === 'function' && define.amd ? define(['cheerio-httpcli'], factory) :
    (factory(global.client));
}(this, (function (client) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    // ダウンロード先のリンク
    var PARSE_URL = 'https://kabuoji3.com/stock/';
    // ダウンロード先のリンク
    var DOWNLOAD_URL = 'https://kabuoji3.com/stock/file.php';
    // ダウンロードの間隔(ms)
    var DELAY = 2000;

    var performance = require('perf_hooks').performance;
    /**
     * 非同期処理内で使うスリープ
     * @param {number} 待機時間(ms)
     * @return {Promise}
     */
    var sleep = function (time) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }, time);
        });
    };

    /**
     * # 使用モジュール
     * - request     : httpモジュールより簡潔
     * - fs          : ファイルシステム
     * - bl          : ストリームをコレクション
     * - iconv       : 文字コード変換
     * - client      : クライアント、html解析
     * - transform   : csvデータの置換
     * - parse       : csvを解析
     * - stringify   : csvのストリームを文字列化
     * - path        : ファイルパスの文字列操作
     */
    var request = require('request');
    var fs = require('fs');
    var bl = require('bl');
    var iconv = require('iconv-lite');
    var transform = require('stream-transform');
    var parse = require('csv-parse');
    var stringify = require('csv-stringify');
    var path = require('path');
    var csvHeaders = 'code,date,open,high,low,close,volume,close_adj';
    var isFourDigits = function (v) { return /^[0-9]{4}$/.test(v); };
    var Downloader = /** @class */ (function () {
        function Downloader(code, options) {
            this.saveDir = '';
            this.code = code;
            this.options = Object.assign(Downloader.defaults, options);
            this.boot();
        }
        /**
         * 引数チェック、ファイル作成などの初期化処理
         */
        Downloader.prototype.boot = function () {
            if (!this.code) {
                throw new Error('引数がありません!!');
            }
            if (!isFourDigits(this.code)) {
                throw new Error('証券コード以外の値が入力されました!!');
            }
            // 保存先のディクレトリ作成
            this.saveDir = __dirname + "/download/" + this.code;
            if (!fs.existsSync(this.saveDir)) {
                fs.mkdirSync(this.saveDir);
            }
        };
        /**
         * メイン実行
         */
        Downloader.prototype.run = function () {
        };
        /**
         * ゲッター
         * @return {string}
         */
        Downloader.prototype.getSaveDir = function () {
            return this.saveDir;
        };
        /**
         * ゲッター
         * @return {Object}
         */
        Downloader.prototype.getOption = function () {
            return this.options;
        };
        /**
         * htmlから年をスクレイピングして配列で返す
         * @return {Promise} 年の配列
         */
        Downloader.prototype.parseYears = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var param = {};
                var years = [];
                client.fetch("" + _this.options.parseUrl + _this.code + "/", param, function (err, $, res) {
                    $('.stock_yselect li').each(function () {
                        var year = $(this).text();
                        if (isFourDigits(year)) {
                            years.push(year);
                        }
                    });
                    if (res.statusCode !== 200) {
                        reject("parseYears: " + res.statusCode + " " + err);
                    }
                    resolve(years);
                });
            });
        };
        /**
         * 年の配列からcsvファイルのダウンロードする
         * @param {Array.<number>}  years ダウンロードする年の配列
         * @return {Promise} 保存完了したかどうか
         */
        Downloader.prototype.downloadByYears = function (years) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var requestOptions = {
                    url: _this.options.downloadUrl,
                    method: 'POST',
                    form: {
                        'code': _this.code,
                        'year': '',
                    },
                };
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var _loop_1, this_1, i;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _loop_1 = function (i) {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                requestOptions.form.year = years[i];
                                                request(requestOptions).on('response', function (res) {
                                                    if (res.statusCode !== 200) {
                                                        throw new Error("\n                \u30EA\u30AF\u30A8\u30B9\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n                status: " + res.statusCode + ",\n                url   : " + _this.options.downloadUrl + ",\n                code  : " + _this.code + ",\n                year  : " + years[i] + ",\n              ");
                                                    }
                                                }).pipe(iconv.decodeStream("utf-8")).pipe(bl(function (err, data) {
                                                    if (err) {
                                                        reject(err);
                                                    }
                                                    var dest = fs.createWriteStream(_this.saveDir + "/" + years[i] + ".csv", 'utf8');
                                                    dest.write(data);
                                                    if (i === years.length - 1) {
                                                        resolve(true);
                                                    }
                                                }));
                                                return [4 /*yield*/, sleep(this_1.options.delay)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                this_1 = this;
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < years.length)) return [3 /*break*/, 4];
                                return [5 /*yield**/, _loop_1(i)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })();
            });
        };
        /**
         * ディレクトリにあるcsvファイルのパス配列を返す
         * @param {string} ディレクトリの絶対パス
         * @return {Promise} パスの配列
         */
        Downloader.prototype.getCsvFiles = function (dir) {
            return new Promise(function (resolve, reject) {
                fs.readdir(dir, function (err, files) {
                    if (err)
                        reject(err);
                    var fileList = files
                        .map(function (file) { return dir + "/" + file; })
                        .filter(function (filePath) {
                        // 拡張子がcsvであり、ファイル名が4桁の数字である
                        return /.*\.csv$/.test(filePath) && isFourDigits(path.basename(filePath, '.csv'));
                    });
                    resolve(fileList);
                });
            });
        };
        /**
         * 全てのcsvファイルを加工&結合し、新しいcsvを作成する
         * @param {Array.<string>} csvFiles
         */
        Downloader.prototype.generateAllCsv = function (csvFiles) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var count = 0;
                var results = [];
                csvFiles.filter(function (csvFile) {
                    // csv形式のデータ
                    var csvData = fs.readFileSync(csvFile);
                    parse(csvData, {
                        from: 3,
                        relax_column_count: true,
                    })
                        .pipe(transform(function (record) {
                        record.unshift(_this.code);
                        return record;
                    }))
                        .pipe(stringify())
                        .pipe(bl(function (err, data) {
                        if (err)
                            reject(err);
                        results[count] = data;
                        count++;
                        if (count === csvFiles.length) {
                            _this.writeResults(results);
                            resolve();
                        }
                    }));
                });
            });
        };
        /**
         * 文字列配列をcsvに書き出す
         * @param {Array} 文字列配列
         */
        Downloader.prototype.writeResults = function (results) {
            var filepath = this.saveDir + "/all.csv";
            var data = csvHeaders + "\n";
            for (var i = 0; i < results.length; i++) {
                data += results[i];
            }
            fs.writeFileSync(filepath, data);
        };
        Downloader.defaults = {
            parseUrl: '',
            downloadUrl: '',
            delay: 2000,
        };
        return Downloader;
    }());

    var _this = undefined;
    var code = process.argv[2];
    // Downloader
    var dlOptions = {
        parseUrl: PARSE_URL,
        downloadUrl: DOWNLOAD_URL,
        delay: DELAY,
    };
    var downloader = new Downloader(code, dlOptions);
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var years, saveDir, csvFiles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, downloader.parseYears()];
                case 1:
                    years = _a.sent();
                    return [4 /*yield*/, downloader.downloadByYears(years)];
                case 2:
                    _a.sent();
                    saveDir = downloader.getSaveDir();
                    return [4 /*yield*/, downloader.getCsvFiles(saveDir)];
                case 3:
                    csvFiles = _a.sent();
                    return [4 /*yield*/, downloader.generateAllCsv(csvFiles)];
                case 4:
                    _a.sent();
                    console.log("完了");
                    return [2 /*return*/];
            }
        });
    }); })();
    // Uploader
    // const upOptions = {
    //   url    : 'http://localhost/admin/datasets',
    // }
    // const uploader = new Uploader(upOptions);
    // uploader->run();

})));
