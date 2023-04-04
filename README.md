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
import { Form, fields } from '@zenweb/form';

class UserForm extends Form {
  fields() {
    return {
      name: fields.trim('姓名').validate({ minLength: 2, maxLength: 10 }),
      age: fields.int('年龄').help('年龄18-50').validate({ gte: 17, lte: 100 }),
      gender: fields.radio('性别').choices([
        '男',
        {value: 2, label: '女'},
      ]),
    }
  }
}

export class UserController {
  @mapping({ path: '/form' })
  formGet(form: UserForm) {
    return form.result;
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
{% from "zenweb/form/macro.html.njk" import formFields, formStyle %}

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
```

```ts
export class DemoController {
  @mapping({ method: ['GET', 'POST'] })
  async html(ctx: Context, form: UserForm, input: ObjectBody) {
    ctx.template('form.html.njk');
    form.data = { name: 'default value' };
    let ok = false;
    if (ctx.method === 'POST') {
      ok = await form.validate(input);
      if (ok) {
        // some code
      }
    }
    return { form: form.result, input, ok };
  }
}
```

## 使用 vue 渲染

Vue 渲染目前支持 vue2 element 组件渲染

Vue 项目详细使用方式请查看 [@zenweb/form-vue-element](https://npmjs.org/package/@zenweb/form-vue-element)
