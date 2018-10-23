/**
 * 非同期処理内で使うスリープ
 * @param {number} 待機時間(ms)
 * @return {Promise}
 */
export declare const sleep: (time: number) => Promise<{}>;
/**
 * 処理時間の測定
 * @param {Function} 計測したい関数
 */
export declare const measure: (callback: () => void) => void;
/**
 * 証券コードかどうか
 * @param {string} 証券コード
 * @return {boolean}
 */
export declare const isStockCode: (v: string) => boolean;
