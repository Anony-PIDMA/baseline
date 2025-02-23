// front/src/utils/logger.js
import axios from 'axios'

// 定义日志存储
let logs = []

// 添加日志
export function addLog(action, details = {}) {
  const timestamp = new Date().toLocaleString()
  logs.push({ timestamp, action, details})
  console.log(`日志记录: ${action} at ${timestamp}`, details)
}

// 发送日志到后端
export async function sendLogs() {
  if (logs.length === 0) return

  try {
    await axios.post('http://101.6.42.17:22235/api/logs', { logs })
    console.log('日志已成功发送到后端')
    logs = [] // 清空已发送的日志
  } catch (error) {
    console.error('发送日志失败:', error)
  }
}

// 在页面卸载时发送剩余日志
window.addEventListener('beforeunload', () => {
  navigator.sendBeacon('http://127.0.0.1:5000/api/logs', JSON.stringify({ logs }))
})
