/**
 * 判断选择项值类型
 */
export function guessType(v: any): 'number' | 'bool' | 'string' {
  switch (typeof v) {
    case 'bigint':
    case 'number':
      return 'number';
    case 'boolean':
      return 'bool';
  }
  return 'string';
}
