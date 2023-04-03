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
  formPost(form: UserForm, data: ObjectBody) {
    await form.assert(data);
    return form.data;
  }
}
```
