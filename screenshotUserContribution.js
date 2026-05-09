const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

function makeFolder(p) {
    try {
        fs.mkdirSync(path.dirname(p), { recursive: true });
    } catch (err) {
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

async function screenshotUserContribution(user) {

    const outputPath = `dist/${user}/${formatDate(new Date())}.png`
    makeFolder(outputPath)

    // Launch Chromium
    const browser = await puppeteer.launch({
        headless: true
    });

    // Open new tab
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 3 });

    // Navigate and wait until fully loaded
    await page.goto(`https://github.com/${user}`, {
        waitUntil: 'networkidle2'
    });

    const element = await page.waitForSelector('div.js-yearly-contributions>div');
    await element.screenshot({
        path: outputPath,
    });
    await browser.close();
}

module.exports = screenshotUserContribution