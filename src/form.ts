import { inject, init } from '@zenweb/inject';
import { MessageCodeResolver } from '@zenweb/messagecode';
import { GetPickReturnType, RequiredError, typeCast, TypeKeys, ValidateError } from 'typecasts';
import { WidgetFail, Widget } from './widgets/widget';
import { Fields, FormFieldCleans, Layout, WidgetResult } from './types';

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

export abstract class Form<O extends Fields> {
  @inject messageCodeResolver!: MessageCodeResolver;

  /**
   * 定义表单字段
   */
  abstract fields: O;

  /**
   * 表单布局，如果不设置或者缺少字段，则自动按顺序追加到结尾
   */
  layout: Layout[] = [];

  /**
   * 表单数据
   */
  _data: any = {};

  /**
   * 表单校验错误信息
   */
  errors: { [field: string]: any } = {};

  @init
  async init() {
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
          type: 'text',
          required: opt.type.startsWith('!'),
          valueType: opt.type,
          default: opt.default,
          validate: opt.validate,
        } as WidgetResult,
        opt.widget instanceof Widget ? opt.widget.build() : opt.widget);
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
      const _opt = option.widget || {};
      // 忽略只读字段
      if (_opt.readonly) continue;
      try {
        // 尝试获取输入数据，先key匹配，如果没有尝试key列表匹配
        let _inputData;
        if (input && typeof input === 'object') {
          if (name in input) _inputData = input[name];
          else if (`${name}[]` in input) _inputData = input[`${name}[]`];
        }
        let value: unknown = typeCast(_inputData, option);
        if (value !== undefined) {
          if (_opt instanceof Widget) {
            value = await _opt.clean(value);
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

  fail(code: string | number, params?: any) {
    throw new WidgetFail(code, params);
  }

  /**
   * 错误消息
   */
  get errorMessages() {
    const messageCodeResolver = this.messageCodeResolver || new NonMessageCodeResolver();
    const messages: { [field: string]: string | number } = {};
    Object.entries(this.errors).map(([field, e]) => {
      if (e instanceof RequiredError) {
        messages[field] = messageCodeResolver.format(`form.required-error.${field}`, {});
      }
      else if (e instanceof ValidateError) {
        let code = e.validate;
        if (e.validate === 'cast') code += `.${typeof e.target === 'function' ? e.target.name || '-' : e.target}`;
        messages[field] = messageCodeResolver.format(`form.validate-error.${code}.${field}`, e);
      }
      else if (e instanceof WidgetFail) {
        messages[field] = messageCodeResolver.format(`form.field-fail.${e.code}.${field}`, e.params);
      }
      else {
        messages[field] = e.message;
      }
    });
    return messages;
  }
}

/**
 * 生成表单类
 * - 需要使用依赖注入取得类实例
 * @param fields 表单字段
 */
export function makeForm<O extends Fields>(fields: O, cleans?: FormFieldCleans<O>) {
  return class extends Form<O> {
    fields = fields;
  };
}

/*
const Testform = makeForm({
  username: {
    type: 'string',
  }
});

const t = new Testform();
const x = t.data;
*/
