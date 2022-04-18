import { Context, inject, mapping } from 'zenweb';
import { ExampleForm } from '../form/example';

export class IndexController {
  @inject
  ctx: Context

  @mapping({ method: 'POST' })
  upload() {
    this.ctx.success({
      url: 'test'
    });
  }

  @inject
  form: ExampleForm;

  @mapping({ path: '/form' })
  formGet() {
    this.form.data = { name: '默认名字' };
    this.ctx.success(this.form.result);
  }

  @mapping({ path: '/form', method: 'POST' })
  formPost() {
    this.form.assert(this.ctx.request.body);
    this.ctx.success(this.form.data);
  }
}
