'use strict';

const OPTIONS = Symbol('widget#options');

class WidgetFail extends Error {
  constructor(code, params) {
    super(code);
    this.name = 'WidgetFail';
    this.code = code;
    this.params = params;
  }
}

class Widget {
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
    const widget = await this.attr();
    return Object.assign({}, this[OPTIONS], {
      widget,
    });
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
    throw new WidgetFail(code, params);
  }
}

module.exports = {
  Widget,
  WidgetFail,
};
