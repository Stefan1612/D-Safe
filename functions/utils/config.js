exports.TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const localPathToChrome =
  process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

exports.CHROME_EXECUTABLE_PATH =
  process.env.NODE_ENV === "development" ? localPathToChrome : null;

exports.TWEET_SETTINGS = {
  TWEET_WIDTH: 1000,
  TWEET_PADDING: 40,
  TWEET_HIDE_THREAD: true,
  TWEET_HIDE_CARD: false,
};

exports.ENV =
  process.env.NODE_ENV === "development" ? process.env.NODE_ENV : "production";

exports.PRIMARY_PRIVATE_KEY = process.env.PRIMARY_PRIVATE_KEY;

exports.REACT_APP_ALCHEMY_API_KEY_RINKEBY =
  process.env.REACT_APP_ALCHEMY_API_KEY_RINKEBY;

exports.REACT_APP_PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
exports.REACT_APP_PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;

exports.ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY;
