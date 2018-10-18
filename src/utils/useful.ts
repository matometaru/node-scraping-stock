const {performance} = require('perf_hooks');

/**
 * 非同期処理内で使うスリープ
 * @param {number} 待機時間(ms)
 * @return {Promise}
 */
const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

/**
 * 処理時間の測定
 * @param {Function} 計測したい関数
 */
const measure = (callback) => {
  const startTime = performance.now(); // 開始時間
  callback();
  const endTime = performance.now(); // 終了時間
  console.log(endTime - startTime);
};

const merge = (obj, ...sources) => {
  each(sources, source => {
    each(source, (value, key) => {
      obj[key] = value;
    });
  });
  return obj;
};

export default {
  sleep,
  merge,
  measure,
};
