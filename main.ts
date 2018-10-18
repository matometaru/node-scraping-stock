const {PARSE_URL, DOWNLOAD_URL, DELAY} = require('./config.js');
const Downloader = require('./src/Downloader.js');
const code = process.argv[2];

// Downloader
const dlOptions = {
  parseUrl: PARSE_URL,
  downloadUrl: DOWNLOAD_URL,
  delay: DELAY,
  code: code,
};
const downloader = new Downloader(dlOptions);
const options = downloader.getOption();
console.log(options);

// Uploader
// const upOptions = {
//   url    : 'http://localhost/admin/datasets',
// }
// const uploader = new Uploader(upOptions);
// uploader->run();
