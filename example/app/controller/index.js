'use strict';

const app = require('../../app');
const { widget } = require('../../..');

app.formRouter('/form', {
  init(ctx, init) {
    init.fields = {
      name: widget.trim('姓名').validate({ minLength: 2, maxLength: 4 }),
      desc: widget.trim('自我描述').validate({ maxLength: 1000 }).help('自我描述不要超过1000字'),
      age: widget.int('年龄').help('年龄18-50').validate({ gte: 18, lte: 50 }),
      shengxiao: widget.select('生肖').type('int').choices([
        {value: 1, label: '🐭'},
        {value: 2, label: '🐂'},
        {value: 3, label: '🐯'},
        {value: 4, label: '🐰'},
      ]),
      interest: widget.multiple('感兴趣的').choices([
        {value: 1, label: '钓鱼'},
        {value: 2, label: '编程'},
        {value: 3, label: '厨艺'},
        {value: 4, label: '手工'},
      ]).max(3).min(1)
    };
  },
  post(ctx, form) {
    ctx.body = { success: true, data: form.data };
  },
});
