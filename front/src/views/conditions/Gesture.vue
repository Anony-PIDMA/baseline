<!-- src/components/conditions/Gesture.vue -->
<template>
  <div class="gesture-condition-container">
    <h1 class="main-title">Gesture</h1>

    <!-- Gesture selection -->
    <div class="section">
      <h2 class="section-title">Detected Gesture</h2>
      <div class="gestures">
        <label v-for="(gesture, index) in gestureOptions" :key="index" class="gesture-label">
          <input 
            type="radio" 
            v-model="selectedGesture" 
            :value="gesture" 
            class="gesture-radio" 
            @change="handleGestureChange(gesture)"
          />
          {{ gesture }}
        </label>
      </div>
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
const selectedGesture = ref(null)

// Gesture options
const gestureOptions = [
  'Shake: shake the phone',
  'DoubleTap: tap the back of the phone twice',
  'Spin: rotate the phone 360 ​​degrees parallel to the ground',
]

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      selectedGesture.value = condition.details.selectedGesture || null
    }
  }
})

// Handle gesture selection change and log
const handleGestureChange = (gesture) => {
  addLog('Select Gesture', { selectedGesture: gesture })
}

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id
  const fromPage = 'Gesture' // Current page name
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
      type: 'Gesture', 
      selectedGesture: selectedGesture.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
    // Add log record: Submit condition
    addLog('Submit Condition', { 
      conditionId: id,
      selectedGesture: selectedGesture.value
    })
  }
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''

  // Describe the gesture
  if (selectedGesture.value) {
    description += `Detected gesture "${selectedGesture.value}"`
  }

  return description
}
</script>

<style scoped>
.gesture-condition-container {
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

.gestures {
  display: flex;
  flex-direction: column;
}

.gesture-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #34495e;
  justify-content: flex-start;  /* Aligns content to the left */
  width: 100%;  /* Ensure it takes up the full width */
  text-align: left;  /* Explicitly align text to the left */
}


.gesture-radio {
  margin-right: 10px;
  transform: scale(1.2);
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