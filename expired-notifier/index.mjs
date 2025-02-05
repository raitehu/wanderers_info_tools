import { DateTime } from "luxon";
import { DynamoDBService } from "./dynamodb.mjs";
import { expiredMessage } from "./message.mjs";
import { TwitterService } from "./twitter.mjs";

export async function handler() {
  // DynamoDBのconfig
  const dynamoDB = new DynamoDBService();
  await dynamoDB.config().catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[DynamoDB] Configでエラーが発生しました",
      body: err,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
  });
  // DynamoDBのScan
  const res = await dynamoDB.scan().catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[DynamoDB] Scanでエラーが発生しました",
      body: err,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
  });

  // 対象のツイートの絞り込み
  const targetItems = filter(res.Items);
  console.log(JSON.stringify({
    level: "INFO",
    message: "[APP] 対象ツイートを絞り込みました",
    body: targetItems,
    timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
  }));
  // ツイート文の配列に変換
  const messages = targetItems.map((item) => {
    return expiredMessage(item.TweetURL);
  });

  if (targetItems.length === 0) { return; }

  // Twitterのconfig
  const twitter = new TwitterService();
  await twitter.config().catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[Twitter] Configでエラーが発生しました",
      body: err,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
  });
  // ツイート！
  await Promise.all(messages.map(async (message) => {
    await twitter.execute([message]).catch((err) => {
      console.error(JSON.stringify({
        level: "ERROR",
        message: "[Twitter] Executeでエラーが発生しました",
        body: err,
        timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
      }));
  })}));
}

function filter(items) {
  // 12時間後
  const referenceTime = DateTime.local()
                                .setZone("Asia/Tokyo")
                                .set({ minute: 0, second: 0, millisecond: 0 })
                                .plus({ hours: 12})
                                .toMillis()/1000;
  console.log(JSON.stringify({
    level: "INFO",
    message: "[APP] 基準となるUnixTimeを決定しました",
    body: referenceTime,
    timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
  }));

  return items.filter((item) => item.UnixTime === referenceTime);
}
