const { Builder, By, Key, until } = require('selenium-webdriver');
require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
require('chromedriver');
require('geckodriver');
const helpers = require('./tests-helpers');
const www = require("../youtube-custom-feed/bin/server/javascripts/main-express");
const vcfServer = require('../youtube-custom-feed/bin/server/javascripts/vcf-server');
const config = require('../youtube-custom-feed/bin/config.js');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

const rootURL = 'http://localhost:3000/';
let driver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

function openDB() {
  fs.copyFileSync('./tests/resources/db-zhykos.json', './tests/resources/db-zhykos.temp');
  const adapter = new FileSync('./tests/resources/db-zhykos.temp');
  const dbTests = lowdb(adapter);
  dbTests.defaults({ videos: [] }).write();
  dbTests.defaults({ channels: [] }).write();
  jest.spyOn(vcfServer.db, "get").mockImplementation(getWhat => dbTests.get(getWhat));
  jest.spyOn(vcfServer.db, "has").mockImplementation(getWhat => dbTests.has(getWhat));
}

function deleteDatabaseTempFile() {
  helpers.deleteFile('./tests/resources/db-zhykos.temp');
}

describe('beforeAll', () => {

  test("beforeAll", async () => {
    jest.clearAllMocks();
    driver = await new Builder().forBrowser(config.BROWSER_TEST).build();
    await driver.manage().window().maximize();
    deleteDatabaseTempFile();
    openDB();
  });

});

