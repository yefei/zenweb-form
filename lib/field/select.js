import { Input } from './input.js';

const SELECT_CHOICES = Symbol('Select#choices');

export class Select extends Input {
  /**
   * @param {{value: any, label: string}[]} choices
   */
  choices(choices) {
    this[SELECT_CHOICES] = choices;
    return this;
  }

  choicesMap(choices, valueKey, labelKey) {
    return this.choices(choices.map(i => ({value: i[valueKey], label: i[labelKey]})));
  }

  isEmpty() {
    return !this[SELECT_CHOICES] || this[SELECT_CHOICES].length === 0;
  }

  assertEmpty() {
    if (this.isEmpty()) {
      this.fail('select.options.empty');
    }
  }

  attr() {
    // 如果没有指定类型则自动判断第一个选项的值类型
    !this.isEmpty() && !this.options.type && this.type(typeof this[SELECT_CHOICES][0].value);
    return {
      choices: this[SELECT_CHOICES],
    };
  }

  postValidate(data) {
    this.assertEmpty();
    if (this[SELECT_CHOICES].findIndex(i => i.value === data) > -1) {
      return;
    }
    this.fail('select.choice-invalid', { data });
  }
}

export class Radio extends Select {}

const MULTIPLE_MAX = Symbol('Multiple#max');
const MULTIPLE_MIN = Symbol('Multiple#min');

export class Multiple extends Select {
  /** 最多可以选择数量 */
  max(v) {
    this[MULTIPLE_MAX] = v;
    return this;
  }

  /** 最少选择数量 */
  min(v) {
    this[MULTIPLE_MIN] = v;
    return this;
  }

  attr() {
    !this.isEmpty() && !this.options.type && this.type((typeof this[SELECT_CHOICES][0].value) + '[]');
    return Object.assign(super.attr(), {
      max: this[MULTIPLE_MAX],
      min: this[MULTIPLE_MIN],
    });
  }

  postValidate(data) {
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
  }
}

export class Checkbox extends Multiple {}
