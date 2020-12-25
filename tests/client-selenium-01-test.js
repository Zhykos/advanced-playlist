const { Builder, By, Key, until } = require('selenium-webdriver');
require('selenium-webdriver/chrome');
//require('selenium-webdriver/firefox');
require('chromedriver');
//require('geckodriver');
const helpers = require('./selenium-helpers');
require("../youtube-custom-feed/bin/www");
const server = require('../youtube-custom-feed/ycf-server');
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
  jest.spyOn(server.db, "get").mockImplementation(getWhat => dbTests.get(getWhat));
  jest.spyOn(server.db, "has").mockImplementation(getWhat => dbTests.has(getWhat));
  return dbTests;
}

function deleteDatabaseTempFile() {
  fs.unlink('./tests/resources/db-zhykos.temp', function (err) {
  });
}

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
})

afterAll(async () => {
  //server.close(); FIXME
  //driver.quit();
});

beforeAll(() => {
  deleteDatabaseTempFile();
  fs.copyFileSync('./tests/resources/db-zhykos.json', './tests/resources/db-zhykos.temp');
});

afterAll(() => {
  jest.clearAllMocks();
  deleteDatabaseTempFile();
});

it('Initializing the context', async () => {
  await driver.get(rootURL);
  openDB();
})

it('Display hidden videos', async () => {

  // Default display

  await helpers.assertNoId('video_TuAc5KxXGQ4', driver);
  await helpers.selectID('video_LOilCuZhB5o', driver);
  await helpers.assertNoId('button-hide-hidden', driver);

  // Show hidden

  const linkShowHidden = await helpers.selectID('button-show-hidden', driver);
  await linkShowHidden.click();

  await helpers.assertNoId('button-show-hidden', driver);
  await helpers.selectID('button-hide-hidden', driver);
  await helpers.selectID('video_TuAc5KxXGQ4', driver);
  await helpers.selectID('video_LOilCuZhB5o', driver);


  // Back to default display

  const linkHideHidden3 = await helpers.selectID('button-hide-hidden', driver);
  await linkHideHidden3.click();

  await helpers.assertNoId('button-hide-hidden', driver);
  await helpers.selectID('button-show-hidden', driver);
  await helpers.assertNoId('video_TuAc5KxXGQ4', driver);
  await helpers.selectID('video_LOilCuZhB5o', driver);
})