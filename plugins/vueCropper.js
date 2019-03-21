import Vue from 'vue'

if (process.browser) {
  const vueCropper = require('vue-cropper').default
  Vue.use(vueCropper)
}
