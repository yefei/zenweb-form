'use strict';

const OPTIONS = Symbol('Input#options');

class InputFail extends Error {
  constructor(code, params) {
    super(code);
    this.name = 'InputFail';
    this.code = code;
    this.params = params;
  }
}

class Input {
  constructor(label) {
    this[OPTIONS] = {
      label,
    };
  }

  get options() {
    return this[OPTIONS];
  }

  type(type) {
    this[OPTIONS].type = type;
    return this;
  }

  help(help) {
    this[OPTIONS].help = help;
    return this;
  }

  required(is) {
    this[OPTIONS].required = is;
    return this;
  }

  validate(validate) {
    this[OPTIONS].validate = validate;
    return this;
  }

  /**
   * 构建表单项整体参数
   */
  async build() {
    const attr = await this.attr();
    return Object.assign({
      widget: this.constructor.name,
    }, this[OPTIONS], attr);
  }

  /**
   * 构建表单组件参数
   */
  async attr() {
  }

  /**
   * 组件验证，如果验证不通过需要抛出异常，使用 this.fail('code')
   * @param {*} data 
   */
  async postValidate(data) {
  }

  /**
   * 验证失败
   * @param {string} code 
   * @param {*} [params]
   */
  fail(code, params) {
    throw new InputFail(code, params);
  }
}

module.exports = {
  Input,
  InputFail,
};
