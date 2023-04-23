import { TypeKeys } from 'typecasts';
import { Field, simple } from '../field';

/**
 * 一个勾选框
 * - 通常用于用户注册协议
 */
export class Onebox<T extends TypeKeys> extends Field<T> {
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
    data = super.clean(data);
    if (data === undefined) return;
    if (this._value !== data) {
      this.fail('form.onebox.not-eq', { value: this._value });
    }
    return true;
  }
}

export const onebox = simple(Onebox);
