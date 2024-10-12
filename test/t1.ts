import { GetFieldType, TypeField, TypeListField } from "../src/field/js";

type ObjectFieldType = {
  [x: string]: TypeField<any> | TypeListField<any> | ObjectField<any>;
};

export class ObjectField<T extends ObjectFieldType> {

}


class User {}



class NumberField extends TypeField<'number'> {
  constructor() {
    super('number');
  }
}

abstract class Form {
  abstract setup(): {};

  get data(): { [K in keyof ReturnType<this['setup']>]: GetFieldType<ReturnType<this['setup']>[K]> }  {
    return {} as any;
  }
}

class TestForm extends Form {
  setup() {
    const age = new NumberField().optional();
    return {
      age,
      list: new TypeListField('int').optional(),
    }
  }
}

const t2 = new TestForm();
const d2 = t2.data;

function eachFields(fields: FormFields, parent?: string) {
  for (let [name, opt] of Object.entries(fields)) {
    if (parent) {
      name = `${parent}${objectSpliter}${name}`;
    }
    if (typeof opt === 'string') {
      form.plainFields[name] = {
        cast: { type: opt, field: name },
        option: {},
      };
    }
    else if (opt.pick && opt.type.includes('object')) {
      eachFields(opt.pick, name);
      continue;
    }
    else {
      opt = Object.assign({ field: name }, opt); // pure CastOption
      const widget = opt.widget || {};
      delete opt.widget;
      form.plainFields[name] = {
        cast: opt,
        option: widget instanceof Widget ? widget.output() : widget,
      };
      if (widget instanceof Widget) {
        form.plainFields[name].widget = widget;
      }
    }
  }
}
