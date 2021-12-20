import { castType, castTypeFunc, validates } from 'typecasts';
import { FormField } from '../types';

const OPTIONS = Symbol('Input#options');
const NAME = Symbol('Input#name');

export class InputFail extends Error {
  code: string;
  params: any[];

  constructor(code: string, params?: any) {
    super(code);
    this.name = 'InputFail';
    this.code = code;
    this.params = params;
  }
}

export class Input {
  [OPTIONS]: FormField;
  [NAME]: string;

  constructor(label: string) {
    this[OPTIONS] = {
      label,
    };
  }

  get options() {
    return this[OPTIONS];
  }

  get _name() {
    return this[NAME] || this.constructor.name;
  }

  /**
   * 控件名称
   */
  name(name: string) {
    this[NAME] = name;
    return this;
  }

  /**
   * 输入值类型
   */
  type(type: castType | castTypeFunc) {
    this[OPTIONS].type = type;
    return this;
  }

  /**
   * 帮助信息
   */
  help(help: string) {
    this[OPTIONS].help = help;
    return this;
  }

  /**
   * 必填项
   */
  required(is: boolean | string = true) {
    this[OPTIONS].required = is;
    return this;
  }

  /**
   * 默认值
   */
  default(value: any) {
    this[OPTIONS].default = value;
    return this;
  }

  /**
   * 数据验证
   */
  validate(validate: validates) {
    this[OPTIONS].validate = validate;
    return this;
  }

  /**
   * 构建表单项整体参数
   */
  build() {
    const attr = this.attr();
    return Object.assign({
      name: this._name,
    }, this[OPTIONS], attr);
  }

  /**
   * 构建表单组件参数
   */
  attr() {
  }

  /**
   * 组件验证，如果验证不通过需要抛出异常，使用 this.fail('code')
   */
  postValidate(data: any) {
  }

  /**
   * 验证失败
   */
  fail(code: string, params?: any) {
    throw new InputFail(code, params);
  }
}
