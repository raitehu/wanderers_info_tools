import { DateTime } from "luxon";
import * as cheerio from "cheerio";

export class HtmlParser {
  getUpdates(html) {
    console.log(JSON.stringify({
      level: "INFO",
      message: "[HTML Parser] 更新情報のリストを作成します",
      body: "",
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
    // DOMとして扱えるようにする
    const $ = cheerio.load(html);

    const updateList = []

    $('#extra .side-box.recent ul.parent-list')
      .children()
      .each((i, updates) => {
        const date = $(updates).find("h3").text();
        const pages = [];

        $(updates)
          .find("ul.child-list")
          .children()
          .each((i, page) => {
            const aTag = $(page).find("a");
            pages.push(aTag.html());
          });
      updateList.push({
        date: date,
        pages: pages
      });
    });

    console.log(JSON.stringify({
      level: "INFO",
      message: "[HTML Parser] 更新情報のリストを作成しました",
      body: updateList,
      timestamp: DateTime.local().setZone("Asia/Tokyo").toString()
    }));
    return updateList;
  }
}
