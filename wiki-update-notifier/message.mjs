import { DateTime } from "luxon";

// 1ツイートあたりの上限(少し余裕を持たせている)
const maxCharNUm = 130;

/**
 * 更新ページのリストを元にツイートツリーを構築する
 * @param {string} yesterday
 * @param {string[]} update
 * @returns {string[]} tweetTree
 */
export function buildTweetTree (yesterday, update) {
  console.log(JSON.stringify({
    level: "INFO",
    message: "[Message] ツイートの生成を開始します",
    body: "",
    timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
  }));
  // 重複ツイート判定されないため
  const postTime = `posted at ${DateTime.local().toMillis()}`;
  const messageList = [preamble(yesterday), "", ...update, "", postamble()];
  let message = [];
  const tweets = [];

  for (let i = 0; i < messageList.length; i++) {

    if ((message.join("\n") + messageList[i] + postTime).length < maxCharNUm) {
      // 既存のメッセージ + リストのアイテム + 投稿日時が1ツイートに収まる場合
      // 文を追加する
      message.push(messageList[i]);
    } else {
      // 収まらない場合
      // postTimeを追加したうえで1tweetsとして登録する
      message.push(postTime);
      tweets.push(message.join("\n"));

      console.log(JSON.stringify({
        level: "INFO",
        message: "[Message] 1ツイート作成しました",
        body: message.join("\n"),
        timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
      }));

      message = [];
    }
  }
  // 未pushのツイートがあったら登録しておく
  if (message != []) {
    message.push(postTime);
    tweets.push(message.join("\n"));

    console.log(JSON.stringify({
      level: "INFO",
      message: "[Message] 1ツイート作成しました",
      body: message.join("\n"),
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));

  }

  console.log(JSON.stringify({
    level: "INFO",
    message: "[Message] ツイートの生成が完了しました",
    body: "",
    timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
  }));

  return tweets;
}

function preamble(date) {
  return [
    '🎪VALIS非公式wiki更新情報🎪',
    `${date}に以下のページが更新されました`,
  ].join('\n');
}

function postamble() {
  const wikiRootURL = process.env.WIKI_ROOT_URL

  return [
    '是非遊びに来てください!!',
    wikiRootURL
  ].join('\n');
}