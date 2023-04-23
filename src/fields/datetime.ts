import * as moment from 'moment';
import { unitOfTime } from 'moment';
import { Field, simple } from '../field';

export type DatetimeKeys = 'date' | '~date' | '!date' | '?date';

function fmt(date: Date) {
  return moment(date).format('YYYY-MM-DD');
}

/**
 * 日期类型 - 默认返回全部日期+时间，可以使用 startOf 控制输出
 */
export class Datetime<T extends DatetimeKeys> extends Field<T> {
  protected _of?: unitOfTime.StartOf;

  /**
   * 设置保留的精度
   */
  of(unitOfTime: unitOfTime.StartOf) {
    this._of = unitOfTime;
    return this;
  }

  extra() {
    return {
      of: this._of,
    };
  }

  protected _clean(data: any) {
    if (!data) {
      if (this._required) {
        this.fail('form.required');
      }
      return;
    }
    const m = moment(data);
    if (!m.isValid()) {
      this.fail('form.datetime.format-error', { data });
    }
    return m;
  }

  clean(data: any) {
    const m = this._clean(data);
    if (m) {
      if (this._of) {
        return m.startOf(this._of).toDate();
      }
      return m.toDate();
    }
    return m;
  }
}

/**
 * 日期类型 - 只保留 年月日
 */
export class _Date<T extends DatetimeKeys> extends Datetime<T> {
  override _of: unitOfTime.StartOf = 'day';
  override option = {
    type: 'Date',
  };
}

export class DateRange<T extends DatetimeKeys> extends Field<`${T}[]`> {
  protected _of?: unitOfTime.StartOf;
  private _start?: Date;
  private _end?: Date;

  /**
   * 设置保留精度
   */
  of(unitOfTime: unitOfTime.StartOf) {
    this._of = unitOfTime;
    return this;
  }

  /**
   * 设置开始日期，如果不设置则不限制
   */
  start(date: Date) {
    this._start = date;
    return this;
  }

  /**
   * 设置结束日期，如果不设置则不限制
   */
  end(date: Date) {
    this._end = date;
    return this;
  }

  extra() {
    return {
      of: this._of,
      start: this._start,
      end: this._end,
    };
  }

  protected _clean(data: any) {
    if (!data) {
      if (this._required) {
        this.fail('form.required');
      }
      return;
    }
    let m = moment(data);
    if (!m.isValid()) {
      this.fail('form.datetime.format-error', { data });
    }
    if (this._of) {
      m = m.startOf(this._of);
    }
    return m;
  }

  clean(data: any) {
    const dataS = this._clean(data && data[0]);
    if (dataS) {
      if (this._start && moment(dataS).isBefore(this._start)) {
        this.fail('form.daterange.start.before', { start: fmt(this._start) });
      }
      if (this._end && moment(dataS).isAfter(this._end)) {
        this.fail('form.daterange.start.after', { end: fmt(this._end) });
      }
    }
    const dataE = this._clean(data && data[1]);
    if (dataE) {
      if (this._start && moment(dataE).isBefore(this._start)) {
        this.fail('form.daterange.end.before', { start: fmt(this._start) });
      }
      if (this._end && moment(dataE).isAfter(this._end)) {
        this.fail('form.daterange.end.after', { end: fmt(this._end) });
      }
      if (dataS && moment(dataE).isBefore(dataS)) {
        this.fail('form.daterange.end.lt-start');
      }
    }
    if (dataS || dataE) {
      return [dataS?.toDate(), dataE?.toDate()];
    }
  }
}

export class Time<T extends 'string' | '!string' | '?string' | '~string'> extends Field<T> {
  protected _format: string = 'HH:mm:ss';

  format(fmt: string) {
    this._format = fmt;
    return this;
  }

  clean(data: any) {
    if (!data) {
      if (this._required) {
        this.fail('form.required');
      }
      return;
    }
    let m = moment(data, this._format);
    if (!m.isValid()) {
      this.fail('form.datetime.format-error', { data });
    }
    return m.format(this._format);
  }
}

export const datetime = simple(Datetime);
export const date = simple(_Date);
export const dateRange = simple(DateRange);
export const time = simple(Time);
