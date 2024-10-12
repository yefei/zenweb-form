import dayjs from 'dayjs';
import { OpUnitType } from 'dayjs';
import { Field, simple } from '../field.js';

type StringKeys = 'string' | '!string' | '?string' | '~string';
export type DatetimeKeys = 'date' | '~date' | '!date' | '?date' | StringKeys;

/**
 * 日期类型 - 默认返回全部日期+时间，可以使用 startOf 控制输出
 */
export class Datetime<T extends DatetimeKeys> extends Field<T> {
  protected _of?: OpUnitType;

  /**
   * 设置保留的精度
   */
  of(unitOfTime: OpUnitType) {
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
    const m = dayjs(data);
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
  override _of: OpUnitType = 'day';
  override option = {
    type: 'Date',
  };
}

export class DateRange<T extends DatetimeKeys> extends Field<`${T}[]`> {
  protected _of?: OpUnitType;
  private _start?: Date;
  private _end?: Date;
  protected _format: string = 'YYYY-MM-DD';

  /**
   * 设置输出格式，在使用 `string` 类型有效
   * - 默认: `YYYY-MM-DD`
   */
  format(fmt: string) {
    this._format = fmt;
    return this;
  }

  /**
   * 设置保留精度
   * - 默认: `day`
   */
  of(unitOfTime: OpUnitType) {
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
    let m = dayjs(data);
    if (!m.isValid()) {
      this.fail('form.datetime.format-error', { data });
    }
    return m;
  }

  clean(data: any) {
    let _start;
    if (this._start) {
      _start = dayjs(this._start);
      if (this._of) {
        _start = _start.startOf(this._of);
      }
    }
    let _end;
    if (this._end) {
      _end = dayjs(this._end);
      if (this._of) {
        _end = _end.endOf(this._of);
      }
    }

    let dataS = this._clean(data && data[0]);
    if (dataS) {
      if (this._of) {
        dataS = dataS.startOf(this._of);
      }
      if (_start && dataS.isBefore(_start)) {
        this.fail('form.daterange.start.before', { start: _start.format(this._format) });
      }
      if (_end && dataS.isAfter(_end)) {
        this.fail('form.daterange.start.after', { end: _end.format(this._format) });
      }
    }
    let dataE = this._clean(data && data[1]);
    if (dataE) {
      if (this._of) {
        dataE = dataE.endOf(this._of);
      }
      if (_start && dataE.isBefore(_start)) {
        this.fail('form.daterange.end.before', { start: _start.format(this._format) });
      }
      if (_end && dataE.isAfter(_end)) {
        this.fail('form.daterange.end.after', { end: _end.format(this._format) });
      }
      if (dataS && dataE.isBefore(dataS)) {
        this.fail('form.daterange.end.lt-start');
      }
    }
    if (dataS || dataE) {
      if (this._valueType.includes('string')) {
        return [dataS?.format(this._format), dataE?.format(this._format)];
      }
      return [dataS?.toDate(), dataE?.toDate()];
    }
  }
}

export class Time<T extends StringKeys> extends Field<T> {
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
    let m = dayjs(data, this._format);
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
