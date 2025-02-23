<!-- src/components/conditions/Message.vue -->
<template>
  <div class="message-condition-container">
    <h1 class="main-title">Message</h1>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Condition Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Receive Message from User' }" 
          @click="selectOption('Receive Message from User')"
          class="option-button"
        >
          Receive Message from Specific User
        </button>
        <button 
          :class="{ selected: selectedOption === 'Message Contains Keyword' }" 
          @click="selectOption('Message Contains Keyword')"
          class="option-button"
        >
          Receive Message Contains Keyword
        </button>
      </div>
    </div>

    <!-- User name input box -->
    <div v-if="selectedOption === 'Receive Message from User'" class="section">
      <h2 class="section-title">Enter User Name</h2>
      <input 
        type="text" 
        v-model="userName" 
        id="user-input" 
        placeholder="e.g.: Mom" 
        class="user-input"
        @focus="onActionFocus"
        @input="onActionInput"
      />
    </div>

    <!-- Keyword input box -->
    <div v-if="selectedOption === 'Message Contains Keyword'" class="section">
      <h2 class="section-title">Enter Keyword</h2>
      <input 
        type="text" 
        v-model="keyword" 
        id="keyword-input" 
        placeholder="e.g.: Appointment" 
        class="keyword-input"
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
const userName = ref('')
const keyword = ref('')

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      selectedOption.value = condition.details.option || null
      userName.value = condition.details.userName || ''
      keyword.value = condition.details.keyword || ''
    }
  }
})

// Select condition type
const selectOption = (option) => {
  selectedOption.value = option
  // Clear relevant inputs
  if (option === 'Receive Message from User') {
    keyword.value = ''
  } else if (option === 'Message Contains Keyword') {
    userName.value = ''
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
  const inputValue = event.target.value
  const inputType = selectedOption.value === 'Receive Message from User' ? 'userName' : 'keyword'
  addLog('Action Input', { 
    inputType: inputType, 
    input: inputValue 
  })
}

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id
  const fromPage = 'Message' // Current page name
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
      type: 'Message', 
      option: selectedOption.value, 
      userName: userName.value,
      keyword: keyword.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
    // Add log record: Submit condition
    addLog('Submit Condition', { 
      conditionId: id,
      option: selectedOption.value,
      userName: userName.value,
      keyword: keyword.value
    })
  }
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''

  // Describe the condition type
  if (selectedOption.value === 'Receive Message from User') {
    description += `Receive a message from the user "${userName.value}"`
  } else if (selectedOption.value === 'Message Contains Keyword') {
    description += `The received message contains the keyword "${keyword.value}"`
  }

  return description
}
</script>

<style scoped>
.message-condition-container {
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

.user-input, .keyword-input {
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