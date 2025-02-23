<template>
  <div class="activity">
    <h1 class="main-title">Activity</h1>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Status Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Start' }" 
          @click="selectOption('Start')" 
          class="option-button"
        >
          Start 
        </button>
        <button 
          :class="{ selected: selectedOption === 'End' }" 
          @click="selectOption('End')" 
          class="option-button"
        >
          End
        </button>
        <button 
          :class="{ selected: selectedOption === 'Activity Status' }" 
          @click="selectOption('Activity Status')" 
          class="option-button"
        >
          At
        </button>
      </div>
    </div>

    <!-- Activity status selection -->
    <div class="section">
      <h2 class="section-title">Select Activity Type</h2>
      <select 
        v-model="activityStatus" 
        id="activity-status" 
        class="activity-status-select" 
        @change="onActivityStatusChange"
      >
        <option v-for="(status, index) in activityStatuses" :key="index" :value="status">
          {{ status }}
        </option>
      </select>
    </div>

    <!-- Action buttons -->
    <div class="action-buttons">
      <button @click="confirmSelection" class="confirm-button">Confirm</button>
      <button @click="navigateBack" class="back-button">Back</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useRuleStore } from '../../stores/ruleStore'
import { addLog } from '../../utils/logger'

const router = useRouter()
const route = useRoute()
const ruleStore = useRuleStore()

// Declare reactive data
const selectedOption = ref(null)
const activityStatus = ref('Walking') // Default to "Walking"

// Activity status options
const activityStatuses = ['Static', 'Walking', 'Running', 'Bicycling', 'Driving']

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      selectedOption.value = condition.details.option || null
      activityStatus.value = condition.details.activityStatus || 'Walking'
    }
  }
})

// Select condition type
const selectOption = (option) => {
  selectedOption.value = option
  // Add log record: Select condition type
  addLog('Select Option', { 
    selectedOption: option 
  })
}

// Log when activity status changes
const onActivityStatusChange = () => {
  // Add log record: Activity status change
  addLog('Change Activity Status', { 
    activityStatus: activityStatus.value 
  })
}

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id
  const fromPage = route.name || route.path
  addLog('Go Back', { 
    from: fromPage, 
    to: 'ConditionSelection' 
  })
  router.push({ name: 'ConditionSelection', query: { id } })
}

// Confirm the selection and return
const confirmSelection = () => {
  const id = parseInt(route.query.id)
  if (!isNaN(id)) {
    const details = { 
      type: 'Activity', 
      option: selectedOption.value, 
      activityStatus: activityStatus.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
  }
  // Add log record: Submit condition
  addLog('Submit Condition', { 
    conditionId: id,
    option: selectedOption.value,
    activityStatus: activityStatus.value
  })
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''

  // Describe the condition type
  if (selectedOption.value === 'Start' || selectedOption.value === 'End') {
    description += `${selectedOption.value} ${activityStatus.value} activity`
  } else if (selectedOption.value === 'Activity Status') {
    description += `Currently in ${activityStatus.value} activity`
  }

  return description
}
</script>

<style scoped>
.activity {
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

.section {
  margin-bottom: 30px;
}

.section-title {
  text-align: left;
  color: #2c3e50;
  font-size: 1.5em;
  margin-bottom: 15px;
}

.options {
  display: flex;
  flex-direction: column;
}

.option-button {
  margin: 5px 0;
  padding: 12px 20px;
  background-color: #1abc9c; /* Main color */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s;
}

.option-button.selected {
  background-color: #16a085; /* Selected state color */
}

.option-button:hover {
  background-color: #16a085;
}

.activity-status-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 1em;
  box-sizing: border-box;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.confirm-button, .back-button {
  padding: 15px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1em;
}

.confirm-button {
  background-color: #2c9a74;
  margin-bottom: 15px;
}

.confirm-button:hover {
  background-color: #1d704d;
}

.back-button {
  background-color: #555;
}

.back-button:hover {
  background-color: #333;
}
</style>