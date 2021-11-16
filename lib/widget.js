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
    return Object.assign({}, this[OPTIONS], {
      widget: await this.attr(),
    });
  }

  /**
   * 构建表单组件参数
   */
  async attr() {
    return {
      type: 'input',
    };
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

const SELECT_CHOICES = Symbol('Select#choices');

class Select extends Widget {
  /**
   * @param {[value: any, label: string][]} choices
   */
  choices(choices) {
    this[SELECT_CHOICES] = choices;
    return this;
  }

  choicesMap(choices, labelKey, valueKey) {
    return this.choices(choices.map(i => [i[valueKey], i[labelKey]]));
  }

  async attr() {
    return {
      type: 'select',
      choices: this[SELECT_CHOICES],
    };
  }

  async postValidate(data) {
    if (!this[SELECT_CHOICES] || this[SELECT_CHOICES].length === 0) {
      this.fail('select.options.empty');
    }
    if (this[SELECT_CHOICES].findIndex(i => i[0] === data) > -1) {
      return;
    }
    this.fail('select.choice-invalid');
  }
}

const widgets = {
  Widget,
  Select,
};

for (const [name, clazz] of Object.entries(widgets)) {
  widgets[name.charAt(0).toLowerCase() + name.slice(1)] = function (options) {
    return new clazz(options);
  };
}

module.exports = Object.assign({ WidgetFail }, widgets);
