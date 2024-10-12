import { create } from 'zenweb';
import cros from '@zenweb/cors';
import upload from '@zenweb/upload';
import template from '@zenweb/template';
import nunjucks from '@zenweb/template-nunjucks';
import form, { formTemplate } from '../src/index.js';

create({
  result: {
    failCode: 500,
    failStatus: 200,
    successWrap(ctx, data) {
      return { code: 200, data };
    },
  },
})
.setup(upload({
  multiples: true,
}))
.setup(cros({ origin: '*' }))
.setup(form())
.setup(template({
  templateAffix: '.njk',
  engine: nunjucks({
    path: [
      './template',
      formTemplate,
    ],
    nunjucksConfig: {
      noCache: true,
    }
  }),
}))
.start();
