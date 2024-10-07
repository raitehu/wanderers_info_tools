import { TwitterApi } from "twitter-api-v2";

  // const env = process.env.ENV // TODO 本番のアカウントに投げないようにハードコーディングしておく
  const env = "stg"
  const endpoint = "http://localhost:2773";
  const path = "/systemsmanager/parameters/get/";
  const queryString = {
    appKey:       `name=%2F${env}%2Ftwitter%2Fapi_key&withDecryption=true`,
    appSecret:    `name=%2F${env}%2Ftwitter%2Fapi_key_secret&withDecryption=true`,
    accessToken:  `name=%2F${env}%2Ftwitter%2Faccess_token&withDecryption=true`,
    accessSecret: `name=%2F${env}%2Ftwitter%2Faccess_token_secret&withDecryption=true`
  }
  const headers = {
    "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN
  }


export class TwitterService {
  twitterSecrets = {
    appKey: "",
    appSecret: "",
    accessToken: "",
    accessSecret: ""
  }

  async config() {
    try {
      const response = await fetch(`${endpoint}${path}?${queryString.appKey}`, { headers: headers });
      const json = await response.json();
      this.twitterSecrets.appKey = json["Parameter"]["Value"];
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await fetch(`${endpoint}${path}?${queryString.appSecret}`, { headers: headers });
      const json = await response.json();
      this.twitterSecrets.appSecret = json["Parameter"]["Value"];
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await fetch(`${endpoint}${path}?${queryString.accessToken}`, { headers: headers });
      const json = await response.json();
      this.twitterSecrets.accessToken = json["Parameter"]["Value"];
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await fetch(`${endpoint}${path}?${queryString.accessSecret}`, { headers: headers });
      const json = await response.json();
      this.twitterSecrets.accessSecret = json["Parameter"]["Value"];
    } catch (err) {
      console.error(err);
    }
  }

  async execute(messages) {
    const client = new TwitterApi(this.twitterSecrets);
    await client.v2.tweetThread(messages).catch((err) => console.error(err));
  }
}
