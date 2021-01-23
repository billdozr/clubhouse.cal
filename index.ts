import {promises as fs} from "fs";
import * as dotenv from "dotenv";

import * as Twitter from "twitter";
import { google } from "googleapis";
import { authorizeGoogle } from "./google_auth";

dotenv.config();
const TW_CONSUMER_KEY = process.env.TW_CONSUMER_KEY || "XXXXXXXXXXXXXXXXX";
const TW_CONSUMER_SEC = process.env.TW_CONSUMER_SEC || "XXXXXXXXXXXXXXXXX";
const TW_ACCESS_TOKEN_KEY =
  process.env.TW_ACCESS_TOKEN_KEY || "XXXXXXXXXXXXXXXXX";
const TW_ACCESS_TOKEN_SEC =
  process.env.TW_ACCESS_TOKEN_SEC || "XXXXXXXXXXXXXXXXX";

const client = new Twitter({
  consumer_key: TW_CONSUMER_KEY,
  consumer_secret: TW_CONSUMER_SEC,
  access_token_key: TW_ACCESS_TOKEN_KEY,
  access_token_secret: TW_ACCESS_TOKEN_SEC,
});

async function main() {
  const sheets = google.sheets("v4");
  const googleAuth = await authorizeGoogle();

  client.stream(
    "statuses/filter",
    {
      track: "joinclubhouse",
      //locations: '18.3074488,-34.3583284,19.0046700,-33.4712700'
    },
    function (stream) {
      stream.on("data", async function (tweet) {
        for (const url of tweet.entities.urls) {
          const expanded_url: String = url.expanded_url;
          const match = expanded_url.match(
            /^https:\/\/joinclubhouse.com\/event\/(.*)$/
          );
          if (match === null) {
            continue;
          }
          console.log(expanded_url);

          await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            range: "A1",
            auth: googleAuth,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
              values: [
                [expanded_url]
              ],
            }
          })
        }
      });
      stream.on("error", function (error) {
        console.log(error);
      });
    }
  );
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
