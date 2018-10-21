"use strict";
exports.__esModule = true;
var performance = require('perf_hooks').performance;
/**
 * 非同期処理内で使うスリープ
 * @param {number} 待機時間(ms)
 * @return {Promise}
 */
exports.sleep = function (time) {
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
 * 処理時間の測定
 * @param {Function} 計測したい関数
 */
exports.measure = function (callback) {
    var startTime = performance.now(); // 開始時間
    callback();
    var endTime = performance.now(); // 終了時間
    console.log(endTime - startTime);
};
