import { Upload, UploadHelper } from '@zenweb/upload';
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
  async formPost(form: ExampleForm, input: ObjectBody) {
    await form.assert(input);
    return form.data;
  }

  /**
   * 合并处理
   */
  @mapping({ method: ['GET', 'POST'] })
  async merge(ctx: Context, form: ExampleForm, input: ObjectBody) {
    form.data = { name: '默认名字' };
    if (ctx.method === 'POST') {
      await form.assert(input);
      return form.data;
    }
    return form.result;
  }

  @mapping({ method: ['GET', 'POST'] })
  async html(ctx: Context, form: ExampleForm, upload: Upload) {
    ctx.template('form.html.njk');
    form.data = { name: '默认名字' };
    let ok = false;
    const input = upload.fields;
    if (ctx.method === 'POST') {
      // 处理上传文件
      const file = upload.files['upload'];
      if (file && !Array.isArray(file) && file.size > 0) {
        // 保存文件逻辑
        // ...
        // 保存完成后给定文件标示，用于表单验证失败后暂存已上传文件信息
        input['upload'] = file.originalFilename || file.newFilename;
      }
      ok = await form.validate(input);
      if (ok) {
        // some code
      }
    }
    return { form: form.result, input, ok };
  }
}
