import { MessageCodeResolver } from '@zenweb/messagecode';
import { RequiredError, typeCast, ValidateError } from 'typecasts';
import { Input, InputFail } from './field/input';
import { Fields, FormData, FieldOption, Layout, FormInit } from './types';

function layoutExists(layout: Layout[], name: string): boolean {
  for (const i of layout) {
    if (i === name) return true;
    if (Array.isArray(i)) return layoutExists(i, name);
  }
  return false;
}

class NonMessageCodeResolver {
  format(code: string, params?: any) {
    return code;
  }
}

export class Form {
  private _fields: Fields = {};
  private _data: FormData = {};
  private _errors: { [field: string]: any } = {};
  private _initial: FormData;
  private _layout: Layout[];
  private _defaultOption: FieldOption;

  constructor(defaultOption?: FieldOption) {
    this._defaultOption = defaultOption || {
      type: 'any',
      required: true,
    };
  }

  init(init: FormInit, data: FormData) {
    this._initial = init.initial;
    this._layout = init.layout || [];
    for (const [ name, option ] of Object.entries(init.fields)) {
      if (!layoutExists(this._layout, name)) {
        this._layout.push(name);
      }
      const opt = Object.assign({}, this._defaultOption, option instanceof Input ? option.build() : option);
      if (init.initial && init.initial[name] !== undefined) {
        opt.default = init.initial[name];
      }
      this._fields[name] = opt;
      if (data) {
        try {
          // 尝试获取输入数据，先key匹配，如果没有尝试key列表匹配
          const _inputData = name in data ? data[name] : (`${name}[]` in data ? data[`${name}[]`] : undefined);
          let value = typeCast(_inputData, opt, name);
          if (value !== undefined) {
            if (option instanceof Input) {
              value = option.clean(value);
            }
            this._data[name] = value;
          }
        } catch (e) {
          this._errors[name] = e;
        }
      }
    }
    return this;
  }

  get fields() {
    return this._fields;
  }

  get initial() {
    return this._initial;
  }

  get valid() {
    return Object.keys(this._errors).length === 0;
  }

  get errors() {
    return this._errors;
  }

  errorMessages(messageCodeResolver?: MessageCodeResolver | NonMessageCodeResolver) {
    messageCodeResolver = messageCodeResolver || new NonMessageCodeResolver();
    const messages: { [field: string]: string } = {};
    Object.entries(this.errors).map(([field, e]) => {
      if (e instanceof RequiredError) {
        messages[field] = messageCodeResolver.format(`form.required-error.${field}`, {});
      }
      else if (e instanceof ValidateError) {
        let code = e.validate;
        if (e.validate === 'cast') code += `.${typeof e.target === 'function' ? e.target.name || '-' : e.target}`;
        messages[field] = messageCodeResolver.format(`form.validate-error.${code}.${field}`, e);
      }
      else if (e instanceof InputFail) {
        messages[field] = messageCodeResolver.format(`form.input-fail.${e.code}.${field}`, e.params);
      }
      else {
        messages[field] = e.message;
      }
    });
    return messages;
  }

  get data() {
    return this._data;
  }

  get layout() {
    return this._layout;
  }
}
