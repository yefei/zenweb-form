'use strict';

const typecasts = require('typecasts');
const FIELDS = Symbol('zenweb-form#fields');
const DATA = Symbol('zenweb-form#data');
const ERRORS = Symbol('zenweb-form#errors');
const INITIAL = Symbol('zenweb-form#initial');

class Form {
  constructor(fileds, data, initial) {
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
    const form = new Form(controller.fields, undefined, initial);
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
    const form = new Form(controller.fields, ctx.request.body, initial);
    if (form.valid) {
      return controller.post(ctx, form);
    }
    if (controller.fail) {
      return controller.fail(ctx, form);
    }
    const out = { errors: form.errors };
    if (ctx.fail) {
      return ctx.fail(out);
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
  Object.defineProperty(core, 'formRouter', { value: formRouter });
}

module.exports = {
  setup,
};
