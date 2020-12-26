const { Builder, By, Key, until } = require('selenium-webdriver');
require('selenium-webdriver/chrome');
//require('selenium-webdriver/firefox');
require('chromedriver');
//require('geckodriver');
const helpers = require('./selenium-helpers');
const www = require("../youtube-custom-feed/bin/www");
const vcfServer = require('../youtube-custom-feed/ycf-server');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

const rootURL = 'http://localhost:3000/';
let driver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

function openDB() {
  jest.clearAllMocks();
  const adapter = new FileSync('./tests/resources/db-zhykos.temp');
  const dbTests = lowdb(adapter);
  dbTests.defaults({ videos: [] }).write();
  dbTests.defaults({ channels: [] }).write();
  jest.spyOn(vcfServer.db, "get").mockImplementation(getWhat => dbTests.get(getWhat));
  jest.spyOn(vcfServer.db, "has").mockImplementation(getWhat => dbTests.has(getWhat));
  return dbTests;
}

function deleteDatabaseTempFile() {
  fs.unlink('./tests/resources/db-zhykos.temp', function (err) {
  });
}

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
  deleteDatabaseTempFile();
  fs.copyFileSync('./tests/resources/db-zhykos.json', './tests/resources/db-zhykos.temp');
})

afterAll(async () => {
  jest.clearAllMocks();
  deleteDatabaseTempFile();
  www.expressServer.close();
  driver.quit();
});

describe('Selenium tests', () => {

  test('Initializing the context', async () => {
    await driver.get(rootURL);
    openDB();
  });

  test('Display hidden videos', async () => {

    // Default display

    await helpers.assertNoId('video_TuAc5KxXGQ4', driver);
    await helpers.selectId('video_LOilCuZhB5o', driver);
    await helpers.assertNoId('button-hide-hidden', driver);

    // Show hidden

    const linkShowHidden = await helpers.selectId('button-show-hidden', driver);
    await linkShowHidden.click();

    await helpers.assertNoId('button-show-hidden', driver);
    await helpers.selectId('button-hide-hidden', driver);
    await helpers.selectId('video_TuAc5KxXGQ4', driver);
    await helpers.selectId('video_LOilCuZhB5o', driver);


    // Back to default display

    const linkHideHidden3 = await helpers.selectId('button-hide-hidden', driver);
    await linkHideHidden3.click();

    await helpers.assertNoId('button-hide-hidden', driver);
    await helpers.selectId('button-show-hidden', driver);
    await helpers.assertNoId('video_TuAc5KxXGQ4', driver);
    await helpers.selectId('video_LOilCuZhB5o', driver);
  });

  test('Change channel', async () => {

    // Default display

    await helpers.selectId('video_LOilCuZhB5o', driver);
    await helpers.selectId('video_4QXpyrp8WUo', driver);

    // Zhykos channel

    const linkZhykos = await helpers.selectId('button-channel-UCWJHqzXc7rKO7h5TzYYBNFw', driver);
    await linkZhykos.click();

    await helpers.selectId('video_LOilCuZhB5o', driver);
    await helpers.assertNoId('video_4QXpyrp8WUo', driver);

    // Skywilly channel

    const linkSkywilly = await helpers.selectId('button-channel-UCnygly7mB_KSETq9zPclZVA', driver);
    await linkSkywilly.click();

    await helpers.assertNoId('video_LOilCuZhB5o', driver);
    await helpers.selectId('video_4QXpyrp8WUo', driver);

    // Back to default display

    const linkAllChannels = await helpers.selectId('button-channel-#all', driver);
    await linkAllChannels.click();

    await helpers.selectId('video_LOilCuZhB5o', driver);
    await helpers.selectId('video_4QXpyrp8WUo', driver);
  });

  test('Open video iframe', async () => {

    // Default display

    await helpers.assertIsNotVisibleById("popup", driver);

    // Open video

    const linkOpen = await helpers.selectId('button-open-4QXpyrp8WUo', driver);
    await linkOpen.click();
    await helpers.assertIsVisibleById("popup", driver);

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

    const linkOpen = await helpers.selectId('swap_FK30dDJh7fQ', driver);
    await linkOpen.click();
    await helpers.assertIsNotVisibleById("video_FK30dDJh7fQ", driver);
  });

});