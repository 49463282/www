import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import TreeView from 'vue-json-tree-view'

Vue.use(TreeView)
Vue.use(ElementUI, { size: 'medium' })

Vue.prototype.$setStorageSync = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ data }))
}
Vue.prototype.$getStorageSync = (key) => {
  const val = localStorage.getItem(key)
  if (val) {
    return JSON.parse(val).data
  } else {
    return ''
  }
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
