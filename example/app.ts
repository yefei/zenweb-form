import { create } from 'zenweb';
import cros from '@zenweb/cors';
import upload from '@zenweb/upload';
import form from '../src/index';

const app = create({
  result: {
    failCode: 500,
    failStatus: 200,
    success(ctx, data: any) {
      return { code: 200, data };
    },
  },
});
app.setup(upload())
app.setup(cros({ origin: '*' }));
app.setup(form());
app.start();
