import { promises as fs } from "fs";
import * as readline from "readline";

import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials.
 */
export async function authorizeGoogle() {
  const credentials = JSON.parse(
    (await fs.readFile("credentials.json")).toString()
  );

  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  const { tokens } = await (async () => {
    try {
      return JSON.parse((await fs.readFile(TOKEN_PATH)).toString());
    } catch (err) {
      return getNewGoogleToken(oAuth2Client);
    }
  })();
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
export async function getNewGoogleToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const code = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      resolve(code);
    });
  });
  const token = await oAuth2Client.getToken(code);

  // Store the token to disk for later program executions
  await fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log("Token stored to", TOKEN_PATH);

  return token;
}
