import { TwitterService } from "./twitter.mjs";
import { DateTime } from "luxon";

export async function handler(event) {
  let tweetData = [];
  event.Records.forEach((record) => {
    if (record.eventName !== "INSERT") {
      console.log(JSON.stringify({
        level: "INFO",
        message: "[DynamoDB Stream] 処理対象外です",
        body: record.eventName,
        timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
      }));
      return;
    }
    const tweetDatum = {
      ExpireDate: record.dynamodb.NewImage.ExpireDate.S,
      TweetURL:   record.dynamodb.NewImage.TweetURL.S
    }
    console.log(JSON.stringify({
      level: "INFO",
      message: "[DynamoDB Stream] 処理対象です",
      body: tweetDatum,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
    tweetData.push(tweetDatum);
  })

  // Twitterのconfig
  const twitter = new TwitterService();
  if (tweetData.length != 0) {
    await twitter.config().catch((err) => {
      console.error(JSON.stringify({
        level: "ERROR",
        message: "[Twitter] Configでエラーが発生しました",
        body: err,
        timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
      }));
    });
    // ツイート！
    await twitter.execute([buildMessage(tweetData[0])]).catch((err) => {
      console.error(JSON.stringify({
        level: "ERROR",
        message: "[Twitter] Executeでエラーが発生しました",
        body: err,
        timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
      }));
    });
  }
}

function buildMessage(tweetDatum) {
  const expireDateString = DateTime.fromISO(tweetDatum.ExpireDate, { zone: "Asia/Tokyo"})
                                   .toFormat('yyyy/M/d H時頃まで');
  const postTime = `posted at ${DateTime.local().toMillis()}`;
  return [
    '🎪GARLANDからのお知らせ🎪',
    'ネップリが新規登録されました!!',
    `プリント期限: ${expireDateString}`,
    tweetDatum.TweetURL,
    '',
    'その他のネップリの一覧および新規登録はこちらから↓',
    process.env.GARLAND_URL,
    '',
    postTime,
  ].join('\n');
}
