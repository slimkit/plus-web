# ThinkSNS+ Desktop Client

> **(prototype)** VUE SSR version for ThinkSNS+ Desktop View.

## Build Setup

``` bash
# 安装依赖
$ yarn

# 启动开发环境
$ yarn dev

# 以生产环境构建并启动服务
$ yarn build
$ yarn start

# 构建 SPA 静态版本
$ yarn generate

# 启动测试
$ yarn test

```

# 开发文档

## 开发前准备

- nodejs > 10
- [yarn 包管理器](https://yarnpkg.com/) (安装依赖提速)
- vscode (或其他支持 eslint、vue 高亮的插件)
- chorome 或 firefox 的 [vue-devtools 插件](https://github.com/vuejs/vue-devtools)

### vscode 插件推荐
- \* `vetur` vue 语法高亮
- \* `ESLint` 代码风格检查与自动修正
- `Path Intellisense` 路径感知（文件跳转）
- `Vue Peek` vue 组件跳转
- `Toggle Quotes` 快速切换引号 按 `ctrl+'` 在[`'` `"` `` ` ``]中快速切换

### 其他编辑器必装插件
- vue 语法高亮, less 语法高亮，es6 语法支持
- eslint (最好开启保存时自动修复 auto-fix on save)

## API

### 全局组件

以下组件可以在任意地方使用 `this.$root.$emit('xxx', payload)` 来呼出 modal

- `reward` 打赏
- `pinned` 置顶
- `report` 举报
- `password` 密码验证

> 这些文件位于 `./components/common/ModalXXX.vue` 中

例如要打赏id为12的动态

``` js
export default {
  methods: {
    onReward() {
      this.$root.$emit('reward', {
        type: 'feed',
        article: 12,
        callback: amount => {
          console.log(`成功打赏${amount}积分！`)
        }
      })
    }
  }
}
```

> `payload` 参数根据不同的需求有所不同，具体请参考组件中 `created` 钩子中注册事件（`this.$root.$on('xxx')`）的部分

# 参考资料

## vue

[官方手册](https://cn.vuejs.org/v2/guide/index.html)

## ES6

[阮一峰的ES6入门手册](http://es6.ruanyifeng.com/)

## nuxt

[官方教程](https://zh.nuxtjs.org/guide)

[API](https://zh.nuxtjs.org/api)

## iView

iView 使用按需加载，如果要使用某组件，在 `plugins/iview` 中加载即可

iView 样式表使用 less 重新导入在 `assets/less/iview/` 下

[组件手册](https://www.iviewui.com/docs/guide/start)

## axios

[axios (英文)](https://github.com/axios/axios)

[axios for nuxt (英文) ](https://axios.nuxtjs.org/)

## less

[中文文档](http://lesscss.cn/)

## flex 布局教程

[阮一峰的 flex 布局教程](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

## ava (单元测试)

[官方文档](https://github.com/avajs/ava-docs/blob/master/zh_CN/readme.md)
