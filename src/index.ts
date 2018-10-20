import { PARSE_URL, DOWNLOAD_URL, DELAY } from './config';
import Downloader from './Downloader';
const code: string = process.argv[2];

(<any>window).MyNamespace

// Downloader
const dlOptions = {
  parseUrl: PARSE_URL,
  downloadUrl: DOWNLOAD_URL,
  delay: DELAY,
};
const downloader = new Downloader(code, dlOptions);
const options = downloader.getOption();
console.log(options);

// Uploader
// const upOptions = {
//   url    : 'http://localhost/admin/datasets',
// }
// const uploader = new Uploader(upOptions);
// uploader->run();
