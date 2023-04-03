import { UploadHelper } from '@zenweb/upload';
import { Context, mapping, ObjectBody } from 'zenweb';
import { ExampleForm } from '../form/example';

export class IndexController {
  @mapping({ method: 'POST' })
  upload(upload: UploadHelper) {
    return {
      url: upload.file('file')?.originalFilename,
    };
  }

  @mapping()
  form(form: ExampleForm) {
    form.data = { name: '默认名字' };
    return form.result;
  }

  @mapping({ path: '/form', method: 'POST' })
  async formPost(form: ExampleForm, body: ObjectBody) {
    await form.assert(body);
    return form.data;
  }

  /**
   * 合并处理
   */
  @mapping({ method: ['GET', 'POST'] })
  async merge(ctx: Context, form: ExampleForm, body: ObjectBody) {
    form.data = { name: '默认名字' };
    if (ctx.method === 'POST') {
      await form.assert(body);
      return form.data;
    }
    return form.result;
  }

  @mapping({ method: ['GET', 'POST'] })
  async html(ctx: Context, form: ExampleForm, body: ObjectBody) {
    ctx.template('zenweb/form/layout.html.njk');
    form.data = { name: '默认名字' };
    if (ctx.method === 'POST') {
      await form.assert(body);
      return form.data;
    }
    return form.result;
  }
}
