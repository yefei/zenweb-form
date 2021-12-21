import { Input, simple } from './input';

const ACTION = Symbol('Upload#action');
const LIMIT = Symbol('Upload#limit');

export class Upload extends Input {
  [ACTION]: string;
  [LIMIT]: number;

  /**
   * 上传地址
   */
  action(url: string) {
    this[ACTION] = url;
    return this;
  }

  /**
   * 上传数量限制
   */
  limit(limit: number) {
    this[LIMIT] = limit;
    return this;
  }

  attr() {
    this.type('trim[]');
    return {
      action: this[ACTION],
      limit: this[LIMIT] || 1,
    };
  }
}

export const upload = simple(Upload);
