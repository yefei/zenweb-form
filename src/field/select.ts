import { $enum } from 'ts-enum-util';
import { guessType } from '../utils';
import { Input, simple } from './input';

export interface ChoiceType {
  /**
   * 显示名
   */
  label: number | string;

  /**
   * 值
   */
  value: number | string;

  /**
   * 禁止选择
   */
  disabled?: boolean;
}

export class Select extends Input {
  protected _choices: ChoiceType[] = [];

  /**
   * 设置选择项
   */
  choices(choices: (string | number | ChoiceType)[]) {
    for (const c of choices) {
      if (typeof c === 'object') {
        this._choices.push(c);
      } else {
        this._choices.push({ label: c, value: c });
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
   * 使用 ts 的 enum 类型作为选择项
   */
  choicesEnum<T extends Record<Extract<keyof T, string>, number | string>>(enumObj: T) {
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
      this.fail('select.options.empty');
    }
  }

  attrs() {
    // 如果没有指定类型则自动判断第一个选项的值类型
    !this.isEmpty() && !this._option.type && this.type(guessType(this._choices[0].value));
    return {
      choices: this._choices,
    };
  }

  clean(data: any) {
    this.assertEmpty();
    const item = this._choices.find(i => i.value == data);
    if (item) {
      if (item.disabled) {
        this.fail('select.choice-disabled', { data, label: item.label });
      }
      return data;
    }
    this.fail('select.choice-invalid', { data });
  }
}

export class Radio extends Select {}

export class Multiple extends Select {
  protected _max: number;
  protected _min: number;

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

  attrs() {
    !this.isEmpty() && !this._option.type && this.type(`${guessType(this._choices[0].value)}[]`);
    return Object.assign(super.attrs(), {
      max: this._max,
      min: this._min,
    });
  }

  clean(data: any) {
    this.assertEmpty();
    data = Array.isArray(data) ? data : [data];
    const max = Math.min(this._max || Number.MAX_VALUE, this._choices.length);
    if (data.length > max) {
      this.fail('select.choice-max', { max });
    }
    if (this._min && data.length < this._min) {
      this.fail('select.choice-min', { min: this._min });
    }
    for (const i of data) {
      const item = this._choices.find(c => c.value == i);
      if (item) {
        if (item.disabled) {
          this.fail('select.choice-disabled', { data: i, label: item.label });
        }
      } else {
        this.fail('select.choice-invalid', { data: i });
      }
    }
    return data;
  }
}

export class Checkbox extends Multiple {}

export const select = simple(Select);
export const radio = simple(Radio);
export const multiple = simple(Multiple);
export const checkbox = simple(Checkbox);
