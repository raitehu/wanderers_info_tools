import { DateTime } from "luxon";

const postTime = DateTime.local().toMillis();
const garlandURL = process.env.GARLAND_URL

export function noItemsMessage() {
  return [
    '🎪GARLANDからのお知らせ🎪',
    'VALISネップリ一覧化サービスGARLANDへの',
    `ネップリの新規登録はこちらから↓`,
    garlandURL,
    "",
    `posted at ${postTime}`
  ].join('\n');
}

export function someItemsMessage(count) {
  return [
    '🎪GARLANDからのお知らせ🎪',
    'VALISネップリ一覧化サービスGARLANDには、',
    `現在${count}件のネップリが登録されています!!`,
    "",
    'ネップリの一覧および新規登録はこちらから↓',
    garlandURL,
    "",
    `posted at ${postTime}`
  ].join('\n');
}
