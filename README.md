# clubhouse.cal

## Set Up

* Run `yarn`.
* Create an `.env` file based on `.env.sample`
* Download a `credentials.json` [from Google](https://developers.google.com/sheets/api/quickstart/nodejs) and move it to this folder. Use https://127.0.0.1/ as the redirect URL.

## Run

`yarn start`

On the first run, when Google Authentication is complete, it will redirect you to `https://127.0.0.1/?code=...&scope=...`. Copy the code from the URL and type it into the console and press Enter.
