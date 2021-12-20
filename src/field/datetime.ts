import * as moment from 'moment';
import { Input } from './input';

const FORMAT = Symbol('Date#format');

function datetimeFormatFunction(fmt: string) {
  return function datetimeFormat(data: moment.MomentInput) {
    const m = moment(data, fmt);
    if (m.isValid()) {
      return m.format(fmt);
    }
  };
}

export class Datetime extends Input {
  [FORMAT]: string;

  /**
   * 输入日期格式
   */
  format(fmt: string) {
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

export function datetime(label: string) {
  return new Datetime(label);
}

export class Date extends Datetime {
  get _format() {
    return this[FORMAT] || 'YYYY-MM-DD';
  }
}

export function date(label: string) {
  return new Date(label);
}

export class Time extends Datetime {
  get _format() {
    return this[FORMAT] || 'HH:mm:ss';
  }
}

export function time(label: string) {
  return new Time(label);
}
