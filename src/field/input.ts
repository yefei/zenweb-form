import { castType, castTypeFunc, validates } from 'typecasts';
import { FieldOption } from '../types';

const OPTION = Symbol('Input#options');
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
  [OPTION]: FieldOption;
  [NAME]: string;

  constructor(label: string) {
    this[OPTION] = {
      label,
    };
  }

  get options() {
    return this[OPTION];
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
    this[OPTION].type = type;
    return this;
  }

  /**
   * 帮助信息
   */
  help(help: string) {
    this[OPTION].help = help;
    return this;
  }

  /**
   * 必填项
   */
  required(is: boolean | string = true) {
    this[OPTION].required = is;
    return this;
  }

  /**
   * 默认值
   */
  default(value: any) {
    this[OPTION].default = value;
    return this;
  }

  /**
   * 数据验证
   */
  validate(validate: validates) {
    this[OPTION].validate = validate;
    return this;
  }

  /**
   * 构建表单项整体参数
   */
  build() {
    const attr = this.attr();
    return Object.assign({
      name: this._name,
    }, this[OPTION], attr);
  }

  /**
   * 构建表单组件参数
   */
  attr() {
  }

  /**
   * 数据验证清理，如果验证不通过需要抛出异常，使用 this.fail('code')
   */
  clean(data: any) {
    return data;
  }

  /**
   * 验证失败
   */
  fail(code: string, params?: any) {
    throw new InputFail(code, params);
  }
}

export function simple<T>(clazz: { new(label: string): T }) {
  return (label: string): T => new clazz(label);
} 
