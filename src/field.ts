import { ResultFail } from '@zenweb/result';
import { TypeKeys, TypeMap, ValidateOption, typeCast } from 'typecasts';
import { Widget } from './widget';
import { FieldResult, FormData } from './types';

export class FieldFail extends ResultFail {
  constructor(public mcode: string, extra?: any, data?: any) {
    super({
      message: mcode,
      extra,
      data,
    });
  }
}

/**
 * 使用链式编程生成带有类型标注的字段
 */
export class Field<T extends TypeKeys, R = TypeMap[T]> extends Widget {
  protected _validate?: ValidateOption;
  protected _splitter?: string;
  protected _maxItems?: number;
  protected _minItems?: number;
  protected _default?: R;

  /**
   * 是否为必填项
   */
  protected _required = this._valueType.startsWith('!');

  /**
   * 是否允许 null 值
   */
  protected _nullable = !this._valueType.startsWith('!') && !this._valueType.startsWith('?');

  constructor(protected readonly _valueType: T) {
    super();
  }

  /**
   * 设置默认值
   */
  default(value: R) {
    this._default = value;
    return this;
  }

  /**
   * 数据项验证
   */
  validate(opt: ValidateOption) {
    this._validate = Object.assign({}, this._validate, opt);
    return this;
  }

  /**
   * 设置列表分隔符
   * - 类型为列表时有效
   * - 如果原始数据为字符串时使用的切割符
   * @param sep 默认 `,`
   */
  splitter(sep: string) {
    this._splitter = sep;
    return this;
  }

  /**
   * 限制列表最大数量
   */
  maxItems(count: number) {
    this._maxItems = count;
    return this;
  }

  /**
   * 限制列表最小数量
   */
  minItems(count: number) {
    this._minItems = count;
    return this;
  }

  /**
   * 验证失败 - 抛出异常
   */
  protected fail(code: string, params?: any) {
    throw new FieldFail(code, params);
  }

  /**
   * 数据验证清理
   * - 在字段数据验证通过后调用
   * - 如果验证不通过需要抛出异常可以使用 `this.fail('code')`
   * - 需要返回清理完成的数据
   */
  clean(data: any): any {
    return typeCast(data, {
      type: this._valueType,
      default: this._default,
      validate: this._validate,
      splitter: this._splitter,
      maxItems: this._maxItems,
      minItems: this._minItems,
    });
  }

  output(formData?: FormData, fieldName?: string) {
    return Object.assign({}, super.output(), {
      required: this._required,
      nullable: this._nullable,
      valueType: this._valueType,
      // default: (this._data ? propertyAt(this._data, name.split(objectSpliter)) : null) || opt.cast.default,
      default: (formData && fieldName && fieldName in formData) ? formData[fieldName] : this._default,
      validate: this._validate,
    } as FieldResult);
  }
}

/**
 * 使用函数方式初始化字段类
 * @param clazz 字段类
 */
export function simple<T extends TypeKeys, F extends Field<T>>(clazz: { new (valueType: T): F }) {
  return (valueType: T) => {
    return new clazz(valueType);
  }
}
