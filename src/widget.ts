import { WidgetOption } from "./types";

export class Widget {
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
   * 额外输出参数
   */
  protected extra?(): Record<string, any>;

  /**
   * 输出结果给客户端
   * - 内部调用
   */
  output() {
    return Object.assign({}, this.option, this.extra ? this.extra() : undefined);
  }
}
