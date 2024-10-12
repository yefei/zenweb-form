import { TypeKeys } from 'typecasts';
import { Field, simple } from '../field.js';

export class Text<T extends TypeKeys> extends Field<T> {
  /**
   * 最大字符串长度
   */
  maxLength(maxLength: number) {
    this.validate({ maxLength });
    return this;
  }

  /**
   * 最小字符串长度
   */
  minLength(minLength: number) {
    this.validate({ minLength });
    return this;
  }
}

export class Textarea<T extends TypeKeys> extends Text<T> {
  protected _rows?: { min: number, max: number };

  /**
   * 文本输入域尺寸，注意：并不是限制文本输入长度
   * @param min 最小行数高度
   * @param max 最大行数高度，如果输入行数超出则显示滚动条
   * @returns 
   */
  rows(min: number, max: number) {
    this._rows = { min, max };
    return this;
  }

  extra() {
    return {
      rows: this._rows,
    };
  }
}

export const text = simple(Text);
export const textarea = simple(Textarea);
