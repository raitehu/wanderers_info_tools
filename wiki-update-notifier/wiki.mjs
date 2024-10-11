import { DateTime } from "luxon";
import axios from "axios";
import { Iconv } from "iconv";

const wikiRootURL = process.env.WIKI_ROOT_URL
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"
};
const requestOptions = {
  baseURL: wikiRootURL,
  method: 'get',
  responseType: 'arraybuffer',
  responseEncoding: 'binary',
  headers: headers
};

export class Wiki {
  async get() {
    const client = axios.create(requestOptions);
    console.log(JSON.stringify({
      level: "INFO",
      message: "[Wiki] 情報を取得します",
      body: requestOptions,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
    const data = await client.get('/', {
      validateStatus: (status) => {
        return status < 400;
      }
    }).then((res) => {
      console.log(JSON.stringify({
        level: "INFO",
        message: "[Wiki] 情報を取得しました",
        body: { status_code: res.status },
        timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
      }));
      return res.data;
    }).catch((err) => {
      throw err;
    });

    const str = new Iconv('euc-jp', 'UTF-8//TRANSLIT//IGNORE')
    .convert(data)
    .toString();

    return str;
  }
}