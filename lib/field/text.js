'use strict';

const { Input } = require('./input');
const ROWS = Symbol('Textarea#rows');

class Text extends Input {
  length(minLength, maxLength) {
    this.validate({ minLength, maxLength });
    return this;
  }
}

class Textarea extends Text {
  rows(min, max) {
    this[ROWS] = { min, max };
    return this;
  }

  attr() {
    return {
      rows: this[ROWS] || 'auto',
    };
  }
}

module.exports = { Text, Textarea };
