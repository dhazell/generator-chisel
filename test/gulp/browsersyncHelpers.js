exports.waitFor = page => {
  return new Promise((resolve) => {
    page.once('bsConnected', resolve);
  });
}

exports.monitor = page => {
  let previousMessage = '';
  function wait() {
    page
      .waitForSelector('#__bs_notify__')
      .then(() => {
        wait();
        page
          .waitForSelector('#__bs_notify__', { hidden: true })
          .then(() => previousMessage = '')
        return page.$('#__bs_notify__');
      })
      .then(el => el.getProperty('textContent'))
      .then(val => val.jsonValue())
      .then(str => {
        if(previousMessage === str) {
          return;
        }
        previousMessage = str;
        process.nextTick(() => page.emit('bsNotify', str));
        if(str == 'Connected to BrowserSync') {
          process.nextTick(() => page.emit('bsConnected'));
        }
      })
      .catch(() => {});
  }
  wait();

  page.on('framenavigated', () => {
    process.nextTick(() => page.emit('chiselNavigated'));
  });
}