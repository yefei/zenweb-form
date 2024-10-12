import { TypeKeys, ValidateOption } from 'typecasts';
import { Field } from './field.js';

/**
 * 取得 `Field` 的值类型
 */
export type GetFieldType<T> = T extends Field<infer _, infer R> ? R : never;

/**
 * 定义字段
 */
export type FormFields = { [name: string]: Field<any> };

/**
 * 默认的字段数据结构
 */
export type FormData = { [name: string]: unknown };

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
export interface FieldResult extends WidgetOption {
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

  /**
   * 是否允许 null 值
   */
  nullable?: boolean;
}

/**
 * 字段控件结果
 */
export type FieldsResult = { [name: string]: FieldResult };

/**
 * 字段错误消息
 */
export type ErrorMessages = { [field: string]: string | undefined };

/**
 * 表单结果
 */
export interface FormResult {
  /**
   * 字段结果
   * - key 为字段名
   */
  fields: FieldsResult;

  /**
   * 字段布局
   */
  layout: FormLayout[];
}
