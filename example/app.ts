import { create } from 'zenweb';
import cros from '@zenweb/cors';
import upload from '@zenweb/upload';
import template from '@zenweb/template';
import nunjucks from '@zenweb/template-nunjucks';
import form, { formTemplate } from '../src/index';

create({
  result: {
    failCode: 500,
    failStatus: 200,
    json: {
      success(ctx, data) {
        return { code: 200, data };
      },
    },
  },
})
.setup(upload())
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
