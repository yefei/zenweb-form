import * as moment from 'moment';
import { Widget, simple } from './widget';

function datetimeFormat(fmt: string, data: moment.MomentInput) {
  const m = moment(data, fmt);
  if (m.isValid()) {
    return m.format(fmt);
  }
}

export class Datetime extends Widget {
  protected _format: string = 'YYYY-MM-DD HH:mm:ss';

  /**
   * 输入日期格式
   */
  format(fmt: string) {
    this._format = fmt;
    return this;
  }

  extra() {
    return {
      format: this._format,
    };
  }

  clean(data: any) {
    const val = datetimeFormat(this._format, data);
    if (val === undefined) {
      this.fail('form.datetime.format-error', { data, format: this._format });
    }
    return val;
  }
}

export class Date extends Datetime {
  protected _format: string = 'YYYY-MM-DD';
}

export class DateRange extends Date {
  private _start?: string;
  private _end?: string;

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

  extra() {
    return {
      format: this._format,
      start: this._start,
      end: this._end,
    };
  }

  clean(data: [string, string]) {
    const startDate = datetimeFormat(this._format, data[0]);
    if (!startDate) {
      this.fail('form.daterange.start.error');
    }
    const endDate = datetimeFormat(this._format, data[1]);
    if (!endDate) {
      this.fail('form.daterange.end.error');
    }
    if (this._start && moment(startDate).isBefore(this._start)) {
      this.fail('form.daterange.start.out');
    }
    if (this._end && moment(endDate).isAfter(this._end)) {
      this.fail('form.daterange.end.out');
    }
    return [startDate, endDate] as any;
  }
}

export class Time extends Datetime {
  protected _format: string = 'HH:mm:ss';
}

export const datetime = simple(Datetime);
export const date = simple(Date);
export const dateRange = simple(DateRange);
export const time = simple(Time);
