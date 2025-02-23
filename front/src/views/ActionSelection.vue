<!-- src/views/ActionSelection.vue -->
<template>
    <div class="action-selection-container">
      <h1 class="main-title">选择一个操作</h1>
      <div class="action-buttons">
        <div v-for="action in actionOptions" :key="action.id" class="action-item">
          <button 
            @click="selectAction(action)"
            class="action-button"
          >
            <span class="action-name">{{ action.name }}</span>
            <span v-if="action.description" class="action-description">
              {{ action.description }}
            </span>
          </button>
        </div>
      </div>
      <button @click="goBack" class="back-button">返回</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useRuleStore } from '../stores/ruleStore'
  
  const router = useRouter()
  const ruleStore = useRuleStore()
  
  // 定义操作选项，包含描述字段
  const actionOptions = ref([
    { id: 1, name: '打开App', type: 'OpenApp', description: '例如: "打开微信应用"' },
    { id: 2, name: '发送短信', type: 'SendMessage', description: '例如: "发送短信到妈妈"' },
    { id: 3, name: '播放音乐', type: 'PlayMusic', description: '例如: "播放喜欢的歌曲"' },
    { id: 4, name: '设置闹钟', type: 'SetAlarm', description: '例如: "设置明天早上7点的闹钟"' },
    { id: 5, name: '调整亮度', type: 'AdjustBrightness', description: '例如: "将屏幕亮度调至80%"' },
    // 添加其他 Action 选项...
  ])
  
  const selectAction = (action) => {
    console.log('选择的操作:', action) // Debug
    if (ruleStore.setAction) {
      ruleStore.setAction(action.type)
      console.log('操作已设置在 store 中:', ruleStore.action) // Debug
      // 根据需要导航到 action 的配置页面
      router.push({ name: action.type, query: { id: parseInt(route.query.id) } })
    } else {
      console.error('ruleStore 中没有 setAction 方法')
    }
  }
  
  const goBack = () => {
    router.back()
  }
  </script>
  
  <style scoped>
  .action-selection-container {
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
  
  .action-buttons {
    display: flex;
    flex-direction: column;
  }
  
  .action-item {
    margin-bottom: 15px; /* 增加每个操作项的间距 */
  }
  
  .action-button {
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
  
  .action-button:hover {
    background-color: #16a085;
  }
  
  .action-name {
    font-size: 16px;
    font-weight: bold;
  }
  
  .action-description {
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
  