import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { createHash } from 'crypto';
import axios from "axios";

// パラメータストアから情報取得
const client = new SSMClient({region: "ap-northeast-1"});
const paramsURL = {
  Name: "garland_backend_url",
  WithDecryption: true
}
const paramsSalt = {
  Name: "wanderers_info_backend_token",
  WithDecryption: true
}
const commandGetURL = new GetParameterCommand(paramsURL);
const URL = (await client.send(commandGetURL)).Parameter.Value;

const commandGetSalt = new GetParameterCommand(paramsSalt);
const Salt = (await client.send(commandGetSalt)).Parameter.Value;

// タイムスタンプの取得

const unixTimestamp = Math.floor((new Date()).getTime() / 1000)

// トークンの生成
const tokenPlaintext = JSON.stringify({ "Timestamp": unixTimestamp, "Token": Salt });
const authorizationToken = createHash('sha256')
                            .update(tokenPlaintext)
                            .digest('hex');

// APIコール
// const res = await axios.post(URL, {
//   "function": "tidyUp"
// }).then((response) => {
//   console.log("status:", response.status);
//   console.log("response:", response.data);
//   return response.data;
// }).catch((err) => {
//   console.error(err);
// })

export async function handler(event) {
  return JSON.stringify(event);
}
