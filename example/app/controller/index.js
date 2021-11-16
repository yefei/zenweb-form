'use strict';

const app = require('../../app');
const { widget } = require('../../..');

app.formRouter('/form', {
  init(ctx, init) {
    init.fields = {
      name: {
        label: '姓名',
        validate: {
          minLength: 2,
          maxLength: 4,
        }
      },
      age: {
        type: 'int',
        help: '年龄18-50',
        validate: {
          gte: 18,
          lte: 50,
        }
      },
      shengxiao: widget.select({
        label: '生肖',
        type: 'int',
      }).choices({label: '兔', value: 1}),
    };
  },
  post(ctx, form) {
    ctx.body = { success: true, data: form.data };
  },
});
