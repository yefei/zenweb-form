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

export abstract class Widget {
  option: WidgetOption = {
    type: this.constructor.name,
  };

  /**
   * 显示名
   */
  label(label: string) {
    this.option.label = label;
    return this;
  }

  /**
   * 帮助信息
   */
  help(help: string) {
    this.option.help = help;
    return this;
  }

  /**
   * 提示信息
   */
  placeholder(text: string) {
    this.option.placeholder = text;
    return this;
  }

  /**
   * 只读，即使提交也不会更新
   */
  readonly(is = true) {
    this.option.readonly = is;
    return this;
  }

  /**
   * 输出参数
   */
  output() {
    return Object.assign({}, this.option, this.extra());
  }

  /**
   * 额外输出参数
   * - 继承类使用
   */
  extra() {
  }

  /**
   * 数据验证清理，如果验证不通过需要抛出异常，使用 this.fail('code')
   * - 继承类使用
   */
  clean(data: any) {
    return data;
  }

  /**
   * 验证失败
   */
  protected fail(code: string, params?: any) {
    throw new WidgetFail(code, params);
  }
}

export function simple<W extends Widget>(clazz: { new (): W }) {
  return (label?: string) => {
    const w = new clazz();
    if (label) w.label(label);
    return w;
  }
}
