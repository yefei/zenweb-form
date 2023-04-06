import { inject, init } from '@zenweb/inject';
import { MessageCodeResolver } from '@zenweb/messagecode';
import { GetPickReturnType, RequiredError, typeCast, ValidateError } from 'typecasts';
import { WidgetFail, Widget } from './widgets/widget';
import { FormFields, FormLayout, WidgetOption, WidgetResult } from './types';

function layoutExists(layout: FormLayout[], name: string): boolean {
  for (const i of layout) {
    if (i === name) return true;
    if (Array.isArray(i)) return layoutExists(i, name);
  }
  return false;
}

export abstract class Form<O extends FormFields> {
  @inject messageCodeResolver!: MessageCodeResolver;

  /**
   * 已定义表单字段
   */
  fields!: O;

  /**
   * 表单布局，如果不设置或者缺少字段，则自动按顺序追加到结尾
   */
  layout: FormLayout[] = [];

  /**
   * 表单数据
   */
  _data: any = {};

  /**
   * 表单校验错误信息
   */
  errors: { [field: string]: any } = {};

  @init
  async [Symbol()]() {
    for (const name of Object.keys(this.fields)) {
      if (!layoutExists(this.layout, name)) {
        this.layout.push(name);
      }
    }
    return this;
  }

  /**
   * 取得表单提交结果
   */
  get data(): { [K in keyof O]: GetPickReturnType<O, K> } {
    return this._data;
  }

  /**
   * 设置表单提交结果或初始值
   */
  set data(data: Partial<{ [K in keyof O]: GetPickReturnType<O, K> }> | null | undefined) {
    Object.assign(this._data, data);
  }

  _getWidgetResults(fields: O, parent?: string) {
    const out: { [name: string]: WidgetResult } = {};
    for (let [name, opt] of Object.entries(fields)) {
      if (parent) {
        name = `${parent}.${name}`;
      }
      if (opt.type.includes('object') && opt.pick) {
        out[name] = this._getWidgetResults(<O> opt.pick, name);
      } else {
        out[name] = Object.assign({
          type: 'Text',
          required: opt.type.startsWith('!'),
          valueType: opt.type,
          default: opt.default,
          validate: opt.validate,
        } as WidgetResult,
        opt.widget instanceof Widget ? opt.widget.output() : opt.widget);
      }
    }
    return out;
  }

  /**
   * 输出表单给前端
   */
  get result() {
    return {
      fields: this._getWidgetResults(this.fields),
      layout: this.layout,
      errors: this.hasErrors ? this.errorMessages : undefined,
    };
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
  async validate(input: any) {
    for (const [ name, option ] of Object.entries(this.fields)) {
      const _opt: WidgetOption = (option.widget instanceof Widget ? option.widget.option : option.widget) || {};
      // 忽略只读字段
      if (_opt.readonly) continue;
      try {
        // 尝试获取输入数据，先key匹配，如果没有尝试key列表匹配
        let _inputData;
        if (input && typeof input === 'object') {
          if (name in input) _inputData = input[name];
          else if (`${name}[]` in input) _inputData = input[`${name}[]`];
        }
        option.field = name;
        let value: any = typeCast(_inputData, option);
        if (value !== undefined) {
          if (_opt instanceof Widget) {
            value = await _opt.clean(value);
          }
          // 字段数据清理
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
   * 检查输入数据，如果有误直接抛出异常
   */
  async assert(input: any) {
    if (!await this.validate(input)) {
      throw new WidgetFail('form.fail', undefined, this.errorMessages);
    }
  }

  fail(code: string | number, params?: any) {
    throw new WidgetFail(code, params);
  }

  /**
   * 错误消息
   */
  get errorMessages() {
    const messages: { [field: string]: string | number } = {};
    Object.entries(this.errors).map(([field, e]) => {
      if (e instanceof RequiredError) {
        messages[field] = this.messageCodeResolver.format(`form.required.${field}`, {});
      }
      else if (e instanceof ValidateError) {
        let code = e.validate;
        if (e.validate === 'cast') code += `.${typeof e.target === 'function' ? e.target.name || '-' : e.target}`;
        messages[field] = this.messageCodeResolver.format(`form.validate.${code}.${field}`, e);
      }
      else if (e instanceof WidgetFail) {
        messages[field] = this.messageCodeResolver.format(`${e.code}.${field}`, e.params);
      }
      else {
        messages[field] = e.message;
      }
    });
    return messages;
  }
}

/**
 * 生成表单基类
 * @param fields 表单字段定义
 * @param cleans 字段数据清理方法
 * @returns 表单基类，需要使用类继承
 */
export function FormBase<O extends FormFields>(fields: O): { new (): Form<O> } {
  return class extends Form<O> {
    fields = fields;
  }
}
