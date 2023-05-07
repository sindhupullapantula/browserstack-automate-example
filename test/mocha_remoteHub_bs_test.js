var assert = require('assert');
const { Builder, By, Capabilities, until } = require("selenium-webdriver");

const userName = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

var buildDriver = function() {
  const chromeCapabilities = Capabilities.chrome();
  const chromeOptions = {'args': ['--test-type', '--incognito']};
  chromeCapabilities.set('chromeOptions', chromeOptions);
  return new Builder().
    usingServer( `http://${userName}:${accessKey}@hub-cloud.browserstack.com/wd/hub`).
    withCapabilities(chromeCapabilities).
    build();
};

describe('Open BrowserStack Live page in incognito mode', async function() {
  this.timeout(0);
  var driver;

  before(function() {
    driver = buildDriver();
  });

  it('Should redirect to signin page', async function () {
    await driver.get('https://live.browserstack.com/dashboard');
    await driver.wait(new Promise((res) => {
      setTimeout(res, 2000);
    }));
    const pageTitle = await driver.getTitle();
    assert.equal(pageTitle, "BrowserStack Login | Sign Into The Best Mobile & Browser Testing Tool");
  });

  it('Should show "Invalid Email" error message for invalid email id', async function () {
    await driver.get('https://live.browserstack.com/dashboard');
    // locating username textbox
    await driver.wait(until.elementLocated(By.css('#user_email_login')));
    let userName = await driver.findElement(By.css('#user_email_login')).sendKeys("psindhu1");
    // locating password textbox
    await driver.wait(until.elementLocated(By.css('#user_password')));
    let password = await driver.findElement(By.css('#user_password')).sendKeys("bstackdemo@123"); 
    // // Click the signin button   
    // await driver.wait(until.elementLocated(By.css('#user_submit')));
    // driver.findElement(By.css("#user_submit")).click();


    await driver.wait(new Promise((res) => {
      setTimeout(res, 3000);
    }));

    const errorMessageText =  await driver.findElement(By.css('#user_email_login + .error-msg')).getText();
    assert.equal(errorMessageText.trim(), "Invalid Email");
  });

    
  after(async function() {
    await driver.quit();
  });
});
