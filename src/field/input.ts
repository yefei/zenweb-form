import { TypeKeys, ValidateOption } from 'typecasts';
import { FieldOption } from '../types';

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
  protected _option: Partial<FieldOption>;
  protected _name: string = this.constructor.name;

  constructor(label: string) {
    this._option = {
      label,
    };
  }

  /**
   * 控件名称
   */
  name(name: string) {
    this._name = name;
    return this;
  }

  /**
   * 输入值类型
   */
  type(type: TypeKeys) {
    this._option.type = type;
    return this;
  }

  /**
   * 帮助信息
   */
  help(help: string) {
    this._option.help = help;
    return this;
  }

  /**
   * 必填项
   */
  required(is: boolean | string = true) {
    this._option.required = is;
    return this;
  }

  /**
   * 默认值
   */
  default(value: any) {
    this._option.default = value;
    return this;
  }

  /**
   * 数据验证
   */
  validate(validate: ValidateOption) {
    this._option.validate = validate;
    return this;
  }

  /**
   * 构建表单项整体参数
   */
  build() {
    const attr = this.attrs();
    return Object.assign({
      name: this._name,
    }, this._option, attr);
  }

  /**
   * 构建表单组件参数
   */
  attrs() {
  }

  /**
   * 数据验证清理，如果验证不通过需要抛出异常，使用 this.fail('code')
   */
  clean(data: any): any {
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
