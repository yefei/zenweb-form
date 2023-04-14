import { CastOption, ObjectKeys, TypeKeys, ValidateOption } from 'typecasts';
import { Widget } from './widgets/widget';

/**
 * 定义字段
 */
export type FormFields = { [name: string]: FieldOption | TypeKeys };

/**
 * 初始化完成的字段
 * - 对象嵌套类型初始化成一维平面
 */
export type PlainFormFields = {
  [name: string]: {
    cast: CastOption,
    option: WidgetOption,
    widget?: Widget,
  }
};

/**
 * 表单布局信息
 */
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
  valueType?: TypeKeys | ObjectKeys;

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
 * 字段控件结果
 */
export type WidgetsResult = { [name: string]: WidgetResult };

/**
 * 字段错误消息
 */
export type ErrorMessages = { [field: string]: string | number };

/**
 * 表单结果
 */
export interface FormResult {
  /**
   * 字段结果
   * - key 为字段名
   */
  fields: WidgetsResult;

  /**
   * 字段布局
   */
  layout: FormLayout[];
}
