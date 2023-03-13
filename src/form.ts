/// <reference types="@zenweb/result" />
import { Context } from '@zenweb/core';
import { inject, init } from '@zenweb/inject';
import { MessageCodeResolver } from '@zenweb/messagecode';
import { RequiredError, typeCast, ValidateError } from 'typecasts';
import { Input, InputFail } from './field/input';
import { Fields, FormData, FieldOption, Layout } from './types';

function layoutExists(layout: Layout[], name: string): boolean {
  for (const i of layout) {
    if (i === name) return true;
    if (Array.isArray(i)) return layoutExists(i, name);
  }
  return false;
}

class NonMessageCodeResolver {
  format(code: string, params?: any) {
    return code;
  }
}

export abstract class Form<D extends FormData = FormData> {
  @inject protected messageCodeResolver!: MessageCodeResolver;
  @inject protected ctx!: Context;

  /**
   * 定义表单字段
   */
  abstract fields(): Fields | Promise<Fields>;
  private _fields!: Fields;

  /**
   * 表单布局，如果不设置或者缺少字段，则自动按顺序追加到结尾
   */
  layout: Layout[] = [];

  private _data: any = {};

  /**
   * 表单校验错误信息
   */
  errors: { [field: string]: any } = {};

  /**
   * 表单字段默认配置
   */
  defaultOption: FieldOption = {
    type: 'string',
    required: true,
  };

  private _filedsResult: { [name:string]: FieldOption } = {};

  @init
  async init() {
    this._fields = await this.fields();
    for (const [ name, option ] of Object.entries(this._fields)) {
      if (!layoutExists(this.layout, name)) {
        this.layout.push(name);
      }
      const opt = Object.assign({}, this.defaultOption, option instanceof Input ? option.build() : option);
      this._filedsResult[name] = opt;
    }
    return this;
  }

  /**
   * 取得表单提交结果
   */
  get data(): D {
    return this._data;
  }

  /**
   * 设置表单提交结果或初始值
   */
  set data(data: Partial<D> | null | undefined) {
    this._data = data || {};
    for (const name of Object.keys(this._filedsResult)) {
      if (this._data[name] !== undefined) {
        this._filedsResult[name].default = this._data[name];
      }
    }
  }

  /**
   * 输出表单给前端
   */
  get result() {
    return { fields: this._filedsResult, layout: this.layout };
  }

  /**
   * 是否有校验错误
   */
  get hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * 验证输入数据
   * @param input 输入数据
   * @returns 是否有错误
   */
  async validate(input?: Partial<D>) {
    for (const [ name, option ] of Object.entries(this._fields)) {
      // 忽略只读字段
      if (this._filedsResult[name].readonly) continue;
      try {
        // 尝试获取输入数据，先key匹配，如果没有尝试key列表匹配
        let _inputData;
        if (input && typeof input === 'object') {
          if (name in input) _inputData = input[name];
          else if (`${name}[]` in input) _inputData = input[`${name}[]`];
        }
        let value = typeCast(_inputData, this._filedsResult[name], name);
        if (value !== undefined) {
          if (option instanceof Input) {
            value = await option.clean(value);
          }
          // 表单对象方法校验，来自 Django
          // 查找对象方法组合为 clean_{fieldname}() 的函数
          const cleanField = (<any>this)[`clean_${name}`] as (data: any) => any;
          if (cleanField && typeof cleanField === 'function') {
            value = await cleanField.call(this, value);
          }
          this._data[name] = value;
        }
      } catch (e) {
        this.errors[name] = e;
      }
    }
    return !this.hasErrors;
  }

  /**
   * 校验数据如果出错直接调用 ctx.fail 或抛出异常
   * @param input 输入数据
   */
  async assert(input?: Partial<D>) {
    if (!await this.validate(input)) {
      this.fail('form valid error', { errors: this.errorMessages });
    }
  }

  /**
   * 表单抛异常
   */
  fail(message: string, data?: any) {
    if (this.ctx.fail) {
      this.ctx.fail({ message, data });
    }
    throw new Error(message);
  }

  /**
   * 错误消息
   */
  get errorMessages() {
    const messageCodeResolver = this.messageCodeResolver || new NonMessageCodeResolver();
    const messages: { [field: string]: string } = {};
    Object.entries(this.errors).map(([field, e]) => {
      if (e instanceof RequiredError) {
        messages[field] = messageCodeResolver.format(`form.required-error.${field}`, {});
      }
      else if (e instanceof ValidateError) {
        let code = e.validate;
        if (e.validate === 'cast') code += `.${typeof e.target === 'function' ? e.target.name || '-' : e.target}`;
        messages[field] = messageCodeResolver.format(`form.validate-error.${code}.${field}`, e);
      }
      else if (e instanceof InputFail) {
        messages[field] = messageCodeResolver.format(`form.input-fail.${e.code}.${field}`, e.params);
      }
      else {
        messages[field] = e.message;
      }
    });
    return messages;
  }
}
