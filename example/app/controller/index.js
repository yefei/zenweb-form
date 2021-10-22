'use strict';

const app = require('../../app');

const fields = {
  name: {
    label: '姓名',
  },
  age: {
    type: 'int',
    validate: {
      gt: 18,
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
