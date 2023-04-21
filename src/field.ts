import { BasicReturns, CastKeys, TypeKeys, TypeMap, ValidateOption } from "typecasts";
import { Widget } from "./widgets";
import { FieldOption, WidgetOption } from "./types";

export const GET_FIELD_OPTION = Symbol('TypeField#getFieldOption');

/**
 * 取得 `TypeField` 的值类型
 */
export type GetFieldType<T> = T extends TypeField<infer _, infer R> ? R : never;

/**
 * 使用链式编程生成带有类型标注的字段
 */
export class TypeField<
  T extends CastKeys,
  R = NonNullable<BasicReturns[T]>,
> {
  protected _optional = false;
  protected _nullable = false;
  protected _default?: R;
  protected _validate?: ValidateOption;
  protected _widget?: Widget | WidgetOption | string;

  constructor(protected _valueType: T) {}

  /**
   * 可选项，允许不传值
   */
  optional(): TypeField<T, R | undefined> {
    this._optional = true;
    return this;
  }

  /**
   * 允许 `null` 值
   */
  nullable(): TypeField<T, R | null> {
    this._nullable = true;
    return this;
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
   * 设置表单控件
   * - 不指定则使用 Text
   * - 如指定 `string` 类型则表示 Text 字段的 label 名
   */
  widget(widget: Widget | WidgetOption | string) {
    this._widget = widget;
    return this;
  }

  /**
   * 内部安装使用
   */
  [GET_FIELD_OPTION](fieldName?: string): FieldOption {
    let type = this._valueType as string;
    if (!this._optional && !this._nullable) {
      type = '!' + type;
    } else if (!this._optional) {
      type = '~' + type;
    } else if (!this._nullable) {
      type = '?' + type;
    }
    return {
      type: <CastKeys> type,
      default: this._default,
      validate: this._validate,
      field: fieldName,
      widget: this._widget,
    };
  }
}

/**
 * 列表类型字段
 */
export class TypeListField<T extends CastKeys> extends TypeField<T, NonNullable<TypeMap[`${T}[]`]>> {
  protected _splitter?: string;
  protected _maxItems?: number;
  protected _minItems?: number;

  /**
   * 设置列表分隔符
   * - 类型为列表时有效
   * - 如果原始数据为字符串时使用的切割符
   * @param sep 默认 `,`
   */
  protected splitter(sep: string) {
    this._splitter = sep;
    return this;
  }

  /**
   * 限制列表最大数量
   */
  protected maxItems(count: number) {
    this._maxItems = count;
    return this;
  }

  /**
   * 限制列表最小数量
   */
  protected minItems(count: number) {
    this._minItems = count;
    return this;
  }

  [GET_FIELD_OPTION](fieldName?: string): FieldOption {
    const opt = super[GET_FIELD_OPTION](fieldName);
    return {
      ...opt,
      type: <TypeKeys> (opt.type + '[]'),
      splitter: this._splitter,
      maxItems: this._maxItems,
      minItems: this._minItems,
    };
  }
}
