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
import { FormBase, widgets } from '@zenweb/form';

class UserForm extends FormBase({
  username: {
    type: '!string',
    validate: {
      minLength: 2,
      maxLength: 12,
    },
    widget: widgets.text('用户名'),
  },
  age: {
    type: '!int',
    validate: {
      gte: 18,
      lte: 50,
    },
    widget: widgets.text('年龄').help('年龄18-50'),
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
}) {
  // 类支持注入
  @inject ctx!: Context;

  // 支持字段数据清理
  clean_username(data: string) {
    if (data.includes('admin')) {
      this.fail('like-admin');
    }
    return data; // 返回数据
  }

  // 支持总体数据清理
  clean() {
    console.log(this.data);
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
    return { form: form.result, input, ok };
  }
}
```

## 使用 vue 渲染

Vue 渲染目前支持 vue2 element 组件渲染

Vue 项目详细使用方式请查看 [@zenweb/form-vue-element](https://npmjs.org/package/@zenweb/form-vue-element)
