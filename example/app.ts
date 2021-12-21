import { Core } from '@zenweb/core';
import { setup } from '../src/index';

const app = new Core();
app.setup('@zenweb/router');
app.setup('@zenweb/body');
app.setup('@zenweb/cors', { origin: '*' });
app.setup('@zenweb/api', {
  failCode: 500,
  failStatus: 200,
  success(data: any) {
    return { code: 200, data };
  },
});
app.setup('@zenweb/messagecode', {
  // 测试需要本地读取，正式项目中无需处理
  codes: require('../message-codes.json'),
});
app.setup(setup);

app.start();
