'use strict';

const typecasts = require('typecasts');
const CORE = Symbol('zenweb-form#core');
const FIELDS = Symbol('zenweb-form#fields');
const DATA = Symbol('zenweb-form#data');
const ERRORS = Symbol('zenweb-form#errors');
const INITIAL = Symbol('zenweb-form#initial');

class Form {
  constructor(core, fileds, data, initial) {
    this[CORE] = core;
    this[FIELDS] = {};
    this[DATA] = {};
    this[ERRORS] = {};
    this[INITIAL] = initial;
    for (const [ name, option ] of Object.entries(fileds)) {
      const opt = Object.assign({}, option);
      if (opt.required === undefined) {
        opt.required = true;
      }
      if (initial && initial[name] !== undefined) {
        opt.defaultValue = initial[name];
      }
      this[FIELDS][name] = opt;
      if (data) {
        try {
          const [ as, value ] = typecasts.typeCastAs(data[name], opt, name);
          if (value !== undefined) this[DATA][as] = value;
        } catch (e) {
          this[ERRORS][name] = e;
        }
      }
    }
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
    Object.entries(this.errors).map(([filed, e]) => {
      if (e instanceof typecasts.RequiredError) {
        messages[filed] = this[CORE].messageCodeResolver.format(`form.required-error.${e.filed}`);
      }
      else if (e instanceof typecasts.ValidateError) {
        messages[filed] = this[CORE].messageCodeResolver.format(`form.validate-error.${e.validate}.${e.field}`, e);
      }
      else {
        messages[filed] = e.message;
      }
    });
    return messages;
  }

  get data() {
    return this[DATA];
  }
}

/**
 * @param {string | RegExp | (string | RegExp)[]} path 
 * @param {import('.').FormController} controller 
 */
function formRouter(path, controller) {
  this.router.get(path, ...controller.middleware || [], async ctx => {
    const initial = controller.initial ? await controller.initial(ctx) : undefined;
    const form = new Form(this, controller.fields, undefined, initial);
    if (controller.get) {
      return controller.get(ctx, form);
    }
    const out = { fields: form.fields };
    if (ctx.success) {
      return ctx.success(out);
    }
    ctx.body = out;
  });

  this.router.post(path, ...controller.middleware || [], async ctx => {
    const initial = controller.initial ? await controller.initial(ctx) : undefined;
    const form = new Form(this, controller.fields, ctx.request.body, initial);
    if (form.valid) {
      return controller.post(ctx, form);
    }
    if (controller.fail) {
      return controller.fail(ctx, form);
    }
    const out = { errors: form.errorMessages };
    if (ctx.fail) {
      return ctx.fail({ message: 'form valid error', data: out });
    }
    ctx.body = out;
    ctx.status = 422;
  });
}

/**
 * 安装
 * @param {import('@zenweb/core').Core} core
 */
function setup(core) {
  core.check('@zenweb/router');
  core.check('@zenweb/body');
  core.check('@zenweb/messagecode');
  Object.defineProperty(core, 'formRouter', { value: formRouter });
}

module.exports = {
  setup,
};
