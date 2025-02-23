<template>
  <div class="app-condition-container">
    <h1 class="main-title">App</h1>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Status Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Open' }" 
          @click="selectOption('Open')"
          class="option-button"
        >
          Open
        </button>
        <button 
          :class="{ selected: selectedOption === 'Quit' }" 
          @click="selectOption('Quit')" 
          class="option-button"
        >
          Quit
        </button>
        <button 
          :class="{ selected: selectedOption === 'In Use' }" 
          @click="selectOption('In Use')" 
          class="option-button"
        >
          In Use
        </button>
      </div>
    </div>

    <!-- App name selection dropdown -->
    <div class="section">
      <h2 class="section-title">Select App</h2>
      <select v-model="selectedApp" class="app-select" @change="onAppSelect">
        <option value="" disabled>Select an app</option>
        <option v-for="app in apps" :key="app.name" :value="app.name">{{ app.name }}</option>
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
import getDeviceInfo from '../../utils/deviceInfo'

const router = useRouter()
const route = useRoute()
const ruleStore = useRuleStore()

// Declare reactive data
const selectedOption = ref(null)
const selectedApp = ref('')
const apps = ref([])

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      selectedOption.value = condition.details.option || null
      selectedApp.value = condition.details.appName || ''
    }
  }

  // Load the device info (apps, bluetooth, wifi, location)
  const deviceInfo = getDeviceInfo()
  apps.value = deviceInfo.apps
})

// Select condition type
const selectOption = (option) => {
  selectedOption.value = option
  // Add log record: Select condition type
  addLog('Select Option', { selectedOption: option })
}

// Handle app selection
const onAppSelect = () => {
  // Add log record: App selected
  addLog('App Selected', { selectedApp: selectedApp.value })
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
      type: 'App', 
      option: selectedOption.value, 
      appName: selectedApp.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
  }
  // Add log record: Submit condition
  addLog('Submit Condition', { 
    conditionId: id,
    option: selectedOption.value,
    appName: selectedApp.value
  })
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''
  if (selectedOption.value === 'Open') {
    description += `Open the "${selectedApp.value}" App`
  } else if (selectedOption.value === 'Quit') {
    description += `Quit the "${selectedApp.value}" App`
  } else if (selectedOption.value === 'In Use') {
    description += `The "${selectedApp.value}" App is in use`
  }
  return description
}
</script>

<style scoped>
.app-condition-container {
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

.app-select {
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
