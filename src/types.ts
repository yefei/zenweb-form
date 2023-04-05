import { CastOption, GetPickReturnType, TypeKeys, ValidateOption } from 'typecasts';
import { Form } from './form';
import { Widget } from './widgets/widget';

export type FormFields = { [name: string]: FieldOption };
export type FormLayout = string | FormLayout[];

/**
 * 表单控件选项
 */
export interface WidgetOption {
  /**
   * 控件类型
   * @default 'text'
   */
  type?: string;

  /**
   * 显示标签
   */
  label?: string;

  /**
   * 提示信息
   */
  placeholder?: string;

  /**
   * 帮助信息
   */
  help?: string;

  /**
   * 只读字段，不可修改值
   */
  readonly?: boolean;
}

/**
 * 表单控件结果
 */
export interface WidgetResult extends WidgetOption {
  /**
   * 值类型
   */
  valueType?: TypeKeys;

  /**
   * 默认值
   */
  default?: any;

  /**
   * 值验证器
   */
  validate?: ValidateOption;

  /**
   * 必填项
   */
  required?: boolean;
}

export interface FieldOption extends CastOption {
  /**
   * 表单控件
   * - 不设置则默认使用 Text
   */
  widget?: Widget | WidgetOption;
}

/**
 * 表单字段项数据清理
 */
export type FormFieldCleans<O extends FormFields> = {
  [K in keyof O]?: (this: Form<O>, data: GetPickReturnType<O, K>)
    => GetPickReturnType<O, K> | Promise<GetPickReturnType<O, K>>;
};
