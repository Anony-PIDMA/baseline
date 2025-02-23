// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { addLog } from './utils/logger'

import Home from './views/Home.vue'
import ConditionSelection from './views/ConditionSelection.vue'
import ActionSelection from './views/ActionSelection.vue'
import SpecificTime from './views/conditions/SpecificTime.vue'
import TimeRange from './views/conditions/TimeRange.vue'
import Location from './views/conditions/Location.vue'
import Activity from './views/conditions/Activity.vue'
import Screen from './views/conditions/Screen.vue'
import Message from './views/conditions/Message.vue'
import Wifi from './views/conditions/Wifi.vue'
import Bluetooth from './views/conditions/Bluetooth.vue'
import App from './views/conditions/App.vue'
import Battery from './views/conditions/Battery.vue'
import Charger from './views/conditions/Charger.vue'
import Audio from './views/conditions/Audio.vue'
import UsageTime from './views/conditions/UsageTime.vue'
import Gesture from './views/conditions/Gesture.vue'
import Camera from './views/conditions/Camera.vue'
import Voice from './views/conditions/Voice.vue'
import Text from './views/conditions/Text.vue'
import Questionnaire from './views/Questionnaire.vue'
// 导入其他 Condition 和 Action 组件...

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/',
    name: 'Questionnaire',
    component: Questionnaire
  },
  {
    path: '/',
    name: 'ConditionSelection',
    component: ConditionSelection
  },
  {
    path: '/actions',
    name: 'ActionSelection',
    component: ActionSelection
  },
  {
    path: '/conditions/specific-time',
    name: 'SpecificTime',
    component: SpecificTime
  },
  {
    path: '/conditions/time-period',
    name: 'TimePeriod',
    component: TimeRange
  },
  {
    path: '/conditions/location',
    name: 'Location',
    component: Location
  },
  {
    path: '/conditions/activity',
    name: 'Activity',
    component: Activity
  },
  {
    path: '/conditions/screen',
    name: 'Screen',
    component: Screen
  },
  {
    path: '/conditions/message',
    name: 'Message',
    component: Message
  },
  {
    path: '/conditions/wifi',
    name: 'WiFi',
    component: Wifi
  },
  {
    path: '/conditions/bluetooth',
    name: 'Bluetooth',
    component: Bluetooth
  },
  {
    path: '/conditions/app',
    name: 'App',
    component: App
  },
  {
    path: '/conditions/battery',
    name: 'Battery',
    component: Battery
  },
  {
    path: '/conditions/charger',
    name: 'Charger',
    component: Charger
  },
  {
    path: '/conditions/audio',
    name: 'Audio',
    component: Audio
  },
  {
    path: '/conditions/usage-time',
    name: 'UsageTime',
    component: UsageTime
  },
  {
    path: '/conditions/gesture',
    name: 'Gesture',
    component: Gesture
  },
  {
    path: '/conditions/camera',
    name: 'Camera',
    component: Camera
  },
  {
    path: '/conditions/voice',
    name: 'Voice',
    component: Voice
  },
  {
    path: '/conditions/text',
    name: 'Text',
    component: Text
  },

  // 其他 Condition 和 Action 的路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：在每次导航前记录日志
router.beforeEach((to, from, next) => {
  addLog('Page Navigation', { from: from.name, to: to.name })
  next()
})

export default router
