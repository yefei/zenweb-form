# ZenWeb Form module

[ZenWeb](https://www.npmjs.com/package/zenweb)

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
  @inject ctx: Context
  @inject form: UserForm;

  @mapping({ path: '/form' })
  formGet() {
    return this.form.result;
  }

  @mapping({ path: '/form', method: 'POST' })
  formPost(body: Body) {
    this.form.assert(body.data);
    return this.form.data;
  }
}
```

## Changelog

### 3.7.0
- 更新到 zenweb@3.11.0
