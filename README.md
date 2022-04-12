# ZenWeb Form module

[ZenWeb](https://www.npmjs.com/package/zenweb)

```js
import { Router } from '@zenweb/router';
import { formRouter, fields, FormController } from '@zenweb/form';
export const router = new Router();

formRouter(router, '/form', class extends FormController {
  fields = {
    name: {
      label: '姓名',
      validate: {
        minLength: 2,
        maxLength: 10,
      }
    },
    age: {
      label: '年龄',
      type: 'int',
      validate: {
        gt: 17,
        lt: 100,
      }
    }
  }

  post() {
    this.ctx.body = this.form.data;
  }
});
```
