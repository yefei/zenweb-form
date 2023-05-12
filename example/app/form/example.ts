import { Context, inject } from "zenweb";
import { FormBase, fields } from "../../../src";

export class ExampleForm extends FormBase {
  setup() {
    return {
      username: fields.text('!string').minLength(2).maxLength(12).label('用户名'),
      desc: fields.textarea('string').default('descdefault').minLength(3).maxLength(1000)
      .label('自我描述').rows(3, 10).help('自我描述不要超过1000字，最少3个字'),
      age: fields.text('int').validate({
        gte: 18,
        lte: 50,
      }).label('年龄').help('年龄18-50'),
      date: fields.date('date').label('日期'),
      time: fields.time('string').label('时间'),
      datetime: fields.datetime('date').label('日期时间'),
      upload: fields.localUpload('trim[]').label('本地上传'),
      remote: fields.remoteUpload('trim[]').label('远程上传').to('/upload').maxFiles(3),
      gender: fields.radio('trim1').label('性别').choices([
        '男',
        {value: 2, label: '女'},
      ]),
      shengxiao: fields.select('int').label('生肖').choices([
        {value: 1, label: '🐭'},
        {value: 2, label: '🐂'},
        {value: 3, label: '🐯'},
        {value: 4, label: '🐰', disabled: true},
      ]),
      interest: fields.multiple('int[]').label('感兴趣的').choices([
        {value: 1, label: '钓鱼'},
        {value: 2, label: '编程'},
        {value: 3, label: '厨艺'},
        {value: 4, label: '手工'},
      ]).max(3).min(1),
      agreement: fields.onebox('bool').label('同意并遵守注册协议'),
      readonly: fields.text('string').label('只读字段').readonly().placeholder('看看'),
      daterange: fields.dateRange('date[]').label('日期范围').start(new Date('2023-1-1')).end(new Date()),
      daterange2: fields.dateRange('string[]').label('日期范围2').of('day').start(new Date('2022-1-1')).end(new Date()),
      cas: fields.cascader('int[]').label("级连选择").choices([
        { label: "第一层", value: 1 },
        { label: "第二层1", value: 2, parent: 1 },
        { label: "第二层2", value: 3, parent: 1 },
        { label: "第三层1", value: 4, parent: 2, disabled: true },
        { label: "第一层2", value: 10 },
      ]),
      /*
      obj: {
        type: 'object',
        pick: {
          title: '!trim',
          comment: '!trim',
        },
      },
      */
    }
  }

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
