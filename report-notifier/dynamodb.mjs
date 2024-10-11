import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DateTime } from "luxon";

const env      = process.env.ENV
const endpoint = "http://localhost:2773";
const path     = "/systemsmanager/parameters/get/";
const queryString = {
  accessKeyId:     `name=%2F${env}%2Fdynamodb_access_key_id&withDecryption=true`,
  secretAccessKey: `name=%2F${env}%2Fdynamodb_secrets_access_key&withDecryption=true`,
}
const headers = {
  "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN
}
const region           = process.env.REGION
const dynamoDBEndpoint = process.env.DYNAMODB_ENDPOINT
const tableName        = process.env.TABLE_NAME;

export class DynamoDBService {
  dynamoDBConfig = {
    region: region,
    credentials: {
      accessKeyId: "",
      secretAccessKey: ""
    },
    endpoint: dynamoDBEndpoint
  };
  client;
  docClient;

  async config() {
    console.log(JSON.stringify({
      level: "INFO",
      message: "[DynamoDB] Configします",
      body: "",
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));

    // accessKeyId
    const accessKeyIdResponse = await fetch(`${endpoint}${path}?${queryString.accessKeyId}`, { headers: headers })
      .catch((err) => { throw err; });
    const accessKeyIdJson = await accessKeyIdResponse.json()
      .catch((err) => { throw err; });
    this.dynamoDBConfig.credentials.accessKeyId = accessKeyIdJson["Parameter"]["Value"];

    // secretAccessKey
    const secretAccessKeyResponse = await fetch(`${endpoint}${path}?${queryString.secretAccessKey}`, { headers: headers })
      .catch((err) => { throw err; });
    const secretAccessKeyJson = await secretAccessKeyResponse.json()
      .catch((err) => { throw err; });
    this.dynamoDBConfig.credentials.secretAccessKey = secretAccessKeyJson["Parameter"]["Value"];

    this.client    = new DynamoDBClient(this.dynamoDBConfig);
    this.docClient = DynamoDBDocumentClient.from(this.client)
  }

  async scan() {
    const command = { TableName: tableName };
    console.log(JSON.stringify({
      level: "INFO",
      message: "[DynamoDB] データを取得します",
      body: command,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));

    const response = await this.docClient
      .send(new ScanCommand(command))
      .then((res) => {
        console.log(JSON.stringify({
          level: "INFO",
          message: "[DynamoDB] データを取得しました",
          body: res,
          timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
        }));
        return res;
      })
      .catch((err) => { throw err });
    return response;
  }
}
