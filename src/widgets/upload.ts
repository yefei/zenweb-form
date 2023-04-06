import { Widget, simple } from './widget';

class UploadBase extends Widget {
  protected _minFiles = 1;
  protected _maxFiles = 1;
  protected _minSize = 1;
  protected _maxSize?: number;
  protected _totalMaxSize?: number;
  protected _accept?: string;

  /**
   * 最多上传数量
   */
  maxFiles(limit: number) {
    this._maxFiles = limit;
    return this;
  }

  /**
   * 最少上传数量
   */
  minFiles(limit: number) {
    this._minFiles = limit;
    return this;
  }

  /**
   * 文件尺寸限制
   */
  minSize(limit: number) {
    this._minSize = limit;
    return this;
  }

  /**
   * 文件尺寸限制
   */
  maxSize(limit: number) {
    this._maxSize = limit;
    return this;
  }

  /**
   * 全部文件尺寸限制
   */
  totalMaxSize(limit: number) {
    this._totalMaxSize = limit;
    return this;
  }

  /**
   * 接受的文件类型
   * - 例如: '.doc,.docx,application/msword'
   */
  accept(types: string) {
    this._accept = types;
    return this;
  }

  extra() {
    return {
      minFiles: this._minFiles,
      maxFiles: this._maxFiles,
      minSize: this._minSize,
      maxSize: this._maxSize,
      totalMaxSize: this._totalMaxSize,
      accept: this._accept,
    };
  }
}

/**
 * 本地上传
 */
export class LocalUpload extends UploadBase {

}

/**
 * 远程上传组建
 */
export class RemoteUpload extends UploadBase {
  protected _to?: string;

  /**
   * 上传到地址
   */
  to(url: string) {
    this._to = url;
    return this;
  }

  extra() {
    return Object.assign(super.extra(), {
      to: this._to,
    });
  }
}

export const localUpload = simple(LocalUpload);
export const remoteUpload = simple(RemoteUpload);
