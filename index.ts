import * as Twitter from "twitter"

const TW_CONSUMER_KEY = process.env.TW_CONSUMER_KEY || "XXXXXXXXXXXXXXXXX"
const TW_CONSUMER_SEC = process.env.TW_CONSUMER_SEC || "XXXXXXXXXXXXXXXXX"
const TW_ACCESS_TOKEN_KEY =
  process.env.TW_ACCESS_TOKEN_KEY || "XXXXXXXXXXXXXXXXX"
const TW_ACCESS_TOKEN_SEC =
  process.env.TW_ACCESS_TOKEN_SEC || "XXXXXXXXXXXXXXXXX"

var client = new Twitter({
  consumer_key: TW_CONSUMER_KEY,
  consumer_secret: TW_CONSUMER_SEC,
  access_token_key: TW_ACCESS_TOKEN_KEY,
  access_token_secret: TW_ACCESS_TOKEN_SEC
})

client.stream(
  "statuses/filter",
  {
    track: "clubhouse"
    //locations: '18.3074488,-34.3583284,19.0046700,-33.4712700'
  },
  function(stream) {
    stream.on("data", function(tweet) {
      console.log(tweet.text)
    })
    stream.on("error", function(error) {
      console.log(error)
    })
  }
)
