import { Widget, simple } from './widget';
import * as select from './select';
import * as datetime from './datetime';
import * as upload from './upload';
import * as text from './text';
import * as cascader from './cascader';
import * as suggest from './suggest';

export const widgets = {
  Widget,
  input: simple(Widget),
  ...select,
  ...datetime,
  ...upload,
  ...text,
  ...cascader,
  ...suggest,
};
