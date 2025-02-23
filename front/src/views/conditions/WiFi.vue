<template>
  <div class="wifi-condition-container">
    <h1 class="main-title">Wi-Fi</h1>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Condition Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Connected' }" 
          @click="selectOption('Connected')"
          class="option-button"
        >
          Connected
        </button>
        <button 
          :class="{ selected: selectedOption === 'Disconnected' }" 
          @click="selectOption('Disconnected')" 
          class="option-button"
        >
          Disconnected
        </button>
      </div>
    </div>

    <!-- Wi-Fi name selection dropdown -->
    <div class="section">
      <h2 class="section-title">Select Wi-Fi Name</h2>
      <select v-model="wifiName" class="wifi-select" @change="onWifiSelect">
        <option value="" disabled>Select a Wi-Fi network</option>
        <option v-for="wifi in wifiNetworks" :key="wifi.name" :value="wifi.name">{{ wifi.name }}</option>
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
const wifiName = ref('')
const wifiNetworks = ref([])

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      selectedOption.value = condition.details.option || null
      wifiName.value = condition.details.wifiName || ''
    }
  }

  // Load the device info (wifi networks)
  const deviceInfo = getDeviceInfo()
  wifiNetworks.value = deviceInfo.wifiNetworks
})

// Select condition type
const selectOption = (option) => {
  selectedOption.value = option
  // Log the selection
  addLog('Select Option', { option })
}

// Handle Wi-Fi selection
const onWifiSelect = () => {
  // Add log record: Wi-Fi selected
  addLog('Wi-Fi Selected', { wifiName: wifiName.value })
}

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id
  addLog('Go Back', { from: 'Wifi', to: 'ConditionSelection' })  // Log the back action
  router.push({ name: 'ConditionSelection', query: { id } })
}

// Confirm the selection and return
const confirmSelection = () => {
  const id = parseInt(route.query.id)
  if (!isNaN(id)) {
    const details = { 
      type: 'Wifi', 
      option: selectedOption.value, 
      wifiName: wifiName.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
  }
  addLog('Submit Condition', { condition: generateText() })  // Log the submission
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''

  // Describe the condition type
  if (selectedOption.value === 'Connected') {
    description += `Connected to "${wifiName.value}" Wi-Fi`
  } else if (selectedOption.value === 'Disconnected') {
    description += `Disconnected from "${wifiName.value}" Wi-Fi`
  }

  return description
}
</script>

<style scoped>
.wifi-condition-container {
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

.wifi-select {
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
