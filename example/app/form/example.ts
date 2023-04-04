import { makeForm, widgets } from "../../../src";


export const ExampleForm = makeForm({
  name: {
    type: '!string',
    validate: {
      minLength: 2,
      maxLength: 4,
    },
    widget: widgets.text('姓名'),
  },
  desc: {
    type: '!string',
    validate: {
      minLength: 3,
      maxLength: 1000,
    },
    widget: widgets.textarea('自我描述').rows(3, 10).help('自我描述不要超过1000字，最少3个字'),
  },
  age: {
    type: '!int',
    validate: {
      gte: 18,
      lte: 50,
    },
    widget: widgets.text('年龄').help('年龄18-50'),
  },
  date: {
    type: '!date',
    widget: widgets.date('日期').readonly(),
  },
  /*
  time: widgets.time('时间'),
  datetime: widgets.datetime('日期时间'),
  upload: widgets.upload('本地上传').local().required(false),
  remote: widgets.upload('远程上传').remote('http://' + this.ctx.host + '/upload').maxFiles(3).required(false),
  gender: widgets.radio('性别').choices([
    '男',
    {value: 2, label: '女'},
  ]),
  shengxiao: widgets.select('生肖').valueType('int').choices([
    {value: 1, label: '🐭'},
    {value: 2, label: '🐂'},
    {value: 3, label: '🐯'},
    {value: 4, label: '🐰', disabled: true},
  ]),
  interest: widgets.multiple('感兴趣的').choices([
    {value: 1, label: '钓鱼'},
    {value: 2, label: '编程'},
    {value: 3, label: '厨艺'},
    {value: 4, label: '手工'},
  ]).max(3).min(1),
  agreement: widgets.checkbox('注册协议').choices([
    {value: 1, label: '同意并遵守'},
  ]).min(1).max(1),
  a: widgets.trim('可选填').default('a').required(false),
  */
}, {
  // 表单后置校验字段数据
  name(data) {
    // 自定义校验规则
    if (data.startsWith('王')) {
      this.fail('禁止老王注册'); // 如果不满足条件则使用 this.fail 或者直接抛出异常都可以
    }
    return data; // 最后必须要返回处理好的数据
  }
});
