import { MessageCodeResolver } from '@zenweb/messagecode';
import * as typecasts from 'typecasts';
import { Input, InputFail } from './field/input';
import { Fields, FormData, FieldOption, Layout, FormInit } from './types';

const FIELDS = Symbol('zenweb-form#fields');
const DATA = Symbol('zenweb-form#data');
const ERRORS = Symbol('zenweb-form#errors');
const INITIAL = Symbol('zenweb-form#initial');
const LAYOUT = Symbol('zenweb-form#layout');

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
  private [FIELDS]: Fields = {};
  private [DATA]: FormData = {};
  private [ERRORS]: { [field: string]: any } = {};
  private [INITIAL]: FormData;
  private [LAYOUT]: Layout[];
  private _defaultOption: FieldOption;

  constructor(defaultOption?: FieldOption) {
    this._defaultOption = defaultOption || {
      required: true,
    };
  }

  init(init: FormInit, data: FormData) {
    this[INITIAL] = init.initial;
    this[LAYOUT] = init.layout || [];
    for (const [ name, option ] of Object.entries(init.fields)) {
      if (!layoutExists(this[LAYOUT], name)) {
        this[LAYOUT].push(name);
      }
      const opt = Object.assign({}, this._defaultOption, option instanceof Input ? option.build() : option);
      if (init.initial && init.initial[name] !== undefined) {
        opt.default = init.initial[name];
      }
      this[FIELDS][name] = opt;
      if (data) {
        try {
          // 尝试获取输入数据，先key匹配，如果没有尝试key列表匹配
          const _inputData = name in data ? data[name] : (`${name}[]` in data ? data[`${name}[]`] : undefined);
          let [ as, value ] = typecasts.typeCastAs(_inputData, opt, name);
          if (value !== undefined) {
            if (option instanceof Input) {
              value = option.clean(value);
            }
            this[DATA][as] = value;
          }
        } catch (e) {
          this[ERRORS][name] = e;
        }
      }
    }
    return this;
  }

  get fields() {
    return this[FIELDS];
  }

  get initial() {
    return this[INITIAL];
  }

  get valid() {
    return Object.keys(this[ERRORS]).length === 0;
  }

  get errors() {
    return this[ERRORS];
  }

  errorMessages(messageCodeResolver?: MessageCodeResolver | NonMessageCodeResolver) {
    messageCodeResolver = messageCodeResolver || new NonMessageCodeResolver();
    const messages: { [field: string]: string } = {};
    Object.entries(this.errors).map(([field, e]) => {
      if (e instanceof typecasts.RequiredError) {
        messages[field] = messageCodeResolver.format(`form.required-error.${field}`, {});
      }
      else if (e instanceof typecasts.ValidateError) {
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
    return this[DATA];
  }

  get layout() {
    return this[LAYOUT];
  }
}
