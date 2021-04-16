import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/Index.vue'
import Cookies from 'js-cookie'

Vue.use(VueRouter)

const routes = [
  {
    path: '/cookie',
    component: Layout,
    meta: { title: 'cookie' },
    children: [
      {
        path: 'list',
        name: 'CookieList',
        component: () => import('@/views/cookie/List'),
        meta: { title: 'CookieList' }
      },
      {
        path: 'detail',
        name: 'CookieDetail',
        component: () => import('@/views/cookie/Detail'),
        meta: { title: 'CookieDetail' }
      }
    ]
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('../views/message/Index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register/Index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Index.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Index.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404/Index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/jd_docker-app/ui',
  routes
})

function setTo (to) {
  const data = {}
  data.name = to.name
  data.meta = to.meta
  data.query = to.query
  data.params = to.params
  data.path = to.path
  data.fullPath = to.fullPath
  Vue.prototype.$setStorageSync('to', data)
}

router.beforeEach(async (to, from, next) => {
  console.log('router.beforeEach to', to)
  console.log('router.beforeEach from', from)
  const ifSetTo = to.name !== 'Login' && to.name !== 'Register' && to.name !== '404'
  if (!Cookies.get('Authorization') && ifSetTo) {
    setTo(to)
    return next({ name: 'Login', replace: true })
  }
  if (ifSetTo) {
    setTo(to)
  }
  next()
})

router.afterEach((to, from) => {
  console.log('router.afterEach to', to)
  console.log('router.afterEach from', from)
})

export default router
