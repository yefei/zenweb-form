'use strict';

const { Input } = require('./input');

class Date extends Input {
  async attr() {
    !this.options.type && this.type('date');
  }

  async postValidate(data) {
  }
}

module.exports = { Date };
