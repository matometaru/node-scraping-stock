interface Context {
    parseUrl: string;
    downloadUrl: string;
    delay: number;
}
export default class Downloader {
    static defaults: Context;
    private code;
    private saveDir;
    private options;
    constructor(code: string, options: Context);
    /**
     * 引数チェック、ファイル作成などの初期化処理
     */
    boot(): void;
    /**
     * メイン実行
     */
    run(): void;
    /**
     * ゲッター
     * @return {string}
     */
    getSaveDir(): string;
    /**
     * ゲッター
     * @return {Object}
     */
    getOption(): Context;
    /**
     * htmlから年をスクレイピングして配列で返す
     * @return {Promise} 年の配列
     */
    parseYears(): Promise<string[]>;
    /**
     * 年の配列からcsvファイルのダウンロードする
     * @param {Array.<number>}  years ダウンロードする年の配列
     * @return {Promise} 保存完了したかどうか
     */
    downloadByYears(years: string[]): Promise<{}>;
    /**
     * ディレクトリにあるcsvファイルのパス配列を返す
     * @param {string} ディレクトリの絶対パス
     * @return {Promise} パスの配列
     */
    getCsvFiles(dir: string): Promise<string[]>;
    /**
     * 全てのcsvファイルを加工&結合し、新しいcsvを作成する
     * @param {Array.<string>} csvFiles
     */
    generateAllCsv(csvFiles: string[]): Promise<{}>;
    /**
     * 文字列配列をcsvに書き出す
     * @param {Array} 文字列配列
     */
    writeResults(results: string[]): void;
}
export {};
