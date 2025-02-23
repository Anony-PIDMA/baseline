<!-- src/components/conditions/Battery.vue -->
<template>
  <div class="battery-condition-container">
    <h1 class="main-title">Battery</h1>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Condition Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Less Than' }" 
          @click="selectOption('Less Than')"
          class="option-button"
        >
          Less Than
        </button>
        <button 
          :class="{ selected: selectedOption === 'Equal To' }" 
          @click="selectOption('Equal To')"
          class="option-button"
        >
          Equal To
        </button>
        <button 
          :class="{ selected: selectedOption === 'Greater Than' }" 
          @click="selectOption('Greater Than')"
          class="option-button"
        >
          Greater Than
        </button>
      </div>
    </div>

    <!-- Battery level input box -->
    <div class="section">
      <h2 class="section-title">Enter Battery Percentage</h2>
      <input 
        type="number" 
        v-model="batteryLevel" 
        id="battery-input" 
        placeholder="e.g. 50" 
        min="0" 
        max="100" 
        class="battery-input"
        @focus="onActionFocus"
        @input="onActionInput"
      />
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
const batteryLevel = ref(null)

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      selectedOption.value = condition.details.option || null
      batteryLevel.value = condition.details.batteryLevel || null
    }
  }
})

// Select condition type
const selectOption = (option) => {
  selectedOption.value = option
  // Clear the battery level input
  if (!option) {
    batteryLevel.value = null
  }
  // Add log record: Select condition type
  addLog('Select Option', { 
    selectedOption: option 
  })
}

// Record when the input box gets focus
const onActionFocus = () => {
  addLog('Action Input Start')
}

// Record when input occurs in the input box
const onActionInput = (event) => {
  addLog('Action Input', { input: event.target.value })
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
      type: 'Battery', 
      option: selectedOption.value, 
      batteryLevel: batteryLevel.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
  }
  // Add log record: Submit condition
  addLog('Submit Condition', { 
    conditionId: id,
    option: selectedOption.value,
    batteryLevel: batteryLevel.value
  })
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''

  // Describe the condition type
  if (selectedOption.value === 'Less Than') {
    description += `Battery level is less than ${batteryLevel.value}%`
  } else if (selectedOption.value === 'Equal To') {
    description += `Battery level is equal to ${batteryLevel.value}%`
  } else if (selectedOption.value === 'Greater Than') {
    description += `Battery level is greater than ${batteryLevel.value}%`
  }

  return description
}
</script>

<style scoped>
.battery-condition-container {
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

.battery-input {
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