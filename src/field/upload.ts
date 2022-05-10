import { Input, simple } from './input';

export class Upload extends Input {
  protected _action: string;
  protected _limit: number;

  /**
   * 上传地址
   */
  action(url: string) {
    this._action = url;
    return this;
  }

  /**
   * 上传数量限制
   */
  limit(limit: number) {
    this._limit = limit;
    return this;
  }

  attrs() {
    this.type('trim[]');
    return {
      action: this._action,
      limit: this._limit || 1,
    };
  }
}

export const upload = simple(Upload);
