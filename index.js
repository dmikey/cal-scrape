const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const file = require('fs');

(async function() {
  async function launchChrome() {
    return await chromeLauncher.launch({
      chromeFlags: [
        '--disable-gpu',
        '--headless'
      ]
    });
  }
  const chrome = await launchChrome();
  const protocol = await CDP({
    port: chrome.port
  });

  const {
    DOM,
    Page,
    Emulation,
    Runtime
  } = protocol;
  await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);

  Page.navigate({
    url: 'https://calendar.google.com/calendar/embed?src=nuls8lvfc8p7c292l9gj5jpj9o%40group.calendar.google.com&ctz=America/Los_Angeles'
  });

  Page.loadEventFired(async() => {
    var waitTill = new Date(new Date().getTime() + 3000);
    while(waitTill > new Date()){}

    const ss = await Page.captureScreenshot({format: 'png', fromSurface: true});
    file.writeFile('screenshot.png', ss.data, 'base64', function(err) {
      if (err) {
        console.log(err);
      }
    });

    protocol.close();
    chrome.kill();
  });

})();