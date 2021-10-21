'use strict';

const app = require('../../app');

app.formRouter('/form', {
  fields: {
    name: {
      label: '姓名',
    },
    age: {
      type: 'int',
      validate: {
        gt: 18,
      }
    }
  },

  // get(ctx, form) {
  //   ctx.body = form.fields;
  // },

  // fail(ctx, form) {
  // },

  post(ctx, form) {
    ctx.body = 'success';
  },
});
