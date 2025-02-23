<template>
  <div class="home-container">
    <h1 class="main-title">Rule Construction</h1>
    <div class="rule-section">
      <h2 class="section-title">IF</h2>
      <div class="conditions">
        <div 
          v-for="condition in ruleStore.conditions" 
          :key="condition.id" 
          class="condition"
        >
          <span @click="handleConditionClick(condition)" class="condition-text">
            {{ condition.text || '新建条件' }}
          </span>
          <button @click="removeCondition(condition)" class="remove-button">-</button>
        </div>
        <button @click="addCondition" class="add-button">+ condition</button>
      </div>
    </div>
    <div class="rule-section">
      <h2 class="section-title">THEN</h2>
      <!-- 输入框用于输入执行操作 -->
      <div class="action">
        <input 
          v-model="ruleStore.action" 
          type="text" 
          class="action-input" 
          placeholder="Input the service description here"
          @input="onActionInput"
          @focus="onActionFocus"
        />
      </div>
    </div>
    <button @click="submitRule" class="submit-button">submit rule</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useRuleStore } from '../stores/ruleStore'
import { addLog, sendLogs } from '../utils/logger' // 导入 addLog

const router = useRouter()
const ruleStore = useRuleStore()

// 用户开始输入时触发
const onActionFocus = () => {
  console.log('用户开始输入')
  addLog('Action Input Start', { action: ruleStore.action }) // 记录日志
}

// 监听用户输入
const onActionInput = () => {
  console.log('当前输入的 action:', ruleStore.action)

  // 记录日志
  addLog('Action Input', { action: ruleStore.action })

  // 判断输入是否为空
  isActionEmpty.value = ruleStore.action.trim() === ''
}

// 添加条件时，使用唯一的 id
const addCondition = () => {
  const newCondition = { id: Date.now(), text: 'new condition', type: null, details: {} }
  ruleStore.addCondition(newCondition)
  console.log('添加新条件:', newCondition)
  addLog('Add Condition', { condition: newCondition }) // 记录日志
  // 导航到 ConditionSelection 界面，传递最新条件的 id
  router.push({ name: 'ConditionSelection', query: { id: newCondition.id } })
}

// 处理条件点击逻辑
const handleConditionClick = (condition) => {
  if (condition.type === null) {
    // 条件未配置，导航到 ConditionSelection 选择类型
    console.log('导航到 ConditionSelection 以配置条件 id:', condition.id)
    addLog('Configure Condition', { conditionId: condition.id, type: 'ConditionSelection' }) // 记录日志
    router.push({ name: 'ConditionSelection', query: { id: condition.id } })
  } else {
    // 条件已配置，导航到对应的条件详情配置页面
    console.log(`导航到 ${condition.type} 以配置条件 id:`, condition.id)
    addLog('Configure Condition', { conditionId: condition.id, type: condition.type })
    router.push({ name: condition.type, query: { id: condition.id } })
  }
}

const removeCondition = (condition) => {
  console.log('移除条件 id:', condition.id)
  addLog('Remove Condition', { conditionId: condition.id, type: condition.type}) // 记录日志
  ruleStore.removeCondition(condition.id)
}

const submitRule = () => {
  console.log('提交的条件:', ruleStore.conditions)
  console.log('提交的执行操作:', ruleStore.action)
  addLog('Submit Rule', { conditions: ruleStore.conditions, action: ruleStore.action }) // 记录日志
  // sendLogs()
  router.push({ name: 'Questionnaire' })
  // 这里可以添加实际提交逻辑，例如调用 API
}
</script>

<style scoped>
.home-container {
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

.rule-section {
  margin-bottom: 30px;
}

.section-title {
  text-align: left;
  color: #2c3e50;
  font-size: 1.5em;
  margin-bottom: 15px;
}

.conditions, .action {
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.condition {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: flex-start; /* 确保条件文本和按钮左对齐 */
}

.condition-text {
  flex: 1;
  cursor: pointer;
  color: #34495e;
  text-align: left;  /* 确保文本左对齐 */
  transition: color 0.3s;
}

.condition-text:hover {
  color: #1abc9c;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.2em;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: #c0392b;
}

.add-button {
  padding: 10px 15px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #16a085;
}

.action {
  display: flex;
  flex-direction: column;
}

.action-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1em;
  margin-top: 10px;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #2980b9;
}
</style>
