const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const url = "https://www.imdb.com/title/tt10919240/";
app.get("/", async (req, res) => {
  let browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  let page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.resourceType() === "image") request.abort();
    else request.continue();
  });
  let data = await page.evaluate(() => {
    let title = document.querySelector(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.TitleBlock__Container-sc-1nlhx7j-0.hglRHk > div.TitleBlock__TitleContainer-sc-1nlhx7j-1.jxsVNt > h1"
    ).innerText;
    return { title };
  });
  res.json(data);
});

// if (!process.env.DETA_RUNTIME) {
//   app.listen(3000);
// }

// // export 'app'
// module.exports = app;

app.listen(process.env.PORT || 3000);
