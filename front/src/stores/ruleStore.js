// src/stores/ruleStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRuleStore = defineStore('ruleStore', () => {
  const conditions = ref([]) // 用于存储条件
  const action = ref('')
  const conditionDetails = ref({}) // 用于存储每个条件的详细信息

  // 添加条件
  const addCondition = (condition) => {
    conditions.value.push(condition)
    console.log('Condition added:', condition)
  }

  // 删除条件
  const removeCondition = (id) => {
    const index = conditions.value.findIndex(condition => condition.id === id)
    if (index !== -1) {
      console.log('Removing condition:', conditions.value[index])
      conditions.value.splice(index, 1)
      delete conditionDetails.value[id]
    } else {
      console.error('Condition not found with id:', id)
    }
  }

  // 更新条件类型
  const updateConditionType = (id, type) => {
    const condition = conditions.value.find(condition => condition.id === id)
    if (condition) {
      condition.type = type
      console.log(`Condition id ${id} type updated to ${type}`)
    } else {
      console.error('Condition not found with id:', id)
    }
  }

  // 更新具体条件的内容
  const updateConditionDetails = (id, details) => {
    // Update conditionDetails
    conditionDetails.value[id] = details
    console.log(`Condition details updated for id ${id}:`, details)

    // Update condition.text
    const condition = conditions.value.find(condition => condition.id === id)
    if (condition) {
      const conditionText = `${details.text}`
      condition.text = conditionText
      console.log(`Condition text updated for id ${id}:`, conditionText)
    } else {
      console.error('Condition not found with id:', id)
    }
  }

  const setAction = (newAction) => {
    action.value = newAction
  }

  return {
    conditions,
    action,
    conditionDetails,
    addCondition,
    removeCondition,
    updateConditionType,
    updateConditionDetails,
    setAction,
  }
})
