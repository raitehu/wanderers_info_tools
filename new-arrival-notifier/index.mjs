import { TwitterService } from "./twitter.mjs";
import { DateTime } from "luxon";

export async function handler(event) {
  let tweetData = [];
  event.Records.forEach((record) => {
    if (record.eventName !== "INSERT") {
      return;
    }
    tweetData.push({
      ExpireDate: record.dynamodb.NewImage.ExpireDate.S,
      TweetURL:   record.dynamodb.NewImage.TweetURL.S
    })
  })

  const twitter = new TwitterService();
  if (tweetData.length != 0) {
    console.log("Parameter StoreからTwitter接続情報を取得します...");
    await twitter.config();
    console.log("Tweetをします...", tweetData[0]);
    await twitter.execute([buildMessage(tweetData[0])]);
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
