'use strict';

const app = require('../../app');
const { fields } = require('../../..');

app.formRouter('/form', {
  init(ctx, init) {
    init.fields = {
      name: fields.trim('姓名').validate({ minLength: 2, maxLength: 4 }),
      desc: fields.trim('自我描述').validate({ maxLength: 1000 }).help('自我描述不要超过1000字'),
      age: fields.int('年龄').help('年龄18-50').validate({ gte: 18, lte: 50 }),
      date: fields.date('预约时间'),
      gender: fields.radio('性别').choices([
        {value: 1, label: '男'},
        {value: 2, label: '女'},
      ]),
      shengxiao: fields.select('生肖').type('int').choices([
        {value: 1, label: '🐭'},
        {value: 2, label: '🐂'},
        {value: 3, label: '🐯'},
        {value: 4, label: '🐰'},
      ]),
      interest: fields.multiple('感兴趣的').choices([
        {value: 1, label: '钓鱼'},
        {value: 2, label: '编程'},
        {value: 3, label: '厨艺'},
        {value: 4, label: '手工'},
      ]).max(3).min(1),
      agreement: fields.checkbox('注册协议').choices([
        {value: 1, label: '同意并遵守'},
      ]).min(1).max(1),
    };
  },
  post(ctx, form) {
    ctx.success(form.data);
  },
});
