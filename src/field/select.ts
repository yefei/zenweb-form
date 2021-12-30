import { Input, simple } from './input';

const SELECT_CHOICES = Symbol('Select#choices');

interface ChoiceType {
  /**
   * 显示名
   */
  label: number | string;

  /**
   * 值
   */
  value: number | string;
}

export class Select extends Input {
  [SELECT_CHOICES]: ChoiceType[] = [];

  /**
   * 设置选择项
   */
  choices(choices: (string | number | ChoiceType)[]) {
    for (const c of choices) {
      if (typeof c === 'object') {
        this[SELECT_CHOICES].push(c);
      } else {
        this[SELECT_CHOICES].push({ label: c, value: c });
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
   * 是否没有设置选择项
   */
  isEmpty() {
    return !this[SELECT_CHOICES] || this[SELECT_CHOICES].length === 0;
  }

  /**
   * 检查选择项是否已经设置
   */
  assertEmpty() {
    if (this.isEmpty()) {
      this.fail('select.options.empty');
    }
  }

  /**
   * 判断选择项值类型
   */
  protected _guessType(v: any): 'number' | 'bool' | 'string' {
    switch (typeof v) {
      case 'bigint':
      case 'number':
        return 'number';
      case 'boolean':
        return 'bool';
    }
    return 'string';
  }

  attr() {
    // 如果没有指定类型则自动判断第一个选项的值类型
    !this.isEmpty() && !this.options.type && this.type(this._guessType(this[SELECT_CHOICES][0].value));
    return {
      choices: this[SELECT_CHOICES],
    };
  }

  clean(data: any) {
    this.assertEmpty();
    if (this[SELECT_CHOICES].findIndex(i => i.value === data) > -1) {
      return data;
    }
    this.fail('select.choice-invalid', { data });
  }
}

export class Radio extends Select {}

const MULTIPLE_MAX = Symbol('Multiple#max');
const MULTIPLE_MIN = Symbol('Multiple#min');

export class Multiple extends Select {
  [MULTIPLE_MAX]: number;
  [MULTIPLE_MIN]: number;

  /** 最多可以选择数量 */
  max(v: number) {
    this[MULTIPLE_MAX] = v;
    return this;
  }

  /** 最少选择数量 */
  min(v: number) {
    this[MULTIPLE_MIN] = v;
    return this;
  }

  attr() {
    !this.isEmpty() && !this.options.type && this.type(`${this._guessType(this[SELECT_CHOICES][0].value)}[]`);
    return Object.assign(super.attr(), {
      max: this[MULTIPLE_MAX],
      min: this[MULTIPLE_MIN],
    });
  }

  clean(data: any) {
    this.assertEmpty();
    data = Array.isArray(data) ? data : [data];
    if (this[MULTIPLE_MAX] && data.length > this[MULTIPLE_MAX]) {
      this.fail('select.choice-max', { max: this[MULTIPLE_MAX] });
    }
    if (this[MULTIPLE_MIN] && data.length < this[MULTIPLE_MIN]) {
      this.fail('select.choice-min', { min: this[MULTIPLE_MIN] });
    }
    for (const i of data) {
      if (this[SELECT_CHOICES].findIndex(c => c.value === i) === -1) {
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
