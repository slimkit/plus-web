# COMPONENTS

组件目录

该目录下有 2 个比较特殊的目录，分别是 `global` 和 `common`

`global` 存放全局组件，该目录下的组件可随时使用，**无需导入可直接使用**

`common` 存放通用组件，该目录下的组件不专属于任何模块，可通用，**在使用时需要先导入**

> 组件具体内容可参考组件内的注释

其他目录存放模块相关的内容


## 规范

### 单文件组件的大小写

组件命名遵循 PascalCase 命名规范，首字母大写

参考 https://cn.vuejs.org/v2/style-guide/#%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%96%87%E4%BB%B6%E7%9A%84%E5%A4%A7%E5%B0%8F%E5%86%99-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90

### 紧密耦合的组件名

和父组件紧密耦合的子组件应该以父组件名作为前缀命名

参考 https://cn.vuejs.org/v2/style-guide/#%E7%B4%A7%E5%AF%86%E8%80%A6%E5%90%88%E7%9A%84%E7%BB%84%E4%BB%B6%E5%90%8D-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90

### 组件名中的单词顺序

组件名应该以高级别的 (通常是一般化描述的) 单词开头，以描述性的修饰词结尾。

参考 https://cn.vuejs.org/v2/style-guide/#%E7%BB%84%E4%BB%B6%E5%90%8D%E4%B8%AD%E7%9A%84%E5%8D%95%E8%AF%8D%E9%A1%BA%E5%BA%8F-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90


❌ **bad**
```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

✅ **good**
```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
