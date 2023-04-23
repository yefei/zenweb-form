import { CastAndListReturns, CastAndListKeys, ValidateOption } from "typecasts";
import { Widget } from "./widgets";
import { FieldOption, WidgetOption } from "./types";

export const GET_FIELD_OPTION = Symbol('TypeField#getFieldOption');

/**
 * 取得 `Field` 的值类型
 */
export type GetFieldType<T> = T extends Field<infer _, infer R> ? R : never;

/**
 * 使用链式编程生成带有类型标注的字段
 */
export class Field<
  T extends CastAndListKeys,
  R = NonNullable<CastAndListReturns[T]>,
> {
  protected _optional = false;
  protected _nullable = false;
  protected _default?: R;
  protected _validate?: ValidateOption;

  protected _splitter?: string;
  protected _maxItems?: number;
  protected _minItems?: number;

  protected _widget?: Widget | WidgetOption | string;

  constructor(protected _valueType: T) {}

  /**
   * 可选项，允许不传值
   */
  optional(): Field<T, R | undefined> {
    this._optional = true;
    return this;
  }

  /**
   * 允许 `null` 值
   */
  nullable(): Field<T, R | null> {
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
      type: <CastAndListKeys> type,
      default: this._default,
      validate: this._validate,
      field: fieldName,
      splitter: this._splitter,
      maxItems: this._maxItems,
      minItems: this._minItems,
      widget: this._widget,
    };
  }
}
