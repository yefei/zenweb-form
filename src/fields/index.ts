import * as select from './select.js';
import * as datetime from './datetime.js';
import * as upload from './upload.js';
import * as text from './text.js';
import * as cascader from './cascader.js';
import * as suggest from './suggest.js';
import * as other from './other.js';

export const fields = {
  ...select,
  ...datetime,
  ...upload,
  ...text,
  ...cascader,
  ...suggest,
  ...other,
};
