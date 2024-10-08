import { DateTime } from "luxon";

const postTime = DateTime.local().toMillis();
const garlandURL = process.env.GARLAND_URL

export function expiredMessage(tweetURL) {
  return [
    '🎪GARLANDからのお知らせ🎪',
    'あと12時間でプリント期限が切れてしまうネップリがあります!!',
    tweetURL,
    "",
    'その他のネップリの一覧および新規登録はこちらから↓',
    garlandURL,
    "",
    `posted at ${postTime}`
  ].join('\n');
}
