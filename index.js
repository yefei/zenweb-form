'use strict';

const { typeCastAs } = require('typecasts');

const FIELDS = Symbol('zenweb-form#fields');
const DATA = Symbol('zenweb-form#data');
const INITIAL = Symbol('zenweb-form#initial');
const ERRORS = Symbol('zenweb-form#errors');

class Form {
  constructor(fileds, data, initial) {
    for (const [ name, option ] of Object.entries(fileds)) {
      if (option.defaultValue === undefined) {
        option.required = true;
      }
      if (data) {
        this[DATA] = {};
        this[ERRORS] = {};
        try {
          const [ as, value ] = typeCastAs(data[name], option, name);
          if (value !== undefined) this[DATA][as] = value;
        } catch (e) {
          this[ERRORS][name] = e;
        }
      }
    }
    this[FIELDS] = fileds;
    this[INITIAL] = initial;
  }

  get fields() {
    return this[FIELDS];
  }

  get valid() {
    return !this[ERRORS];
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
    const form = new Form(controller.fields, undefined,
      controller.initial ? await controller.initial(ctx) : undefined);
    if (controller.get) {
      return controller.get(ctx, form);
    }
    const out = { form: form.fields };
    if (ctx.success) {
      return ctx.success(out);
    }
    ctx.body = out;
  });

  this.router.post(path, ...controller.middleware || [], async ctx => {
    const form = new Form(controller.fields, ctx.request.body);
    if (form.valid) {
      return controller.post(ctx, form);
    }
    if (controller.fail) {
      return controller.fail(ctx, form);
    }
    const out = { form: form.errors };
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
