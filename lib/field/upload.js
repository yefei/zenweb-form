import { Input } from './input.js';

const ACTION = Symbol('Upload#action');
const LIMIT = Symbol('Upload#limit');

export class Upload extends Input {
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
