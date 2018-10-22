import { PARSE_URL, DOWNLOAD_URL, DELAY } from './config/config';
import Downloader from './Downloader';
const code: string = process.argv[2];

// Downloader
const dlOptions = {
  parseUrl: PARSE_URL,
  downloadUrl: DOWNLOAD_URL,
  delay: DELAY,
};
const downloader = new Downloader(code, dlOptions);
console.log(downloader.getOption());
// downloader.run();
