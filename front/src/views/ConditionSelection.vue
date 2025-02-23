<!-- src/views/ConditionSelection.vue -->
<template>
  <div class="condition-selection-container">
    <h1 class="main-title"> choose one condition</h1>
    <div class="condition-buttons">
      <div v-for="condition in conditionOptions" :key="condition.id" class="condition-item">
        <button 
          @click="selectCondition(condition)"
          class="condition-button"
        >
          <div class="button-content">
            <span class="condition-name">{{ condition.type }}</span>
            <span v-if="condition.description" class="condition-description">
              {{ condition.description }}
            </span>
          </div>
        </button>
      </div>
    </div>
    <button @click="goBack" class="back-button">Back</button>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useRuleStore } from '../stores/ruleStore'
import { addLog } from '../utils/logger' // 导入 addLog 函数
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const ruleStore = useRuleStore()

// 定义条件选项，包含描述字段
const conditionOptions = [
  { id: 15, name: '摄像头', type: 'Camera', description: 'For example: "When the camera feed contains a shared bike"' },
  { id: 16, name: '语音输入', type: 'Voice', description: 'For example: "When I voice input ‘appointment’"' },
  { id: 17, name: '文本输入', type: 'Text', description: 'For example: "When I text input ‘appointment’"' },
  { id: 14, name: '手势', type: 'Gesture', description: 'For example: "When I double-tap the back of my phone"' },
  { id: 5, name: '界面信息', type: 'Screen', description: 'For example: "When the screen displays meeting information"' },
  { id: 1, name: '特定时间', type: 'SpecificTime', description: 'For example: "8 AM, weekdays"' },
  { id: 2, name: '时间区间', type: 'TimePeriod', description: 'For example: "Between 8:00 AM and 10:00 AM"' },
  { id: 3, name: '地点', type: 'Location', description: 'For example: "When I arrive at the gym"' },
  { id: 4, name: '运动状态', type: 'Activity', description: 'For example: "When I start running"' },
  { id: 6, name: '通知消息', type: 'Message', description: 'For example: "When I receive a WeChat message from my mom"' },
  { id: 13, name: '屏幕使用时间', type: 'UsageTime', description: 'For example: "When the screen usage time reaches 30 minutes"' },
  { id: 9, name: 'App', type: 'App', description: 'For example: "When I open or close the ‘Weather’ app"' },
  { id: 7, name: '无线局域网', type: 'WiFi', description: 'For example: "When my phone connects to the home WiFi network"' },
  { id: 8, name: '蓝牙', type: 'Bluetooth', description: 'For example: "When my phone connects to my AirPods"' },
  { id: 10, name: '电量', type: 'Battery', description: 'For example: "When the battery level exceeds 50%"' },
  { id: 11, name: '充电器', type: 'Charger', description: 'For example: "When my phone is connected to a charger"' },
  { id: 12, name: '声音识别', type: 'Audio', description: 'For example: "When my phone recognizes a specific sound"' },

]


const selectCondition = (condition) => {
  const id = parseInt(route.query.id)
  if (!isNaN(id)) {
    console.log(`选择条件类型 ${condition.type} 对应的 id ${id}`)
    
    // 添加日志记录：选择条件
    addLog('Select Condition', { 
      conditionId: condition.id, 
      conditionType: condition.type, 
      conditionName: condition.name 
    })
    
    // 更新条件类型
    ruleStore.updateConditionType(id, condition.type)
    
    // 导航到相应的条件配置页面，并传递 id
    router.push({ name: condition.type, query: { id } })
  } else {
    console.error('无效的 id:', route.query.id)
  }
}

const goBack = () => {
  console.log('用户点击返回按钮')
  
  // 添加日志记录：返回按钮
  addLog('Go Back', { 
    from: 'ConditionSelection', 
    action: 'Home' 
  })
  
  router.push({ name: 'Home'})
}
</script>

<style scoped>
.condition-selection-container {
  padding: 30px;
  max-width: 700px;
  margin: 0 auto;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.main-title {
  text-align: center;
  color: #34495e;
  margin-bottom: 40px;
  font-size: 2em;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
}

.condition-buttons {
  display: flex;
  flex-direction: column;
}

.condition-item {
  margin-bottom: 15px; /* 增加每个条件项的间距 */
}

.condition-button {
  display: flex; 
  justify-content: space-between; /* 使名称和描述分开显示 */
  align-items: center; /* 垂直居中对齐内容 */
  padding: 15px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%; /* 按钮宽度填满父容器 */
}

.condition-button:hover {
  background-color: #16a085;
}

.button-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.condition-name {
  font-size: 16px;
  font-weight: bold;
}

.condition-description {
  font-size: 14px;
  color: white;
  margin-left: 10px;
}

.back-button {
  width: 100%;
  padding: 15px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 30px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #333;
}
</style>
