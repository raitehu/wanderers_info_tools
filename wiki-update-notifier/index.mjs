import { DateTime } from "luxon";
import { Wiki } from "./wiki.mjs";
import { HtmlParser } from "./html-parser.mjs";
import { buildTweetTree } from "./message.mjs";

export async function handler() {
  // wikiから情報を取得する
  const wiki = new Wiki();
  const html = await wiki.get().catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[Wiki] 情報取得中にエラーが発生しました",
      body: err,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
    return;
  });

  // 更新ページ一覧を生成する
  const htmlParser = new HtmlParser();
  let updateList = []
  try {
    updateList = htmlParser.getUpdates(html)
  } catch (err) {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[HTML Parser] HTMLの解析中にエラーが発生しました",
      body: err,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
    return;
  }

  // 対象のページ一覧を絞り込む
  const yesterdaysUpdate = filterYesterday(updateList)

  if (yesterdaysUpdate.length == 0) {
    console.log(JSON.stringify({
      level: "INFO",
      message: "[MAIN] 更新がなかったため終了します",
      body: "",
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
    return;
  }

  // ツイート文を生成する
  let tweetTree = [];
  try {
    tweetTree = buildTweetTree(yesterdayDateStr(), yesterdaysUpdate)
  } catch (err) {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[MAIN] ツイート文の構築中にエラーが発生しました",
      body: err,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
    return;
  }

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
  await twitter.execute(tweetTree).catch((err) => {
    console.error(JSON.stringify({
      level: "ERROR",
      message: "[Twitter] Executeでエラーが発生しました",
      body: err,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
  });
}

function yesterdayDateStr() {
  // const yesterday = DateTime.local()
  //   .setZone("Asia/Tokyo")
  //   .minus({ days: 1 })
  //   .toFormat("yyyy-MM-dd");
  const yesterday = "2024-08-02";

  return yesterday;
}

function filterYesterday(updateList) {
  const yesterdaysUpdate = updateList.filter((update) => update.date === yesterdayDateStr());

  if (yesterdaysUpdate.length != 0) {
    return yesterdaysUpdate[0].pages
  } else {
    return [];
  }
}

handler();