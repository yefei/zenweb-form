import * as moment from 'moment';
import { Input, simple } from './input';

function datetimeFormatFunction(fmt: string) {
  return function datetimeFormat(data: moment.MomentInput) {
    const m = moment(data, fmt);
    if (m.isValid()) {
      return m.format(fmt);
    }
  };
}

export class Datetime extends Input {
  protected _format: string = 'YYYY-MM-DD HH:mm:ss';

  /**
   * 输入日期格式
   */
  format(fmt: string) {
    this._format = fmt;
    return this;
  }

  override attr() {
    this.type(datetimeFormatFunction(this._format));
    return {
      format: this._format,
    };
  }
}

export class Date extends Datetime {
  protected _format: string = 'YYYY-MM-DD';
}

export class DateRange extends Date {
  private _start: string;
  private _end: string;

  /**
   * 设置开始日期，如果不设置则不限制
   */
  start(date: string) {
    this._start = date;
    return this;
  }

  /**
   * 设置结束日期，如果不设置则不限制
   */
  end(date: string) {
    this._end = date;
    return this;
  }

  override attr() {
    this.type('trim[]');
    return {
      format: this._format,
      start: this._start,
      end: this._end,
    };
  }

  override clean(data: [string, string]) {
    const formatFunc = datetimeFormatFunction(this._format);
    const startDate = formatFunc(data[0]);
    if (!startDate) {
      this.fail('daterange.start.error');
    }
    const endDate = formatFunc(data[1]);
    if (!endDate) {
      this.fail('daterange.end.error');
    }
    if (this._start && moment(startDate).isBefore(this._start)) {
      this.fail('daterange.start.out');
    }
    if (this._end && moment(endDate).isAfter(this._end)) {
      this.fail('daterange.end.out');
    }
    return [startDate, endDate];
  }
}

export class Time extends Datetime {
  protected _format: string = 'HH:mm:ss';
}

export const datetime = simple(Datetime);
export const date = simple(Date);
export const dateRange = simple(DateRange);
export const time = simple(Time);
