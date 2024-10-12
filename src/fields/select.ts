import { $enum } from 'ts-enum-util';
import { Field, simple } from '../field.js';
import { TypeKeys } from 'typecasts';

export type ChoiceValueType = number | string;

export interface ChoiceType {
  /**
   * 显示名
   */
  label: string;

  /**
   * 值
   */
  value: ChoiceValueType;

  /**
   * 禁止选择
   */
  disabled?: boolean;
}

export class Select<T extends TypeKeys> extends Field<T> {
  protected _choices: ChoiceType[] = [];

  /**
   * 设置选择项
   */
  choices(choices: (ChoiceValueType | ChoiceType)[]) {
    for (const c of choices) {
      if (typeof c === 'object') {
        this._choices.push(c);
      } else {
        this._choices.push({ label: String(c), value: c });
      }
    }
    return this;
  }

  /**
   * 设置选择项，使用指定的 value 和 label
   */
  choicesMap(choices: any[], valueKey: string, labelKey: string) {
    return this.choices(choices.map(i => ({value: i[valueKey], label: i[labelKey]})));
  }

  /**
   * 设置选项，使用对象的 key 和 value
   */
  choicesObject(obj: object) {
    return this.choices(Object.entries(obj).map(([value, label]) => ({ value, label })));
  }

  /**
   * 使用 ts 的 enum 类型作为选择项
   */
  choicesEnum<T extends Record<Extract<keyof T, string>, ChoiceValueType>>(enumObj: T) {
    return this.choices($enum(enumObj).map((value, label) => ({ value, label })));
  }

  /**
   * 是否没有设置选择项
   */
  isEmpty() {
    return this._choices.length === 0;
  }

  /**
   * 检查选择项是否已经设置
   */
  assertEmpty() {
    if (this.isEmpty()) {
      this.fail('form.select.options.empty');
    }
  }

  extra() {
    return {
      choices: this._choices,
    };
  }

  clean(data: any) {
    data = super.clean(data);
    if (data === undefined) return;
    this.assertEmpty();
    const item = this._choices.find(i => i.value == data);
    if (item) {
      if (item.disabled) {
        this.fail('form.select.choice-disabled', { data, label: item.label });
      }
      return data;
    }
    this.fail('form.select.choice-invalid', { data });
  }
}

export class Radio<T extends TypeKeys> extends Select<T> {}

export class Multiple<T extends TypeKeys> extends Select<T> {
  protected _max?: number;
  protected _min?: number;

  /** 最多可以选择数量 */
  max(v: number) {
    this._max = v;
    return this;
  }

  /** 最少选择数量 */
  min(v: number) {
    this._min = v;
    return this;
  }

  extra() {
    return Object.assign(super.extra(), {
      max: this._max,
      min: this._min,
    });
  }

  clean(data: any) {
    data = super.clean(data);
    if (data === undefined) return;
    this.assertEmpty();
    data = Array.isArray(data) ? data : [data];
    const max = Math.min(this._max || Number.MAX_VALUE, this._choices.length);
    if (data.length > max) {
      this.fail('form.select.choice-max', { max });
    }
    if (this._min && data.length < this._min) {
      this.fail('form.select.choice-min', { min: this._min });
    }
    for (const i of data) {
      const item = this._choices.find(c => c.value == i);
      if (item) {
        if (item.disabled) {
          this.fail('form.select.choice-disabled', { data: i, label: item.label });
        }
      } else {
        this.fail('form.select.choice-invalid', { data: i });
      }
    }
    return data;
  }
}

export class Checkbox<T extends TypeKeys> extends Multiple<T> {}

export const select = simple(Select);
export const radio = simple(Radio);
export const multiple = simple(Multiple);
export const checkbox = simple(Checkbox);
