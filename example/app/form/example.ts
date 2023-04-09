import { Context, inject } from "zenweb";
import { FormBase, widgets } from "../../../src";

export class ExampleForm extends FormBase({
  username: {
    type: '!string',
    validate: {
      minLength: 2,
      maxLength: 12,
    },
    widget: widgets.text('用户名'),
  },
  desc: {
    type: '!string',
    default: 'descdefault',
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
    type: '!trim1',
    widget: widgets.date('日期'),
  },
  time: {
    type: '!trim1',
    widget: widgets.time('时间'),
  },
  datetime: {
    type: '!trim1',
    widget: widgets.datetime('日期时间'),
  },
  upload: {
    type: 'trim[]',
    widget: widgets.localUpload('本地上传'),
  },
  remote: {
    type: 'trim[]',
    widget: widgets.remoteUpload('远程上传').to('/upload').maxFiles(3),
  },
  gender: {
    type: '!string',
    widget: widgets.radio('性别').choices([
      '男',
      {value: 2, label: '女'},
    ]),
  },
  shengxiao: {
    type: '!int',
    widget: widgets.select('生肖').choices([
      {value: 1, label: '🐭'},
      {value: 2, label: '🐂'},
      {value: 3, label: '🐯'},
      {value: 4, label: '🐰', disabled: true},
    ]),
  },
  interest: {
    type: '!int[]',
    widget: widgets.multiple('感兴趣的').choices([
      {value: 1, label: '钓鱼'},
      {value: 2, label: '编程'},
      {value: 3, label: '厨艺'},
      {value: 4, label: '手工'},
    ]).max(3).min(1),
  },
  agreement: {
    type: '!bool',
    widget: widgets.onebox('同意并遵守注册协议'),
  },
  a: {
    type: 'string',
    default: '给你看看',
    widget: widgets.text('只读字段').readonly(),
  },
  daterange: {
    type: 'string[]',
    widget: widgets.dateRange('日期范围'),
  },
  cas: {
    type: 'int',
    widget: widgets.cascader("级连选择").choices([
      { label: "第一层", value: 1 },
      { label: "第二层1", value: 2, parent: 1 },
      { label: "第二层2", value: 3, parent: 1 },
      { label: "第三层1", value: 4, parent: 2, disabled: true },
      { label: "第一层2", value: 10 },
    ])
  },
  obj: {
    type: 'object',
    pick: {
      title: '!trim',
      comment: '!trim',
    },
  }
}) {
  @inject ctx!: Context;

  // 表单后置校验字段数据
  clean_username(data: string) {
    if (data.includes('admin')) {
      this.fail('like-admin');
    }
    return data; // 返回数据
  }

  // 整体清理
  clean() {
    console.log('clean!');
  }
}
