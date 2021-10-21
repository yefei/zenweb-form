# ZenWeb Form module

[ZenWeb](https://www.npmjs.com/package/zenweb)

```js
app.formRouter('/form', {
  fields: {
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
  },

  post(ctx, form) {
    ctx.body = 'success';
  },
});
```
