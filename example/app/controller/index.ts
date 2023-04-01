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

  @mapping({ path: '/form' })
  formGet(form: ExampleForm) {
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
    if (ctx.method === 'GET') {
      form.data = { name: '默认名字' };
    } else {
      await form.assert(body);
      return ctx.success(form.data);
    }
    ctx.success(form.result);
  }
}
