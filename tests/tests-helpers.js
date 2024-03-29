const { By, until } = require('selenium-webdriver');
const fs = require('fs');
const Jimp = require('jimp');
const gm = require('gm');
const config = require('../src/bin/config.js');

const waitUntilTime = 20000;

async function selectId(selector, driver) {
    const el = await driver.wait(
        until.elementLocated(By.id(selector)),
        waitUntilTime
    );
    return driver.wait(until.elementIsVisible(el), waitUntilTime);
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
        try {
            expect(elements.length).toBe(1);
            elements[0].isDisplayed().then(function (isDisplayed) {
                expect(isDisplayed).toBe(isVisible);
            });
        } catch(e) {
            console.error("Id = '" + selector + "' must be visible = " + isVisible);
            throw e;
        }
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
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
    expect(fs.existsSync(file)).toBeFalsy();
}
exports.deleteFile = deleteFile;

async function assertClassById(idSelector, expectedValue, driver) {
    await assertAttributeById(idSelector, 'class', expectedValue, driver);
}
exports.assertClassById = assertClassById;

async function assertNoClassById(idSelector, driver) {
    await assertClassById(idSelector, '', driver);
}
exports.assertNoClassById = assertNoClassById;

async function assertAttributeById(
    idSelector,
    attributeName,
    expectedValue,
    driver
) {
    await driver.findElements(By.id(idSelector)).then(function (elements) {
        expect(elements.length).toBe(1);
        elements[0].getAttribute(attributeName).then(function (element) {
            expect(element, 'Id = ' + idSelector).toBe(expectedValue);
        });
    });
}
exports.assertAttributeById = assertAttributeById;

async function assertCountElementsByClass(
    classSelector,
    expectedValue,
    driver
) {
    await driver
        .findElements(By.className(classSelector))
        .then(function (elements) {
            expect(elements.length).toBe(expectedValue);
        });
}
exports.assertCountElementsByClass = assertCountElementsByClass;

function takeScreenshotForDocumentation(filename, driver) {
    if (config.BROWSER_TEST == 'chrome' && config.SCREENSHOTS_TESTS == 'true') {
        driver.takeScreenshot().then(function (png64) {
            let base64Data = png64.replace('data:image/png;base64,', '');
            fs.writeFileSync('./doc/images/' + filename + '.jpg', base64Data, {
                encoding: 'base64',
            });
        });
    }
}
exports.takeScreenshotForDocumentation = takeScreenshotForDocumentation;

function cropImage(inFilename, outFilename, x1, y1, x2, y2) {
    return new Promise((resolve) => {
        Jimp.read('./doc/images/' + inFilename + '.jpg')
            .then((image) => {
                image
                    .crop(x1, y1, x2 - x1, y2 - y1)
                    .writeAsync('./doc/images/' + outFilename + '.jpg')
                    .then(function (res) {
                        resolve(res);
                    });
            })
            .catch((err) => {
                console.error('cropImage: ' + err);
            });
    });
}
exports.cropImage = cropImage;

function drawRedNotFilledRectangle(inFilename, outFilename, x1, y1, x2, y2) {
    gm('./doc/images/' + inFilename + '.jpg')
        .stroke('#FF0000', 0)
        .strokeWidth(5)
        .drawLine(x1, y1, x2, y1)
        .drawLine(x2, y1, x2, y2)
        .drawLine(x2, y2, x1, y2)
        .drawLine(x1, y2, x1, y1)
        .write('./doc/images/' + outFilename + '.jpg', function (err) {
            expect(err).toBeUndefined();
        });
}
exports.drawRedNotFilledRectangle = drawRedNotFilledRectangle;

function drawBlackRectangle(inFilename, outFilename, x1, y1, x2, y2) {
    gm('./doc/images/' + inFilename + '.jpg')
        .stroke('#000000', 0)
        .drawRectangle(x1, y1, x2, y2)
        .write('./doc/images/' + outFilename + '.jpg', function (err) {
            expect(err).toBeUndefined();
        });
}
exports.drawBlackRectangle = drawBlackRectangle;
