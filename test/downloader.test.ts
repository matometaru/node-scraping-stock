import 'mocha';
import * as chai from 'chai';
import { PARSE_URL, DOWNLOAD_URL, DELAY } from '../src/config/config';
import Downloader from '../src/Downloader';

// Downloader
const code: string = '3998';
const dlOptions = {
  parseUrl: PARSE_URL,
  downloadUrl: DOWNLOAD_URL,
  delay: DELAY,
};
const downloader = new Downloader(code, dlOptions);

describe('Downloaderのテスト', () => {

  it('保存ディレクトリのパスが正しいか', () => {
    chai.assert.deepEqual({ tea: 'green' }, { tea: 'green' });
  })

  it('csvのパス配列が正しいか', async () => {
    const saveDir = downloader.getSaveDir();
    const csvFiles: string[] = await downloader.getCsvFiles(saveDir);
    chai.assert.deepEqual(['sadfsda', 'test'], csvFiles);
  })
});
