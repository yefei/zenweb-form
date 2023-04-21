import { Widget, simple } from './widget';

/**
 * 一个勾选框
 * - 通常用于用户注册协议
 */
export class Onebox extends Widget {
  private _value: any = true;

  /**
   * 设置勾选值
   */
  value(value: any) {
    this._value = value;
    return this;
  }

  extra(): Record<string, any> {
    return {
      value: this._value,
    };
  }

  clean(data: any) {
    if (this._value !== data) {
      this.fail('form.onebox.not-eq', { value: this._value });
    }
    return true;
  }
}

export const onebox = simple(Onebox);
