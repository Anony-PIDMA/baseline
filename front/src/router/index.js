// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ConditionSelection from '../views/ConditionSelection.vue'
import SpecificTime from '../views/conditions/SpecificTime.vue'
import Alarm from '../views/conditions/Alarm.vue'
import Sleep from '../views/conditions/Sleep.vue'
import Arrival from '../views/conditions/Arrival.vue'
import Departure from '../views/conditions/Departure.vue'
import ActionSelection from '../views/ActionSelection.vue'
// 导入其他条件配置组件...

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/conditions',
    name: 'ConditionSelection',
    component: ConditionSelection
  },
  {
    path: '/SpecificTime',
    name: 'SpecificTime',
    component: SpecificTime
  },
  {
    path: '/Alarm',
    name: 'Alarm',
    component: Alarm
  },
  {
    path: '/Sleep',
    name: 'Sleep',
    component: Sleep
  },
  {
    path: '/Arrival',
    name: 'Arrival',
    component: Arrival
  },
  {
    path: '/Departure',
    name: 'Departure',
    component: Departure
  },
  {
    path: '/actions',
    name: 'ActionSelection',
    component: ActionSelection
  },
  // 添加其他路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
