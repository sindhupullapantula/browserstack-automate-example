var assert = require('assert');
const { Builder, By, Capabilities, until, Browser } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');

var buildChromeDriver = function() {
  const chromeCapabilities = Capabilities.chrome();
  const chromeOptions = {'args': ['--test-type', '--incognito']};
  chromeCapabilities.set('chromeOptions', chromeOptions);
  const chromeService = new chrome.ServiceBuilder("/Users/sindhupullapantula/Downloads/selenium-grid/chromedriver_mac_arm64/chromedriver");
  return new Builder()
    .forBrowser(Browser.CHROME).
    withCapabilities(chromeCapabilities).
    setChromeService(chromeService).
    build();
};

var buildEdgeDriver = function() {
  const chromeCapabilities = Capabilities.chrome();
  const chromeOptions = {'args': ['--test-type', '--incognito']};
  const edgeCapabilities = Capabilities.edge();
  edgeCapabilities.set('chromeOptions', chromeOptions);
  const edgeService = new edge.ServiceBuilder("/Users/sindhupullapantula/Downloads/selenium-grid/msedgedriver");

  
  return new Builder().
    forBrowser(Browser.EDGE).
    withCapabilities(edgeCapabilities).
    setEdgeService(edgeService).
    build();
};

const driverBuilders = [buildChromeDriver, buildEdgeDriver];

driverBuilders.map((buildDriver) => {
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
});

