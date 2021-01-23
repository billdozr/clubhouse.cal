import * as Twitter from "twitter"
import {google} from "googleapis"
import * as dotenv from "dotenv"

dotenv.config()
const TW_CONSUMER_KEY = process.env.TW_CONSUMER_KEY || "XXXXXXXXXXXXXXXXX"
const TW_CONSUMER_SEC = process.env.TW_CONSUMER_SEC || "XXXXXXXXXXXXXXXXX"
const TW_ACCESS_TOKEN_KEY =
  process.env.TW_ACCESS_TOKEN_KEY || "XXXXXXXXXXXXXXXXX"
const TW_ACCESS_TOKEN_SEC =
  process.env.TW_ACCESS_TOKEN_SEC || "XXXXXXXXXXXXXXXXX"

const client = new Twitter({
  consumer_key: TW_CONSUMER_KEY,
  consumer_secret: TW_CONSUMER_SEC,
  access_token_key: TW_ACCESS_TOKEN_KEY,
  access_token_secret: TW_ACCESS_TOKEN_SEC
})

const sheets = google.sheets('v4')
// TODO: setup auth

client.stream(
  "statuses/filter",
  {
    track: "joinclubhouse"
    //locations: '18.3074488,-34.3583284,19.0046700,-33.4712700'
  },
  function(stream) {
    stream.on("data", function(tweet) {
      for (const url of tweet.entities.urls) {
        const expanded_url: String = url.expanded_url
        const match = expanded_url.match(/^https:\/\/joinclubhouse.com\/event\/(.*)$/)
        if (match === null) {
          continue
        }
        console.log(expanded_url)
      }
    })
    stream.on("error", function(error) {
      console.log(error)
    })
  }
)
