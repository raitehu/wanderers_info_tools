import { TwitterApi } from "twitter-api-v2";
import { DateTime } from "luxon";

  // const env = process.env.ENV // TODO 本番のアカウントに投げないようにハードコーディングしておく
  const env      = "stg"
  const endpoint = "http://localhost:2773";
  const path     = "/systemsmanager/parameters/get/";
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
    console.log(JSON.stringify({
      level: "INFO",
      message: "[Twitter] Configします",
      body: "",
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));

    // appKey
    const appKeyResponse = await fetch(`${endpoint}${path}?${queryString.appKey}`, { headers: headers })
      .catch((err) => { throw new Error(err); });
    const appKeyJson = await appKeyResponse.json()
      .catch((err) => { throw new Error(err); });
    this.twitterSecrets.appKey = appKeyJson["Parameter"]["Value"];

    // appSecret
    const appSecretResponse = await fetch(`${endpoint}${path}?${queryString.appSecret}`, { headers: headers })
      .catch((err) => { throw new Error(err); });
    const appSecretJson = await appSecretResponse.json()
      .catch((err) => { throw new Error(err); });
    this.twitterSecrets.appSecret = appSecretJson["Parameter"]["Value"];

    // accessToken
    const accessTokenResponse = await fetch(`${endpoint}${path}?${queryString.accessToken}`, { headers: headers })
      .catch((err) => { throw new Error(err); });
    const accessTokenJson = await accessTokenResponse.json()
      .catch((err) => { throw new Error(err); });
    this.twitterSecrets.accessToken = accessTokenJson["Parameter"]["Value"];

    // accessSecret
    const accessSecretResponse = await fetch(`${endpoint}${path}?${queryString.accessSecret}`, { headers: headers })
      .catch((err) => { throw new Error(err); });
    const accessSecretJson = await accessSecretResponse.json()
      .catch((err) => { throw new Error(err); });
    this.twitterSecrets.accessSecret = accessSecretJson["Parameter"]["Value"];
  }

  async execute(messages) {
    console.log(JSON.stringify({
      level: "INFO",
      message: "[Twitter] Executeします",
      body: messages,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));

    const client = new TwitterApi(this.twitterSecrets);
    await client.v2.tweetThread(messages).catch((err) => { throw new Error(err); });
  }
}
