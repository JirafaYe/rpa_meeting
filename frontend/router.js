import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from './pages/index/index.vue'
import AdminLogin from './pages/admin/login.vue'
import UserLogin from './pages/user/login.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: IndexPage,
    meta: { title: '首页' }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { title: '管理员登录' }
  },
  {
    path: '/user/login',
    name: 'UserLogin',
    component: UserLogin,
    meta: { title: '用户登录' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'RPA会议系统'
  
  // 继续导航
  next()
})

export default router 