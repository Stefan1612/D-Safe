export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://time-travellers.netlify.app";

export const FUNCTIONS_PREFIX = "/.netlify/functions";

export const URL_TO_TWEET_ID = (tweetURL) => {
  const splitTweetURL = tweetURL.split("/");
  const lastItem = splitTweetURL[splitTweetURL.length - 1];
  const splitLastItem = lastItem.split("?");
  return splitLastItem[0];
};

export const { REACT_APP_PINATA_API_KEY } = process.env;
export const { REACT_APP_PINATA_API_SECRET } = process.env;

export const { REACT_APP_ALCHEMY_API_KEY_RINKEBY } = process.env;

export const PINATA_PREFIX = "https://gateway.pinata.cloud/ipfs/";