describe('Selenium tests', () => {

  test("beforeAll", async () => {
    await driver.get(rootURL);
    await helpers.takeScreenshotForDocumentation("client-guide-00", driver);
  });

  test('Display hidden videos', async () => {

    // Default display

    await helpers.assertNoId('video_TuAc5KxXGQ4', driver);
    await helpers.selectId('video_f5s2yomPNL0', driver);
    await helpers.assertNoId('button-hide-hidden', driver);
    await helpers.assertCountElementsByClass("video", 38, driver);

    // Show hidden

    const linkShowHidden = await helpers.selectId('button-show-hidden', driver);
    await linkShowHidden.click();

    await helpers.assertNoId('button-show-hidden', driver);
    await helpers.selectId('button-hide-hidden', driver);
    await helpers.selectId('video_TuAc5KxXGQ4', driver);
    await helpers.selectId('video_f5s2yomPNL0', driver);
    await helpers.assertCountElementsByClass("video", 100, driver);

    await helpers.takeScreenshotForDocumentation("client-guide-08", driver);

    // Back to default display

    const linkHideHidden3 = await helpers.selectId('button-hide-hidden', driver);
    await linkHideHidden3.click();

    await helpers.assertNoId('button-hide-hidden', driver);
    await helpers.selectId('button-show-hidden', driver);
    await helpers.assertNoId('video_TuAc5KxXGQ4', driver);
    await helpers.selectId('video_f5s2yomPNL0', driver);
    await helpers.assertCountElementsByClass("video", 38, driver);
  });

  test('Change channel', async () => {

    // Default display

    await helpers.selectId('video_f5s2yomPNL0', driver);
    await helpers.selectId('video_4QXpyrp8WUo', driver);

    // Zhykos channel

    const linkZhykos = await helpers.selectId('button-channel-UCWJHqzXc7rKO7h5TzYYBNFw', driver);
    await linkZhykos.click();

    await helpers.selectId('video_f5s2yomPNL0', driver);
    await helpers.assertNoId('video_4QXpyrp8WUo', driver);

    await helpers.takeScreenshotForDocumentation("client-guide-11", driver);

    // Skywilly channel

    const linkSkywilly = await helpers.selectId('button-channel-UCnygly7mB_KSETq9zPclZVA', driver);
    await linkSkywilly.click();

    await helpers.assertNoId('video_f5s2yomPNL0', driver);
    await helpers.selectId('video_4QXpyrp8WUo', driver);

    // Back to default display

    const linkAllChannels = await helpers.selectId('button-channel-#all', driver);
    await linkAllChannels.click();

    await helpers.selectId('video_f5s2yomPNL0', driver);
    await helpers.selectId('video_4QXpyrp8WUo', driver);
  });

  test('Open video iframe', async () => {

    // Default display

    await helpers.assertIsNotVisibleById("popup", driver);

    // Open video

    const linkOpen = await helpers.selectId('button-open-4QXpyrp8WUo', driver);
    await linkOpen.click();
    await helpers.assertIsVisibleById("popup", driver);

    await helpers.waitMilli(2000);
    await helpers.takeScreenshotForDocumentation("client-guide-13", driver);

    // Close video

    const linkClose2 = await helpers.selectId('close', driver);
    await linkClose2.click();
    await helpers.waitMilli(2000);
    await helpers.assertIsNotVisibleById("popup", driver);
    await helpers.selectId('video_4QXpyrp8WUo', driver);
  });

  test('Open video then mask', async () => {

    // Default display

    await helpers.assertIsNotVisibleById("popup", driver);
    await helpers.selectId('video_4QXpyrp8WUo', driver);
    await helpers.assertIsVisibleById("video_4QXpyrp8WUo", driver);

    // Open video

    const linkOpen = await helpers.selectId('button-open-hide-4QXpyrp8WUo', driver);
    await linkOpen.click();
    await helpers.assertIsVisibleById("popup", driver);

    // Close video

    const linkClose2 = await helpers.selectId('close', driver);
    await linkClose2.click();
    await helpers.waitMilli(2000);
    await helpers.assertIsNotVisibleById("video_4QXpyrp8WUo", driver);
  });

  test('Mask video', async () => {

    // Default display

    await helpers.selectId('video_FK30dDJh7fQ', driver);
    await helpers.assertIsVisibleById("video_FK30dDJh7fQ", driver);

    // Hide video

    const linkHide = await helpers.selectId('swap_FK30dDJh7fQ', driver);
    await linkHide.click();
    await helpers.assertIsNotVisibleById("video_FK30dDJh7fQ", driver);
  });

  test('Show masked video', async () => {

    // Default display

    await helpers.assertIsNotVisibleById("video_FK30dDJh7fQ", driver);
    await helpers.waitMilli(2000);

    // Show all videos

    const linkShowHidden = await helpers.selectId('button-show-hidden', driver);
    await linkShowHidden.click();
    await helpers.waitMilli(2000);
    await helpers.assertIsVisibleById("video_FK30dDJh7fQ", driver);

    // Unmask video

    const linkShow = await helpers.selectId('swap_FK30dDJh7fQ', driver);
    await linkShow.click();
    await helpers.waitMilli(2000);
    await helpers.assertIsVisibleById("video_FK30dDJh7fQ", driver);

    // Undo show all videos

    const linkHideHidden = await helpers.selectId('button-hide-hidden', driver);
    await linkHideHidden.click();
    await helpers.waitMilli(2000);
    await helpers.assertIsVisibleById("video_FK30dDJh7fQ", driver);
  });

  test('Open in origin website', async () => {

    // Default display

    await helpers.assertIsVisibleById("video_FK30dDJh7fQ", driver);

    // Open

    const linkOpenOrigin = await helpers.selectId('button-open-youtube-FK30dDJh7fQ', driver);
    await linkOpenOrigin.click();
    await helpers.waitMilli(2000);

    await driver.getAllWindowHandles().then(function (handles) {
      driver.switchTo().window(handles[1]);
      helpers.assertNoId("video_FK30dDJh7fQ", driver);
      driver.getCurrentUrl().then(function (url) {
        expect(url).toBe("https://www.youtube.com/watch?v=FK30dDJh7fQ");
      });
      driver.close();
      driver.switchTo().window(handles[0]);
    });

    // Back in main page

    await helpers.assertIsVisibleById("video_FK30dDJh7fQ", driver);
  });

  test('No error', async () => {
    await helpers.assertIsNotVisibleById("settings-error", driver);
  });

  test('Check CSS', async () => {
    const linkShowHidden = await helpers.selectId('button-show-hidden', driver);
    await linkShowHidden.click();
    await helpers.waitMilli(2000);

    await helpers.assertIsVisibleById("whitelist_Oqp-Y_LUUDo", driver);
    await helpers.assertNoId("blacklist_Oqp-Y_LUUDo", driver);

    await helpers.assertIsVisibleById("blacklist_TuAc5KxXGQ4", driver);
    await helpers.assertNoId("whitelist_TuAc5KxXGQ4", driver);

    await helpers.assertNoId("whitelist_4QXpyrp8WUo", driver);
    await helpers.assertNoId("blacklist_4QXpyrp8WUo", driver);

    await helpers.assertClassById("img_Oqp-Y_LUUDo", "hiddenImage", driver);
    await helpers.assertClassById("title_Oqp-Y_LUUDo", "hiddenText", driver);

    await helpers.assertNoClassById("img_nArW0DjUMB8", driver);
    await helpers.assertNoClassById("title_nArW0DjUMB8", driver);

    await helpers.assertAttributeById("swap_LOilCuZhB5o", "src", rootURL + "images/visible.png", driver);
    await helpers.assertAttributeById("swap_ATsjtKOX-qY", "src", rootURL + "images/hide.png", driver);
  });

});

describe('Other screenshots', () => {

  test('Take screenshots', async () => {
    // TODOs
    // client-guide-01
    // client-guide-02
    // client-guide-04
    // client-guide-05

    // TODOs (cut/modify)
    // client-guide-09
    // client-guide-10
    // client-guide-12
    // client-guide-14
    // client-guide-15
    // client-guide-16
  });

  test('client-guide-06', async () => {
    await helpers.cropImage('client-guide-00', 'client-guide-06', 0, 0, 1920, 720);
  });

  test('client-guide-07', async () => {
    await helpers.cropImage('client-guide-00', 'client-guide-07-temp', 0, 0, 805, 449);
    await helpers.drawRedNotFilledRectangle('client-guide-07-temp', 'client-guide-07', 7, 47, 157, 94);
  });
});

describe('Selenium error tests', () => {

  test("beforeAll", async () => {
    vcfServer.vcf_keys.youtube.clientApiKey = "<XXX>";
    await driver.get(rootURL);
  });

  test('No parameter file', async () => {
    await helpers.assertIsVisibleById("settings-error", driver);
  });

});

describe('afterAll', () => {

  test("afterAll", async () => {
    jest.clearAllMocks();
    deleteDatabaseTempFile();
    www.expressServer.close();
    driver.quit();
  });

});