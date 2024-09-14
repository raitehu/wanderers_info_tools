import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { createHash } from 'crypto';
import axios from "axios";

// 受取可能なfunction一覧
const FUNCTIONS = [
  "/v1/garland/update-notify/",
  "/v1/garland/soon-expiry/",
  "/v1/garland/daily/"
]

// パラメータストアから情報取得
const client = new SSMClient({region: "ap-northeast-1"});
const paramsSalt = {
  Name: "wanderers_info_backend_token",
  WithDecryption: true
}
const commandGetSalt = new GetParameterCommand(paramsSalt);
const Salt = (await client.send(commandGetSalt)).Parameter.Value;

// タイムスタンプの取得

const unixTimestamp = Math.floor((new Date()).getTime() / 1000)

// トークンの生成
const tokenPlaintext = JSON.stringify({ "Timestamp": unixTimestamp, "Token": Salt });
const authorizationToken = createHash('sha256')
                            .update(tokenPlaintext)
                            .digest('hex');

// ハンドラ

export async function handler(event) {
  const Domain = process.env.WANDERERS_INFO_BACKEND_URL;
  const path = JSON.parse(JSON.stringify(event))["function"];
  if (!FUNCTIONS.includes(path)) {
    return `ERROR! invalid functions: ${path}`;
  }

  const URL = `${Domain}${path}`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authorizationToken
  }
  const body = { "Timestamp": unixTimestamp }

  console.log(JSON.stringify({
    "request": {
      "URL": URL,
      "headers": headers,
      "method": "post",
      "body": body
    }
  }));

  const res = await axios.post(
                      URL,
                      body,
                      { headers: headers}
                    ).then((response) => {
                      console.log("status: ", response.status);
                      console.log("response: ", response.data);
                      return response.data;
                    }).catch((err) => {
                      console.error(err);
                    });
  return res;
}
