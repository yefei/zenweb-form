import { Widget } from './widget';
export { Widget };

import * as select from './select';
import * as datetime from './datetime';
import * as upload from './upload';
import * as text from './text';
import * as cascader from './cascader';
import * as suggest from './suggest';

export const widgets = {
  ...select,
  ...datetime,
  ...upload,
  ...text,
  ...cascader,
  ...suggest,
};
