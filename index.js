'use strict';

const typecasts = require('typecasts');
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
  constructor(core, fileds, data, initial, layout) {
    this[CORE] = core;
    this[FIELDS] = {};
    this[DATA] = {};
    this[ERRORS] = {};
    this[INITIAL] = initial;
    this[LAYOUT] = layout || [];
    for (const [ name, option ] of Object.entries(fileds)) {
      if (!layoutExists(this[LAYOUT], name)) {
        this[LAYOUT].push(name);
      }
      const opt = Object.assign({}, option);
      if (opt.required === undefined) {
        opt.required = true;
      }
      if (initial && initial[name] !== undefined) {
        opt.default = initial[name];
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

  get layout() {
    return this[LAYOUT];
  }
}

/**
 * @param {import('@zenweb/core').Core} core 
 * @param {import('.').FormController} controller 
 * @param {import('koa').Context} ctx 
 * @returns 
 */
async function formInit(core, controller, ctx, data) {
  const fields = typeof controller.fields === 'function' ? await controller.fields(ctx) : controller.fields;
  const initial = controller.initial ? await controller.initial(ctx) : undefined;
  const form = new Form(core, fields, data, initial, controller.layout);
  return form;
}

/**
 * @param {string | RegExp | (string | RegExp)[]} path 
 * @param {import('.').FormController} controller 
 */
function formRouter(path, controller) {
  this.router.get(path, ...controller.middleware || [], async ctx => {
    const form = await formInit(this, controller, ctx);
    if (controller.get) {
      return controller.get(ctx, form);
    }
    const out = { fields: form.fields, layout: form.layout };
    if (ctx.success) {
      return ctx.success(out);
    }
    ctx.body = out;
  });

  this.router.post(path, ...controller.middleware || [], async ctx => {
    const form = await formInit(this, controller, ctx, ctx.request.body);
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
