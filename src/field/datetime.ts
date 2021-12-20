import * as moment from 'moment';
import { Input, simple } from './input';

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

export const datetime = simple(Datetime);
export const date = simple(Date);
export const time = simple(Time);
