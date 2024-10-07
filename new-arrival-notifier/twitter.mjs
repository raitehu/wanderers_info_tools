import Twitter from "twitter-api-v2";

  // const env = process.env.ENV // TODO 本番のアカウントに投げないようにハードコーディングしておく
  const env = "stg"
  const endpoint = "http://localhost:2773";
  const path = "/systemsmanager/parameters/get/";
  const queryString = {
    api_key:             `name=%2F${env}%2Ftwitter%2Fapi_key&withDecryption=true`,
    api_key_secret:      `name=%2F${env}%2Ftwitter%2Fapi_key_secret&withDecryption=true`,
    access_token:        `name=%2F${env}%2Ftwitter%2Faccess_token&withDecryption=true`,
    access_token_secret: `name=%2F${env}%2Ftwitter%2Faccess_token_secret&withDecryption=true`
  }
  const headers = {
    "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN
  }


export class TwitterService {
  twitterSecrets = {
    api_key: "",
    api_key_secret: "",
    access_token: "",
    access_token_secret: ""
  }

  async config() {
    try {
      const response = await fetch(`${endpoint}${path}?${queryString.api_key}`, { headers: headers });
      const json = await response.json();
      this.twitterSecrets.api_key = json["Parameter"]["Value"];
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await fetch(`${endpoint}${path}?${queryString.api_key_secret}`, { headers: headers });
      const json = await response.json();
      this.twitterSecrets.api_key_secret = json["Parameter"]["Value"];
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await fetch(`${endpoint}${path}?${queryString.access_token}`, { headers: headers });
      const json = await response.json();
      this.twitterSecrets.access_token = json["Parameter"]["Value"];
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await fetch(`${endpoint}${path}?${queryString.access_token_secret}`, { headers: headers });
      const json = await response.json();
      this.twitterSecrets.access_token_secret = json["Parameter"]["Value"];
    } catch (err) {
      console.error(err);
    }
  }

  execute(messages) {
    const client = new Twitter(this.twitterSecrets);
    client.v2.tweetThread(messages).catch((err) => console.error(err));
  }
}
