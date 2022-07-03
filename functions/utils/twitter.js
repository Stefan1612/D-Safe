const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const fetch = require("node-fetch");

const { CHROME_EXECUTABLE_PATH, TWITTER_BEARER_TOKEN } = require("./config");

const getTweetId = (tweetURL) => {
  const splitTweetURL = tweetURL.split("/");
  const lastItem = splitTweetURL[splitTweetURL.length - 1];
  const splitLastItem = lastItem.split("?");
  return splitLastItem[0];
};

exports.getTweetId = getTweetId;

const getAttributes = ({ data, includes }, theme) => [
  {
    trait_type: "attachments", // e.g 2
    value:
      data.attachments && data.attachments.media_keys
        ? data.attachments.media_keys.length
        : 0,
  },
  {
    trait_type: "polls", // e.g 1
    value:
      data.attachments && data.attachments.poll_ids
        ? data.attachments.poll_ids.length
        : 0,
  },
  // {
  //   trait_type: "language", // e.g "en"
  //   value: language,
  // },
  {
    display_type: "date",
    trait_type: "creation", // e.g 1546360800
    value: new Date(data.created_at).getTime(),
  },
  {
    trait_type: "retweets", // e.g 155
    value: data.public_metrics.retweet_count,
  },
  {
    trait_type: "replies", // e.g 66
    value: data.public_metrics.reply_count,
  },
  {
    trait_type: "likes", // e.g 401
    value: data.public_metrics.like_count,
  },
  {
    trait_type: "quotes", // e.g 45
    value: data.public_metrics.quote_count,
  },
  {
    trait_type: "theme", // e.g "light" or "dark"
    value: theme,
  },
  {
    trait_type: "verified", // e.g "yes" or "no"
    value: includes.users.verified ? "yes" : "no",
  },
  {
    trait_type: "username", // e.g SuperDuper2000
    value: includes.users[0].username,
  },
  {
    trait_type: "user id", // e.g 177101260
    value: includes.users[0].id,
  },
  {
    trait_type: "characters", // e.g 120
    value: data.text.length,
  },
  {
    trait_type: "device", // e.g "Twitter Web App"
    value: data.source,
  },
];

exports.getMetadata = async (tweetURL, theme) => {
  const tweetId = getTweetId(tweetURL);
  const api = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=attachments,created_at,lang,text,public_metrics,source&user.fields=verified&expansions=author_id`;
  const headers = {
    Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
  };

  return new Promise((resolve, reject) => {
    fetch(api, { method: "GET", headers: headers })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          throw new Error(res.errors[0].detail);
        } else {
          const { username } = res.includes.users[0];
          const attributes = getAttributes(res, theme);

          const metadata = {
            name: `@${username} #${tweetId}`,
            description: `Tweet by @${username}.\nOriginal: ${tweetURL}`,
            external_link: "https://time-travellers.netlify.app",
            attributes: attributes,
          };
          resolve(metadata);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.createScreenshot = async ({
  language,
  width,
  theme,
  padding,
  hideCard,
  hideThread,
  tweetURL,
}) => {
  const tweetId = getTweetId(tweetURL);

  try {
    const browser = await puppeteer.launch({
      // args: chromium.args, // https://github.com/alixaxel/chrome-aws-lambda/blob/master/source/index.ts
      // --use-gl=swiftshader -> Throws Navigation failed because browser has disconnected!
      executablePath: CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process"],
    });

    const page = await browser.newPage();
    await page.goto(
      `https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-0&frame=false&hideCard=${hideCard}&hideThread=${hideThread}&id=${tweetId}&lang=${language}&theme=${theme}&widgetsVersion=ed20a2b%3A1601588405575`,
      { waitUntil: "networkidle0" }
    );

    const embedDefaultWidth = 550;
    const percent = width / embedDefaultWidth;
    const pageWidth = embedDefaultWidth * percent;
    const pageHeight = 100;
    await page.setViewport({ width: pageWidth, height: pageHeight });

    await page.evaluate(
      (props) => {
        const style = document.createElement("style");
        style.innerHTML =
          "* { font-family: -apple-system, BlinkMacSystemFont, Ubuntu, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !important; }";
        document.getElementsByTagName("head")[0].appendChild(style);

        const body = document.querySelector("body");
        body.style.margin = `${props.padding}px`;
        body.style.height = "100%";
        body.style.padding = "0px";
        body.style.backgroundImage =
          "url('https://drive.google.com/uc?id=16kNGv7U9CUjcHNjm1em374Uc1QXMey53')";
        body.style.backgroundColor = "#131318";
        // body.style.backgroundSize = "auto";
        // body.style.backgroundRepeat = "no-repeat";

        body.style.zoom = `${100 * props.percent}%`;

        const articleWrapper = document.querySelector("#app > div");
        articleWrapper.style.border = "none";

        const tweet = document.querySelector("#app > div > div > div");
        tweet.style.backgroundColor = "#fff";
      },
      { theme, padding, percent }
    );

    await page.waitForTimeout(1000);

    const imageBuffer = await page.screenshot({
      type: "png",
      fullPage: true,
      encoding: "base64",
    });

    await browser.close();

    return imageBuffer;
  } catch (err) {
    const msg = "Could not clone the Tweet!";
    console.log(msg, err);
    throw new Error(msg);
  }
};

exports.checkTweetURL = (tweetURL) => {
  const tweetId = getTweetId(tweetURL);
  const api = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=created_at`;

  const headers = {
    Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
  };

  return new Promise((resolve, reject) => {
    fetch(api, { method: "GET", headers: headers })
      .then((res) => res.json())
      .then((res) => {
        // TODO: check for res.statusCode === 200?
        if (res.errors) {
          if (res.errors[0].title === "Not Found Error") {
            throw new Error("This Tweet doesn't seem to exist!");
          }
          throw new Error(res.errors[0].detail);
        } else {
          let start = new Date();
          start.setDate(start.getDate());
          start.setUTCHours(0, 0, 0, 0);
          start = start.getTime();

          let end = new Date(); // TODO: is the end date useless?
          end.setDate(end.getDate());
          end.setUTCHours(23, 59, 59, 999);
          end = end.getTime();

          const tweetPosted = new Date(res.data.created_at).getTime();
          console.log("res", tweetPosted, start, end);
          if (tweetPosted < start || tweetPosted > end) {
            throw new Error("This Tweet wasn't posted today!");
          }
          resolve();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
