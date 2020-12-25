const { By, until } = require('selenium-webdriver');

const waitUntilTime = 20000;

async function selectCSS(selector, driver) {
  const el = await driver.wait(
    until.elementLocated(By.css(selector)),
    waitUntilTime
  );
  return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}
exports.selectCSS = selectCSS;

async function selectID(selector, driver) {
  const el = await driver.wait(
    until.elementLocated(By.id(selector)),
    waitUntilTime
  );
  return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}
exports.selectID = selectID;

async function assertNoId(selector, driver) {
  const elements = driver.findElements(By.id(selector));
  expect(elements).not.toMatchObject([]);
}
exports.assertNoId = assertNoId;