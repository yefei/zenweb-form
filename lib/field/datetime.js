import moment from 'moment';
import { Input } from './input.js';

const FORMAT = Symbol('Date#format');

function datetimeFormatFunction(fmt) {
  return function datetimeFormat(data) {
    const m = moment(data, fmt);
    if (m.isValid()) {
      return m.format(fmt);
    }
  };
}

export class Datetime extends Input {
  format(fmt) {
    this[FORMAT] = fmt;
    return this;
  }

  get _format() {
    return this[FORMAT] || 'YYYY-MM-DD HH:mm:ss';
  }

  async attr() {
    this.type(datetimeFormatFunction(this._format));
    return {
      format: this._format,
    };
  }
}

export class Date extends Datetime {
  get _format() {
    return this[FORMAT] || 'YYYY-MM-DD';
  }
}

export class Time extends Datetime {
  get _format() {
    return this[FORMAT] || 'HH:mm:ss';
  }
}
