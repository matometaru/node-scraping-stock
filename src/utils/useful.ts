const { performance } = require('perf_hooks');

/**
 * 非同期処理内で使うスリープ
 * @param {number} 待機時間(ms)
 * @return {Promise}
 */
export const sleep = (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve();
      } catch (e) {
        reject(e);
      }
    }, time);
  });
};

/**
 * 処理時間の測定
 * @param {Function} 計測したい関数
 */
export const measure = (callback: () => void) => {
  const startTime = performance.now(); // 開始時間
  callback();
  const endTime = performance.now(); // 終了時間
  console.log(endTime - startTime);
};
