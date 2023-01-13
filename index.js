const axios = require("axios").default;
const puppeteer = require("puppeteer");

let doWeHaveStock;
let currentText;

setInterval(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://limelightvision.io/");

  await page.waitForSelector("xpath/html/body/div[1]/div/header/div[1]/p");
  const annoucement = await page.$(
    "xpath/html/body/div[1]/div/header/div[1]/p"
  );
  const value = await page.evaluate((el) => el.textContent, annoucement);
  if (currentText !== value && currentText !== undefined) {
    axios.post(
      "https://canary.discord.com/api/webhooks/1061747212205428857/BQTt08NafP2CP21QGXPgsAYu8JupVMq5H81oIekHl9-6B0BWRDur6_YgpIqU_KvmrtRm",
      {
        content: `Limelight 3 annoucement has been changed!\nhttps://limelightvision.io`,
      }
    );
  }
  currentText = value;
  await browser.close();
}, 60000);

setInterval(async () => {
  if (doWeHaveStock) return;
  try {
    const response = await axios.get(
      "https://limelightvision.io/products/limelight-3"
    );

    if (response.status < 400) {
      if (!doWeHaveStock) {
        doWeHaveStock = true;
        await sendAlert();
      }
    }
  } catch (e) {
    // 404 is an error for some reason
  }
}, 60000);

async function sendAlert() {
  // send to discord webhook in #programming-updates
  const webhookBody = {
    content: `Limelight 3 stock has been detected!`,
    embeds: [
      {
        type: "rich",
        title: `Limelight 3 Stock`,
        description: `Stock for the limelight 3 has been found! It's time to waste our budget! Click the title to buy!`,
        color: 0x00ffff,
        url: `https://limelightvision.io/products/limelight-3`,
      },
    ],
  };
  await axios.post(
    "https://canary.discord.com/api/webhooks/1061747212205428857/BQTt08NafP2CP21QGXPgsAYu8JupVMq5H81oIekHl9-6B0BWRDur6_YgpIqU_KvmrtRm",
    webhookBody
  );
}
