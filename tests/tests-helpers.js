const { By, until } = require('selenium-webdriver');
const fs = require('fs');
const pngToJpeg = require('png-to-jpeg');
const config = require('../youtube-custom-feed/bin/config.js');
const Jimp = require('jimp');
const gm = require('gm');

const waitUntilTime = 20000;

async function selectId(selector, driver) {
  const el = await driver.wait(
    until.elementLocated(By.id(selector)),
    waitUntilTime
  );
  return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}
exports.selectId = selectId;

async function assertNoId(selector, driver) {
  await driver.findElements(By.id(selector)).then(function (elements) {
    expect(elements.length).toBe(0);
  });
}
exports.assertNoId = assertNoId;

async function assertVisibilityById(selector, driver, isVisible) {
  await driver.findElements(By.id(selector)).then(function (elements) {
    expect(elements.length, "Id = " + selector).toBe(1);
    elements[0].isDisplayed().then(function (element) {
      expect(element, "Id = '" + selector + "' must be visible = " + isVisible).toBe(isVisible);
    });
  });
}

async function assertIsVisibleById(selector, driver) {
  await assertVisibilityById(selector, driver, true);
}
exports.assertIsVisibleById = assertIsVisibleById;

async function assertIsNotVisibleById(selector, driver) {
  await assertVisibilityById(selector, driver, false);
}
exports.assertIsNotVisibleById = assertIsNotVisibleById;

function waitMilli(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
exports.waitMilli = waitMilli;

function deleteFile(file) {
  fs.unlink(file, function (err) {
    // XXX
  });
}
exports.deleteFile = deleteFile;

async function assertClassById(idSelector, expectedValue, driver) {
  await assertAttributeById(idSelector, "class", expectedValue, driver);
}
exports.assertClassById = assertClassById;

async function assertNoClassById(idSelector, driver) {
  await assertClassById(idSelector, "", driver);
}
exports.assertNoClassById = assertNoClassById;

async function assertAttributeById(idSelector, attributeName, expectedValue, driver) {
  await driver.findElements(By.id(idSelector)).then(function (elements) {
    expect(elements.length).toBe(1);
    elements[0].getAttribute(attributeName).then(function (element) {
      expect(element, "Id = " + idSelector).toBe(expectedValue);
    });
  });
}
exports.assertAttributeById = assertAttributeById;

async function assertCountElementsByClass(classSelector, expectedValue, driver) {
  await driver.findElements(By.className(classSelector)).then(function (elements) {
    expect(elements.length).toBe(expectedValue);
  });
}
exports.assertCountElementsByClass = assertCountElementsByClass;

async function takeScreenshotForDocumentation(filename, driver) {
  if (config.BROWSER_TEST == "chrome") {
    await driver.takeScreenshot().then(function (png64) {
      const buffer = Buffer.from(png64, 'base64');
      pngToJpeg({ quality: 90 })(buffer).then(output => fs.writeFileSync("./doc/images/" + filename + ".jpg", output));
    });
  }
}
exports.takeScreenshotForDocumentation = takeScreenshotForDocumentation;

async function cropImage(inFilename, outFilename, x, y, w, h) {
  if (config.BROWSER_TEST == "chrome") {
    await Jimp.read("./doc/images/" + inFilename + ".jpg")
      .then(image => {
        return image.crop(x, y, w, h).write("./doc/images/" + outFilename + ".jpg");
      })
      .catch(err => {
        console.error(err); // XXX
      });
  }
}
exports.cropImage = cropImage;

async function drawRectangle(inFilename, outFilename, x1, y1, x2, y2) {
  await gm("./doc/images/" + inFilename + ".jpg").drawRectangle(x1, y1, x2, y2).write("./doc/images/" + outFilename + ".jpg", function (err) {
    if (err) {
      console.log(err); // XXX
    }
  });
}
exports.drawRectangle = drawRectangle;