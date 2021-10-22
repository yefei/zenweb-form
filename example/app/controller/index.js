'use strict';

const app = require('../../app');

/** @type {import('../../..').Fields} */
const fields = {
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

app.formRouter('/form', {
  fields,
  post(ctx, form) {
    ctx.body = { success: true, data: form.data };
  },
});

app.formRouter('/form/:name/:age', {
  fields,
  initial(ctx) {
    return ctx.params;
  },
  post(ctx, form) {
    ctx.body = { success: true, data: form.data };
  },
});
