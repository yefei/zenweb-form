import { Input } from './input.js';

const ROWS = Symbol('Textarea#rows');

export class Text extends Input {
  length(minLength, maxLength) {
    this.validate({ minLength, maxLength });
    return this;
  }
}

export class Textarea extends Text {
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
