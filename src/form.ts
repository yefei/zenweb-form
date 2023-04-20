import { inject, init } from '@zenweb/inject';
import { MessageCodeResolver } from '@zenweb/messagecode';
import { GetPickReturnType, RequiredError, typeCast, ValidateError, TypeKeys } from 'typecasts';
import { WidgetFail, Widget } from './widgets/widget';
import { ErrorMessages, FieldOption, FormLayout, FormResult, PlainFormFields, WidgetsResult } from './types';
import { propertyAt } from 'property-at';

const objectSpliter = '$';

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

export abstract class Form<
  T extends { [key: string]: unknown } = {},
  O = { [K in keyof T]: FieldOption | TypeKeys }
> {
  @inject messageCodeResolver!: MessageCodeResolver;

  /**
   * 初始化完成的字段
   */
  plainFields!: PlainFormFields;

  /**
   * 布局结果
   */
  _layout?: FormLayout[];

  /**
   * 字段结果
   */
  _fields?: WidgetsResult;

  /**
   * 表单数据
   */
  _data: any = {};

  /**
   * 表单校验错误信息
   */
  errors: { [field: string]: any } = {};

  /**
   * 是否有校验错误
   */
  hasErrors: boolean = false;

  /**
   * 已格式化错误消息
   */
  _errorMessages?: ErrorMessages;

  /**
   * 安装初始化字段
   */
  abstract setup(): O | Promise<O>;

  /**
   * 初始化
   */
  @init [Symbol()]() {
    const form = this;
    /**
     * 将嵌套类型转换为平面类型
     */
    function eachFields(fields: O, parent?: string) {
      for (let [name, opt] of Object.entries(fields)) {
        if (parent) {
          name = `${parent}${objectSpliter}${name}`;
        }
        if (typeof opt === 'string') {
          form.plainFields[name] = {
            cast: { type: opt, field: name },
            option: {},
          };
        }
        else if (opt.pick && opt.type.includes('object')) {
          eachFields(<O> opt.pick, name);
          continue;
        }
        else {
          opt = Object.assign({ field: name }, opt); // pure CastOption
          const widget = opt.widget || {};
          delete opt.widget;
          form.plainFields[name] = {
            cast: opt,
            option: widget instanceof Widget ? widget.output() : widget,
          };
          if (widget instanceof Widget) {
            plainFields[name].widget = widget;
          }
        }
      }
    }

    eachFields(fields);
  }

  /**
   * 重置表单
   * - 清除已处理数据
   * - 清除已处理字段
   * - 清除已处理布局
   * - 清除错误消息
   */
  reset() {
    delete this._fields;
    delete this._layout;
    this._data = {};
    this.errors = {};
    this.hasErrors = false;
    delete this._errorMessages;
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
  set data(data: { [K in keyof O]?: GetPickReturnType<O, K> } | null | undefined) {
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
      Object.assign(this._data, data);
    } else {
      this._data = {};
    }
  }

  /**
   * 输出字段
   */
  get fields() {
    if (!this._fields) {
      this._fields = {};
      for (const [name, opt] of Object.entries(this.plainFields)) {
        this._fields[name] = {
          type: 'Text',
          ...opt.option,
          required: opt.cast.type.startsWith('!'),
          valueType: opt.cast.type,
          default: propertyAt(this._data, name.split(objectSpliter)) || opt.cast.default,
          validate: opt.cast.validate,
        };
        if (opt.widget) {
          Object.assign(this._fields[name], opt.widget instanceof Widget ? opt.widget.output() : opt.widget);
        }
      }
    }
    return this._fields;
  }

  /**
   * 表单布局，如果不设置或者缺少字段，则自动按顺序追加到结尾
   */
  get layout() {
    if (!this._layout) {
      this._layout = [];
      for (const name of Object.keys(this.plainFields)) {
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
    for (const [ name, opt ] of Object.entries(this.plainFields)) {
      // 忽略只读字段
      if (opt.option.readonly) continue;
      try {
        // 尝试获取输入数据，先key匹配，如果没有尝试key列表匹配
        let _inputData;
        if (input && typeof input === 'object') {
          if (name in input) _inputData = input[name];
          else if (`${name}[]` in input) _inputData = input[`${name}[]`];
        }
        let value: any = typeCast(_inputData, opt.cast);
        if (value !== undefined) {
          if (opt.widget && opt.widget.clean) {
            value = await opt.widget.clean(value);
          }
          // 字段数据清理
          // 查找对象方法组合为 clean_{fieldname}() 的函数
          const cleanField = (<any>this)[`clean_${name}`] as (data: any) => any;
          if (cleanField && typeof cleanField === 'function') {
            value = await cleanField.call(this, value);
          }
          // this._data[name] = value;
          propertyAt(this._data, name.split(objectSpliter), value);
        }
      } catch (e) {
        this.errors[name] = e;
        this.hasErrors = true;
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
      throw new WidgetFail('form.fail', undefined, {
        errors: this.errorMessages,
      });
    }
  }

  /**
   * 验证失败 - 抛出异常
   */
  fail(code: string | number, params?: any) {
    throw new WidgetFail(code, params);
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
        else if (e instanceof WidgetFail) {
          messages[field] = this.messageCodeResolver.format(`${e.code}.${field}`, e.params);
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

/**
 * 生成表单基类
 * @param fields 表单字段定义
 * @param cleans 字段数据清理方法
 * @returns 表单基类，需要使用类继承
 */
export function FormBase<O extends FormFields>(fields: O): { new (): Form<O> } {

  const plainFields: PlainFormFields = {};

  /**
   * 将嵌套类型转换为平面类型
   */
  function eachFields(fields: O, parent?: string) {
    for (let [name, opt] of Object.entries(fields)) {
      if (parent) {
        name = `${parent}${objectSpliter}${name}`;
      }
      if (typeof opt === 'string') {
        plainFields[name] = {
          cast: { type: opt, field: name },
          option: {},
        };
      }
      else if (opt.pick && opt.type.includes('object')) {
        eachFields(<O> opt.pick, name);
        continue;
      }
      else {
        opt = Object.assign({ field: name }, opt); // pure CastOption
        const widget = opt.widget || {};
        delete opt.widget;
        plainFields[name] = {
          cast: opt,
          option: widget instanceof Widget ? widget.output() : widget,
        };
        if (widget instanceof Widget) {
          plainFields[name].widget = widget;
        }
      }
    }
  }

  eachFields(fields);

  return class extends Form<O> {
    plainFields = plainFields;
  }
}
