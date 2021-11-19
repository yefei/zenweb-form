'use strict';

const { Input } = require('./input');
const ACTION = Symbol('Upload#action');
const LIMIT = Symbol('Upload#limit');

class Upload extends Input {
  action(url) {
    this[ACTION] = url;
    return this;
  }

  limit(limit) {
    this[LIMIT] = limit;
    return this;
  }

  attr() {
    this.type('trim[]');
    return {
      action: this[ACTION],
      limit: this[LIMIT] || 1,
    };
  }
}

module.exports = { Upload };
