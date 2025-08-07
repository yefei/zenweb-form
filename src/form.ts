import { inject, init } from '@zenweb/inject';
import { MessageCodeResolver } from '@zenweb/messagecode';
import { RequiredError, ValidateError } from 'typecasts';
import { ErrorMessages, FormData, FormLayout, FormResult, FormFields, FieldsResult, GetFieldType } from './types.js';
import { FieldFail } from './field.js';

// const objectSpliter = '$';

function layoutExists(layout: FormLayout[], name: string): boolean {
  for (const i of layout) {
    if (i === name) return true;
    if (Array.isArray(i)) return layoutExists(i, name);
  }
  return false;
}

export interface Form {
  /**
   * 总体数据验证清理
   * - 在所有字段验证通过后调用
   * - 如果验证不通过需要抛出异常可以使用 `this.fail('code')`
   * - 使用 `this.data` 访问或改变数据
   */
  clean?(): void | Promise<void>;
}

export class Form<T extends FormData = FormData> {
  @inject protected messageCodeResolver!: MessageCodeResolver;

  /**
   * 初始化完成的字段
   */
  protected _fields!: FormFields;

  /**
   * 布局结果
   */
  private _layout?: FormLayout[];

  /**
   * 字段结果
   */
  private _fieldsResult?: FieldsResult;

  /**
   * 表单数据
   */
  protected _data?: T;

  /**
   * 表单校验错误信息
   */
  errors: { [field: string]: any } = {};

  /**
   * 是否有校验错误
   */
  get hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * 已格式化错误消息
   */
  private _errorMessages?: ErrorMessages;

  /**
   * 重置表单
   * - 清除已处理数据
   * - 清除已处理字段
   * - 清除已处理布局
   * - 清除错误消息
   */
  reset() {
    delete this._fieldsResult;
    delete this._layout;
    delete this._data;
    this.errors = {};
    delete this._errorMessages;
  }

  /**
   * 取得表单提交结果
   */
  get data() {
    return this._data;
  }

  /**
   * 设置表单提交结果或初始值
   */
  set data(data: Partial<T> | null | undefined) {
    if (data) {
      /*
      for (const [name, opt] of Object.entries(this.plainFields)) {
        const kpath = name.split(objectSpliter);
        const value = propertyAt(data, kpath);
        if (typeof value !== 'undefined') {
          propertyAt(this._data, kpath, typeCast(value, opt.cast));
        }
      }
      */
      this._data = Object.assign({}, this._data, data);
    } else {
      delete this._data;
    }
  }

  /**
   * 输出字段
   */
  get fields() {
    if (!this._fieldsResult) {
      this._fieldsResult = {};
      for (const [ name, field ] of Object.entries(this._fields)) {
        this._fieldsResult[name] = field.output(this._data, name);
      }
    }
    return this._fieldsResult;
  }

  /**
   * 表单布局，如果不设置或者缺少字段，则自动按顺序追加到结尾
   */
  get layout() {
    if (!this._layout) {
      this._layout = [];
      for (const name of Object.keys(this._fields)) {
        if (!layoutExists(this._layout, name)) {
          this._layout.push(name);
        }
      }
    }
    return this._layout;
  }

  /**
   * 输出表单给前端
   */
  toJSON(): FormResult {
    return {
      fields: this.fields,
      layout: this.layout,
    };
  }

  /**
   * 验证输入数据
   * @param input 输入数据
   * @returns 是否有错误
   */
  async validate(input: any) {
    this.reset();
    for (const [ name, field ] of Object.entries(this._fields)) {
      // 忽略只读字段
      if (field.option.readonly) continue;
      try {
        // 尝试获取输入数据，先key匹配，如果没有尝试key列表匹配
        let _inputData;
        if (input && typeof input === 'object') {
          if (name in input) _inputData = input[name];
          else if (`${name}[]` in input) _inputData = input[`${name}[]`];
        }
        let value: any = field.clean(_inputData);
        if (value !== undefined) {
          // 字段数据清理
          // 查找对象方法组合为 clean_{fieldname}() 的函数
          const cleanField = (<any>this)[`clean_${name}`] as (data: any) => any;
          if (cleanField && typeof cleanField === 'function') {
            value = await cleanField.call(this, value);
          }
          if (!this._data) this._data = {} as T;
          // @ts-ignore
          this._data[name] = value;
          // propertyAt(this._data, name.split(objectSpliter), value);
        }
      } catch (e) {
        this.errors[name] = e;
      }
    }
    if (!this.hasErrors && this.clean) {
      await this.clean();
    }
    return !this.hasErrors;
  }

  /**
   * 检查输入数据，如果有误直接抛出异常
   */
  async assert(input: any) {
    if (!await this.validate(input)) {
      throw new FieldFail('form.fail', undefined, {
        errors: this.errorMessages,
      });
    }
  }

  /**
   * 验证失败 - 抛出异常
   */
  fail(code: string, params?: any) {
    throw new FieldFail(code, params);
  }

  /**
   * 错误消息
   * - 当发生错误时 key 对应字段名称
   */
  get errorMessages() {
    if (!this._errorMessages) {
      const messages: ErrorMessages = {};
      Object.entries(this.errors).map(([field, e]) => {
        if (e instanceof RequiredError) {
          messages[field] = this.messageCodeResolver.format(`form.required.${field}`, {});
        }
        else if (e instanceof ValidateError) {
          let code = e.validate;
          if (e.validate === 'cast') code += `.${typeof e.target === 'function' ? e.target.name || '-' : e.target}`;
          messages[field] = this.messageCodeResolver.format(`form.validate.${code}.${field}`, e);
        }
        else if (e instanceof FieldFail) {
          messages[field] = this.messageCodeResolver.format(`${e.mcode}.${field}`, e.extra);
        }
        else {
          messages[field] = e.message;
        }
      });
      this._errorMessages = messages;
    }
    return this._errorMessages;
  }
}

export abstract class FormBase extends Form {
  /**
   * 安装初始化
   */
  abstract setup(): {} | Promise<{}>;

  get data(): { [K in keyof Awaited<ReturnType<this['setup']>>]: GetFieldType<Awaited<ReturnType<this['setup']>>[K]> }  {
    return this._data as any;
  }

  set data(data: Partial<{ [K in keyof Awaited<ReturnType<this['setup']>>]: GetFieldType<Awaited<ReturnType<this['setup']>>[K]> }> | null | undefined) {
    if (data) {
      this._data = Object.assign({}, this._data, data);
    } else {
      delete this._data;
    }
  }

  /**
   * 初始化
   */
  @init async [Symbol()]() {
    this._fields = await this.setup();
  }
}
