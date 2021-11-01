'use strict';

const app = require('../../app');

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
      }
    };
  },
  post(ctx, form) {
    ctx.body = { success: true, data: form.data };
  },
});
