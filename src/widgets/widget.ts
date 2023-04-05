import { WidgetOption } from '../types';

export class WidgetFail extends Error {
  code: string | number;
  params: any[];

  constructor(code: string | number, params?: any) {
    super(`WidgetFail: ${code}`);
    this.name = 'WidgetFail';
    this.code = code;
    this.params = params;
  }
}

export class Widget {
  protected _option: WidgetOption;
  protected _type: string = this.constructor.name;

  constructor(label: string) {
    this._option = {
      label,
    };
  }

  /**
   * 帮助信息
   */
  help(help: string) {
    this._option.help = help;
    return this;
  }

  /**
   * 提示信息
   */
  placeholder(text: string) {
    this._option.placeholder = text;
    return this;
  }

  /**
   * 只读，即使提交也不会更新
   */
  readonly(is = true) {
    this._option.readonly = is;
    return this;
  }

  /**
   * 构建表单项整体参数
   */
  build() {
    const attr = this.attrs();
    return Object.assign({
      type: this._type,
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
  protected fail(code: string, params?: any) {
    throw new WidgetFail(code, params);
  }
}

export function simple<T>(clazz: { new(label: string): T }) {
  return (label: string): T => new clazz(label);
} 
