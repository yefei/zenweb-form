import { Input, simple } from './input';

export class Text extends Input {
  /**
   * 限制字符串长度
   * @param minLength 最小长度，默认 0
   * @param maxLength 最大长度，默认不限制
   */
  length(minLength: number = 0, maxLength?: number) {
    this.validate({ minLength, maxLength });
    return this;
  }
}

export class Textarea extends Text {
  protected _rows: { min: number, max: number };
  
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

  attr() {
    return {
      rows: this._rows || 'auto',
    };
  }
}

export const text = simple(Text);
export const textarea = simple(Textarea);
