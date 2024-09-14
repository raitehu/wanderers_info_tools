import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import axios from "axios";

// パラメータストアから情報取得
const client = new SSMClient({region: "ap-northeast-1"});
const paramsURL = {
  Name: "garland_backend_url",
  WithDecryption: true
}
const commandGetURL = new GetParameterCommand(paramsURL);
const URL = (await client.send(commandGetURL)).Parameter.Value;

// APIコール
const res = await axios.post(URL, {
  "function": "tidyUp"
}).then((response) => {
  console.log("status:", response.status);
  console.log("response:", response.data);
  return response.data;
}).catch((err) => {
  console.error(err);
})

export async function handler() {
  return res;
}
