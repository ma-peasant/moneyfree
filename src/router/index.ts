

import {RouteRecordRaw, createWebHashHistory,createRouter} from 'vue-router'
import  ConsumeType from '../views/ConsumeType.vue'
const routes :Array<RouteRecordRaw>= [
  { path: '/addConsumeType', component: ConsumeType  }
 ]
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})


// const originalPush = VueRouter.prototype.push

// VueRouter.prototype.push = function push(location ,onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch((err) => err)
// }

// router.beforeEach((to, from, next) => {
//   if (to.name == 'login' && from.name == 'main' && to.params && to.params.from != 'main') {
//     /* to.params = { 'from': 'main' } */
//     next({ name: 'login', params: { 'from': 'main' } })
//   }
//   else {
//     next()
//   }
// })

export {router}