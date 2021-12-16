const OPTIONS = Symbol('Input#options');
const NAME = Symbol('Input#name');

export class InputFail extends Error {
  constructor(code, params) {
    super(code);
    this.name = 'InputFail';
    this.code = code;
    this.params = params;
  }
}

export class Input {
  constructor(label) {
    this[OPTIONS] = {
      label,
    };
  }

  get options() {
    return this[OPTIONS];
  }

  get _name() {
    return this[NAME] || this.constructor.name;
  }

  name(name) {
    this[NAME] = name;
    return this;
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

  default(value) {
    this[OPTIONS].default = value;
    return this;
  }

  validate(validate) {
    this[OPTIONS].validate = validate;
    return this;
  }

  /**
   * 构建表单项整体参数
   */
  build() {
    const attr = this.attr();
    return Object.assign({
      name: this._name,
    }, this[OPTIONS], attr);
  }

  /**
   * 构建表单组件参数
   */
  attr() {
  }

  /**
   * 组件验证，如果验证不通过需要抛出异常，使用 this.fail('code')
   * @param {*} data 
   */
  postValidate(data) {
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
