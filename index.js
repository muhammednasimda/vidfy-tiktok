const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const url = "https://www.tiktok.com/@paulsudres/video/6964064641014074630";
app.get("/", async (req, res) => {
  let browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false,
  });
  let page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  await page.goto(url, { waitUntil: "domcontentloaded" });

  let data = await page.evaluate(() => {
    let snippet = document.querySelector(
      "#main > div.jsx-2773227880.main-body.page-with-header.middle.em-follow > div.jsx-523345860.video-detail.video-detail-v4.middle > div > div > main > div > div.jsx-3148321798.video-card-big.browse-mode > div.jsx-3148321798.video-card-container > div.jsx-1283372866.video-card-browse"
    );
    let cover = snippet.split('background-image: url("')[1].split('");">')[0];
    let video = snippet.split('src="')[1].split('" preload="metadata"')[0];
    return { video, cover };
  });
  res.json(data);
});

// if (!process.env.DETA_RUNTIME) {
//   app.listen(3000);
// }

// // export 'app'
// module.exports = app;

app.listen(process.env.PORT || 3000);
