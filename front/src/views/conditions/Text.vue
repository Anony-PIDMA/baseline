<!-- src/components/conditions/Text.vue -->
<template>
  <div class="text-condition-container">
    <h1 class="main-title">Text Input</h1>

    <!-- Text command input box (always displayed) -->
    <div class="section">
      <h2 class="section-title">Enter Text Command</h2>
      <input 
        type="text" 
        v-model="textCommand" 
        id="text-input" 
        placeholder="e.g.: Make an appointment" 
        class="text-input"
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
const textCommand = ref('')

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      textCommand.value = condition.details.textCommand || ''
    }
  }
})

// Record when the input box gets focus
const onActionFocus = () => {
  addLog('Action Input Start')
}

// Record when input occurs in the input box
const onActionInput = (event) => {
  const inputValue = event.target.value
  addLog('Action Input', { 
    inputType: 'textCommand', 
    input: inputValue 
  })
}

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id
  const fromPage = 'Text' // Current page name
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
      type: 'Text', 
      textCommand: textCommand.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
    // Add log record: Submit condition
    addLog('Submit Condition', { 
      conditionId: id,
      textCommand: textCommand.value
    })
  }
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''

  // Describe the text command
  if (textCommand.value) {
    description += `The text command is "${textCommand.value}"`
  }

  return description
}
</script>

<style scoped>
.text-condition-container {
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

.text-input {
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