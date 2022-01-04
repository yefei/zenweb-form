import { Input, simple } from './input';

interface ChoiceType {
  /**
   * 显示名
   */
  label: number | string;

  /**
   * 值，如果不指定则无法选择
   */
  value?: number | string;

  /**
   * 父项值
   */
  parent?: number | string;
}

export class Cascader extends Input {
  private _choices: ChoiceType[] = [];
  private _max: number;
  private _min: number;

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
  choicesMap(choices: any[], valueKey: string, labelKey: string, parentKey: string) {
    /*
    // 处理一维结构为树形结构
    function each(parentValue: string = null): ChoiceType[] {
      return choices.filter(i => i[parentKey] === parentValue).map(i => {
        const item: ChoiceType = {
          value: i[valueKey],
          label: i[labelKey],
        };
        const children = each(i[valueKey]);
        if (children.length) {
          item.children = children;
        }
        return item;
      });
    }
    return this.choices(each());
    */
    return this.choices(choices.map(i => ({value: i[valueKey], label: i[labelKey], parent: i[parentKey]})));
  }

  attr() {
    return {
      choices: this._choices,
    };
  }

  clean(data: any) {
    data = Array.isArray(data) ? data : [data];
    const max = Math.min(this._max || Number.MAX_VALUE, this._choices.length);
    if (data.length > max) {
      this.fail('select.choice-max', { max });
    }
    if (this._min && data.length < this._min) {
      this.fail('select.choice-min', { min: this._min });
    }
    for (const i of data) {
      if (this._choices.findIndex(c => c.value === i) === -1) {
        this.fail('select.choice-invalid', { data: i });
      }
    }
    return data;
  }
}

export const cascader = simple(Cascader);
