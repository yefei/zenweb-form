import { Router } from '@zenweb/router';
import { formRouter, fields } from '../../../src/index';
export const router = new Router();

router.post('/upload', ctx => {
  ctx.success({
    url: 'test'
  });
});

formRouter(router, '/form', {
  init(ctx, init) {
    init.fields = {
      name: fields.trim('姓名').validate({ minLength: 2, maxLength: 4 }),
      desc: fields.textarea('自我描述').length(3, 1000).rows(3, 10).help('自我描述不要超过1000字，最少3个字'),
      age: fields.int('年龄').help('年龄18-50').validate({ gte: 18, lte: 50 }),
      date: fields.date('日期'),
      time: fields.time('时间'),
      datetime: fields.datetime('日期时间'),
      upload: fields.upload('上传').action('http://' + ctx.host + '/upload'),
      gender: fields.radio('性别').choices([
        '男',
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
      a: fields.trim('可选填').default('a').required(false),
    };
  },
  post(ctx, form) {
    ctx.success(form.data);
  },
});
