import { create } from 'zenweb';
import cros from '@zenweb/cors';
import form from '../src/index';

const app = create({
  api: {
    failCode: 500,
    failStatus: 200,
    success(ctx, data: any) {
      return { code: 200, data };
    },
  }
});
app.setup(cros({ origin: '*' }));
app.setup(form());
app.start();
