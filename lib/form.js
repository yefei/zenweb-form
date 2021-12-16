'use strict';

const typecasts = require('typecasts');
const { Input, InputFail } = require('./field/input');
const CORE = Symbol('zenweb-form#core');
const FIELDS = Symbol('zenweb-form#fields');
const DATA = Symbol('zenweb-form#data');
const ERRORS = Symbol('zenweb-form#errors');
const INITIAL = Symbol('zenweb-form#initial');
const LAYOUT = Symbol('zenweb-form#layout');

function layoutExists(layout, name) {
  for (const i of layout) {
    if (i === name) return true;
    if (Array.isArray(i)) return layoutExists(i, name);
  }
  return false;
}

class Form {
  constructor(core) {
    this[CORE] = core;
    this[FIELDS] = {};
    this[DATA] = {};
    this[ERRORS] = {};
  }

  init(init, data) {
    this[INITIAL] = init.initial;
    this[LAYOUT] = init.layout || [];
    for (const [ name, option ] of Object.entries(init.fields)) {
      if (!layoutExists(this[LAYOUT], name)) {
        this[LAYOUT].push(name);
      }
      const opt = Object.assign({}, option instanceof Input ? option.build() : option);
      if (opt.required === undefined) {
        opt.required = true;
      }
      if (init.initial && init.initial[name] !== undefined) {
        opt.default = init.initial[name];
      }
      this[FIELDS][name] = opt;
      if (data) {
        try {
          const [ as, value ] = typecasts.typeCastAs(data[name], opt, name);
          if (value !== undefined) {
            if (option instanceof Input) {
              option.postValidate(value);
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

  get errorMessages() {
    const messages = {};
    Object.entries(this.errors).map(([field, e]) => {
      if (e instanceof typecasts.RequiredError) {
        messages[field] = this[CORE].messageCodeResolver.format(`form.required-error.${field}`);
      }
      else if (e instanceof typecasts.ValidateError) {
        let code = e.validate;
        if (e.validate === 'cast') code += `.${typeof e.target === 'function' ? e.target.name || '-' : e.target}`;
        messages[field] = this[CORE].messageCodeResolver.format(`form.validate-error.${code}.${field}`, e);
      }
      else if (e instanceof InputFail) {
        messages[field] = this[CORE].messageCodeResolver.format(`form.input-fail.${e.code}.${field}`, e.params);
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

module.exports = {
  Form,
};
