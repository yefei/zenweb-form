import { ResultFail } from '@zenweb/result';
import { WidgetOption } from '../types';

export class WidgetFail extends ResultFail {
  constructor(code: string | number, params?: any, data?: any) {
    super({
      code,
      params,
      data,
    });
  }
}

export interface Widget {
  /**
   * 额外输出参数
   */
  extra?(): Record<string, any>;

  /**
   * 数据验证清理
   * - 在字段数据验证通过后调用
   * - 如果验证不通过需要抛出异常可以使用 `this.fail('code')`
   * - 需要返回清理完成的数据
   */
  clean?(data: any): any;
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
    return Object.assign({}, this.option, this.extra ? this.extra() : undefined);
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
