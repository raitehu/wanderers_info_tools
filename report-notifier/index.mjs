import { DynamoDBService } from "./dynamodb.mjs";
import { noItemsMessage, someItemsMessage } from "./message.mjs";
import { TwitterService } from "./twitter.mjs";

export async function handler() {
  // DynamoDBのconfig
  const dynamoDB = new DynamoDBService();
  await dynamoDB.config().catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[DynamoDB] Configでエラーが発生しました",
      body: err
    }));
  });
  // DynamoDBのScan
  const res = await dynamoDB.scan().catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[DynamoDB] Scanでエラーが発生しました",
      body: err
    }));
  });

  const count = res.Count;

  // 件数によってメッセージを確定する
  const message = count === 0 ? noItemsMessage() : someItemsMessage(count);

  // Twitterのconfig
  const twitter = new TwitterService();
  await twitter.config().catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[Twitter] Configでエラーが発生しました",
      body: err
    }));
  });
  // ツイート！
  await twitter.execute(message).catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[Twitter] Executeでエラーが発生しました",
      body: err
    }));
  });
}
