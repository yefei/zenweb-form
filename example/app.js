'use strict';

process.env.NODE_ENV = 'development';
process.env.DEBUG = '*';

const { Core } = require('@zenweb/core');
const { setup } =  require('..');

const app = module.exports = new Core();
app.setup('@zenweb/router');
app.setup('@zenweb/body');
app.setup('@zenweb/cors', { origin: '*' });
app.setup('@zenweb/api', {
  failCode: 500,
  failStatus: 200,
  success(data) {
    return { code: 200, data };
  },
});
app.setup('@zenweb/messagecode', {
  codes: require('../message-codes.json'),
});
app.setup(setup);

app.start();
