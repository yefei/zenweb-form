import { CastKeys, CastBasics, CastOption } from 'typecasts';

class Typed<
  T extends CastKeys,
  R = CastBasics[T] | undefined | null,
> {
  private _required?: boolean;
  private _toList?: boolean | string;
  private _notNull?: boolean;

  constructor(private valueType: T) {}

  required(): Typed<T, Exclude<R, undefined>> {
    this._required = true;
    return this;
  }

  toList(sep?: string): Typed<T, R | CastBasics[T][]> {
    this._toList = sep || true;
    return this;
  }

  nonNull(): Typed<T, Exclude<R, null>> {
    this._notNull = true;
    return this;
  }

  getCastOption(): CastOption {
    return {
      type: this.valueType,
    };
  }
}

class NumberField extends Typed<'int'> {
  constructor() {
    super('int');
  }
}

abstract class Form {
  abstract setup(): {};

  get data(): ReturnType<this['setup']> {
    return {} as any;
  }
}

class TestForm extends Form {
  setup() {
    return {
      age: new NumberField().nonNull(),
    }
  }
}

const t2 = new TestForm();
const d2 = t2.data;
