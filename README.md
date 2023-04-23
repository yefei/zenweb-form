# form - 表单构建与数据验证

[ZenWeb](https://www.npmjs.com/package/zenweb)

服务端表单构建与数据验证系统

功能特色:
- 服务器端控制
- 数据验证
- 前后分离设计
- 多种前端渲染支持
- 快速构建产品

## 安装

### 服务端

```bash
yarn add @zenweb/form
```

### 配置

```ts
import { create } from 'zenweb';
import modForm from '@zenweb/form';

create()
.setup(modForm())
.start();
```

```js
import { inject, Context, mapping, Body } from 'zenweb';
import { FormBase, fields } from '@zenweb/form';

export class ExampleForm extends FormBase {
  setup() {
    return {
      username: fields.text('!string').validate({ minLength: 2, maxLength: 12 }).label('用户名'),
      desc: fields.textarea('string').default('descdefault').validate({
        minLength: 3,
        maxLength: 1000,
      }).label('自我描述').rows(3, 10).help('自我描述不要超过1000字，最少3个字'),
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
      cas: fields.cascader('int[]').label("级连选择").choices([
        { label: "第一层", value: 1 },
        { label: "第二层1", value: 2, parent: 1 },
        { label: "第二层2", value: 3, parent: 1 },
        { label: "第三层1", value: 4, parent: 2, disabled: true },
        { label: "第一层2", value: 10 },
      ]),
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

export class UserController {
  @mapping({ path: '/form' })
  formGet(form: UserForm) {
    return form;
  }

  @mapping({ path: '/form', method: 'POST' })
  formPost(form: UserForm, input: ObjectBody) {
    await form.assert(input);
    return form.data;
  }
}
```

## 使用内置的 template 渲染

内置 html template 渲染目前支持 `nunjucks` 模板引擎

### 配置

```ts
import { create } from 'zenweb';
import modForm, { formTemplate } from '@zenweb/form';
import template from '@zenweb/template';
import nunjucks from '@zenweb/template-nunjucks';

create()
.setup(modForm())
.setup(template({
  engine: nunjucks({
    path: [
      './template',
      formTemplate, // 添加 form template 目录
    ],
  }),
}))
.start();
```

### 使用

`template/form.html.njk`

```nunjucks
{% from "zenweb/form/macro.html.njk" import formFields, formStyle, formScript %}

{{formStyle()}}

<div style="max-width:500px;margin: 10px auto;">
  {% if ok %}
  <div style="background-color:#138515;color:#fff;padding:5px;text-align:center;margin-bottom:20px;">提交完成！</div>
  {% endif %}

  <form method="POST" action="">
    {{ formFields(form, input) }}
    <button type="submit">提交</button>
  </form>
</div>

{{formScript()}}
```

```ts
export class DemoController {
  @mapping({ method: ['GET', 'POST'] })
  async html(ctx: Context, form: UserForm, input: ObjectBody) {
    ctx.template('form.html.njk');
    form.data = { username: 'default value' };
    let ok = false;
    if (ctx.method === 'POST') {
      ok = await form.validate(input);
      if (ok) {
        // some code
      }
    }
    return { form, input, ok };
  }
}
```

## 使用 vue 渲染

Vue 渲染目前支持 vue2 element 组件渲染

Vue 项目详细使用方式请查看 [@zenweb/form-vue-element](https://npmjs.org/package/@zenweb/form-vue-element)
