import { Core } from '@zenweb/core';
import { setup } from '../src/index';
import { readFileSync } from 'node:fs';

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
  codes: JSON.parse(readFileSync('../message-codes.json', { encoding: 'utf-8' })),
});
app.setup(setup);

app.start();
