# Changelog

## [6.0.4] - 2025-12-2
- fix: 从生产依赖更新开发依赖

## [6.0.3] - 2025-8-7
- fix: choicesObject 数值被转换为字符串key问题

## [6.0.2] - 2025-4-28
- fix: Multiple 多选类型丢失

## [6.0.1] - 2025-4-28
- fix: Multiple 多选无效问题

## [6.0.0] - 2024-10-12
- ESM

## [5.5.1] - 2024-9-6
- 更新依赖

## [5.5.0] - 2024-8-19
- 新增: select 组件增加 choicesObject 方法

## [5.4.2] - 2023-12-7
- fix: 表单字段默认值问题

## [5.4.1] - 2023-12-7
- fix: OneBox 不选择校验不过问题

## [5.4.0] - 2023-5-17
- 使用 Bootstrap 美化静态模版

## [5.3.0] - 2023-5-12
- DateRange 字段支持 string 类型，并改进日期范围判断

## [5.2.3] - 2023-4-23
- Field 公开 splitter maxItems minItems 方法
- 更新说明文档

## [5.2.0] - 2023-4-23
- 所有字段使用 Field 继承

## [5.1.0] - 2023-4-23
- 合并 TypeField, ListTypeField 为 Field 并导出

## [5.0.0] - 2023-4-23
- 使用 Form.setup 方式初始化表单字段

## [4.5.1] - 2023-4-19
- 更新: set data 值是否有效判断

## [4.5.0] - 2023-4-14
- 优化代码, 定义 toJSON 方法

## [4.4.0] - 2023-4-14
- 定义导出: FormResult

## [4.3.3] - 2023-4-11
- use: property-at

## [4.3.2] - 2023-4-9
- fix: html 控件值判定问题

## [4.3.1] - 2023-4-9
- fix: html 控件 Cascader, Radio, Select value 值判定 bug

## [4.3.0] - 2023-4-9
- html 控件 Cascader, Radio, Select 如果不是必填项则增加一项空选项

## [4.2.0] - 2023-4-9
- html 控件 Cascader, DateRange

## [4.1.0] - 2023-4-7
- 新增 onebox 控件
- 对象字段分割字符换为 $ (. 分割符与 vue 冲突)

## [4.0.0] - 2023-4-7
- 整体重构，`form.data` 支持字段类型约束
- 内置 html 渲染模版

## [3.7.3] - 2023-4-1
- 适配: typecasts@3.0.0

## [3.7.2] - 2023-3-13
- Form.data 可以设置 null | undefined

## [3.7.1] - 2023-3-13
- Form.assert(Partial<D>) and validate(Partial<D>)

## 3.7.0
- 更新到 zenweb@3.11.0
