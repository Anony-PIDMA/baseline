<!-- src/views/conditions/SpecificTime.vue -->
<template>
  <div class="specific-time-container">
    <h1 class="main-title">SpecificTime</h1>

    <!-- Specific time type selection -->
    <div class="section">
      <h2 class="section-title">Select Time Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Sunrise' }" 
          @click="selectOption('Sunrise')"
          class="option-button"
        >
          Sunrise
        </button>
        <button 
          :class="{ selected: selectedOption === 'Sunset' }" 
          @click="selectOption('Sunset')"
          class="option-button"
        >
          Sunset
        </button>
        <button 
          :class="{ selected: selectedOption === 'Specific Time' }" 
          @click="selectOption('Specific Time')"
          class="option-button"
        >
          Specific Time
        </button>
      </div>
    </div>

    <!-- Sunrise/Sunset time offset selection -->
    <div v-if="selectedOption === 'Sunrise' || selectedOption === 'Sunset'" class="section">
      <h2 class="section-title">Select Time Offset</h2>
      <div class="time-offsets">
        <label for="time-offset" class="offset-label">Time Offset:</label>
        <select v-model="timeOffset" class="offset-select" @change="onTimeOffsetChange">
          <option v-for="(offset, index) in timeOffsets" :key="index" :value="offset">
            {{ offset }}
          </option>
        </select>
      </div>
    </div>

    <!-- Specific time input -->
    <div v-if="selectedOption === 'Specific Time'" class="section">
      <h2 class="section-title">Enter Specific Time</h2>
      <input type="time" v-model="specificTime" id="specific-time" class="time-input" 
        @focus="onActionFocus" @input="onActionInput" />
    </div>

    <!-- Repeat settings -->
    <div class="section">
      <h2 class="section-title">Repeat Settings</h2>
      <div class="repeat-options">
        <button 
          :class="{ selected: repeatOption === 'Daily' }" 
          @click="selectRepeat('Daily')"
          class="repeat-button"
        >
          Daily
        </button>
        <button 
          :class="{ selected: repeatOption === 'Weekly' }" 
          @click="selectRepeat('Weekly')"
          class="repeat-button"
        >
          Weekly
        </button>
        <button 
          :class="{ selected: repeatOption === 'Monthly' }" 
          @click="selectRepeat('Monthly')"
          class="repeat-button"
        >
          Monthly
        </button>
      </div>
    </div>

    <!-- Weekly selection -->
    <div v-if="repeatOption === 'Weekly'" class="section">
      <h2 class="section-title">Select Weekdays</h2>
      <div class="week-selection">
        <label v-for="(day, index) in weekdays" :key="index" class="weekday-label">
          <input type="checkbox" v-model="selectedWeekdays" :value="day" class="weekday-checkbox" @change="onWeekdayChange" />
          {{ day }}
        </label>
      </div>
    </div>

    <!-- Monthly selection -->
    <div v-if="repeatOption === 'Monthly'" class="section">
      <h2 class="section-title">Select Specific Date</h2>
      <input 
        type="number" 
        v-model="selectedDate" 
        placeholder="Date (1 - 31)" 
        min="1" 
        max="31" 
        class="date-input" 
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
const repeatOption = ref(null)
const specificTime = ref(null)
const timeOffset = ref('At Sunrise') // Default to 'At Sunrise' or 'At Sunset'
const selectedWeekdays = ref([]) // Store selected weekdays
const selectedDate = ref(null) // Store selected date

// Weekday options
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Time offset options for sunrise and sunset
const sunriseOffsets = [
  "4 hours before sunrise", "3 hours before sunrise", "2 hours before sunrise", "1 hour before sunrise",
  "45 minutes before sunrise", "30 minutes before sunrise", "15 minutes before sunrise", "At sunrise",
  "15 minutes after sunrise", "30 minutes after sunrise", "45 minutes after sunrise", "1 hour after sunrise",
  "2 hours after sunrise", "3 hours after sunrise", "4 hours after sunrise"
]

const sunsetOffsets = [
  "4 hours before sunset", "3 hours before sunset", "2 hours before sunset", "1 hour before sunset",
  "45 minutes before sunset", "30 minutes before sunset", "15 minutes before sunset", "At sunset",
  "15 minutes after sunset", "30 minutes after sunset", "45 minutes after sunset", "1 hour after sunset",
  "2 hours after sunset", "3 hours after sunset", "4 hours after sunset"
]

// Currently selected time offset (dynamically changes based on sunrise or sunset selection)
const timeOffsets = ref([])

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      selectedOption.value = condition.details.option || null
      repeatOption.value = condition.details.repeat || null
      specificTime.value = condition.details.specificTime || null
      timeOffset.value = condition.details.timeOffset || (selectedOption.value === 'Sunrise'? 'At Sunrise' : 'At Sunset')
      selectedWeekdays.value = condition.details.selectedWeekdays || []
      selectedDate.value = condition.details.selectedDate || null
    }
  }

  // Initialize and update offset options based on the selected sunrise or sunset
  if (selectedOption.value === 'Sunrise') {
    timeOffsets.value = sunriseOffsets
  } else if (selectedOption.value === 'Sunset') {
    timeOffsets.value = sunsetOffsets
  }
})

// Select a specific time type (e.g., sunrise, sunset, specific time)
const selectOption = (option) => {
  selectedOption.value = option
  if (option === 'Sunrise') {
    timeOffsets.value = sunriseOffsets
    timeOffset.value = 'At Sunrise'
  } else if (option === 'Sunset') {
    timeOffsets.value = sunsetOffsets
    timeOffset.value = 'At Sunset'
  } else {
    timeOffsets.value = []
    timeOffset.value = null
  }
  if (option!== 'Specific Time') {
    specificTime.value = null
  }
  // Add log record: Select time type
  addLog('Select Time Option', { 
    selectedOption: option 
  })
}

// Select the repeat cycle
const selectRepeat = (repeat) => {
  repeatOption.value = repeat
  if (repeat!== 'Weekly') {
    selectedWeekdays.value = [] // Clear selected weekdays
  }
  if (repeat!== 'Monthly') {
    selectedDate.value = null // Clear the date
  }
  // Add log record: Select repeat cycle
  addLog('Select Repeat Option', { 
    repeatOption: repeat 
  })
}

// Select the time offset
const onTimeOffsetChange = () => {
  addLog('Select Time Offset', {
    timeOffset: timeOffset.value
  })
}

// Record when the input field gets focus
const onActionFocus = () => {
  addLog('Action Input Start')
}

// Record when input occurs in the input field
const onActionInput = (event) => {
  const inputValue = event.target.value
  let inputType = ''
  if (selectedOption.value === 'Specific Time') {
    inputType = 'specificTime'
  } else if (selectedOption.value === 'Sunrise' || selectedOption.value === 'Sunset') {
    inputType = 'timeOffset'
  }
  if (inputType) {
    addLog('Action Input', { 
      inputType: inputType, 
      input: inputValue 
    })
  }
}

// Select weekdays
const onWeekdayChange = () => {
  addLog('Select Weekdays', {
    selectedWeekdays: selectedWeekdays.value.join(', ')
  })
}

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id
  const fromPage = 'SpecificTime' // Current page name
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
      type: 'SpecificTime', 
      option: selectedOption.value, 
      repeat: repeatOption.value, 
      specificTime: specificTime.value,
      timeOffset: timeOffset.value,
      selectedWeekdays: selectedWeekdays.value,
      selectedDate: selectedDate.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
    // Add log record: Submit condition
    addLog('Submit Condition', { 
      conditionId: id,
      option: selectedOption.value,
      repeatOption: repeatOption.value,
      specificTime: specificTime.value,
      timeOffset: timeOffset.value,
      selectedWeekdays: selectedWeekdays.value,
      selectedDate: selectedDate.value
    })
  }
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''

  // Describe the time type
  if (selectedOption.value === 'Sunrise' || selectedOption.value === 'Sunset') {
    description += `${timeOffset.value}`
  } else if (selectedOption.value === 'Specific Time') {
    description += `Specific Time ${specificTime.value}`
  }

  // Describe the repeat settings
  if (repeatOption.value) {
    description += ' ('

    if (repeatOption.value === 'Daily') {
      description += 'Daily'
    } else if (repeatOption.value === 'Weekly') {
      description += `Weekly: ${selectedWeekdays.value.join(', ')}`
    } else if (repeatOption.value === 'Monthly') {
      description += `Monthly: ${selectedDate.value}th`
    }

    description += ')'
  }

  return description
}
</script>


<style scoped>
.specific-time-container {
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

.options,.repeat-options,.week-selection,.time-offsets {
  display: flex;
  flex-direction: column;
}

.week-selection {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
}

.option-button,.repeat-button {
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

.option-button.selected,.repeat-button.selected {
  background-color: #16a085; /* Selected state color */
}

.option-button:hover,.repeat-button:hover {
  background-color: #16a085;
}

.time-offsets {
  flex-direction: row;
  align-items: center;
}

.offset-label {
  margin-right: 10px;
  font-weight: bold;
  color: #34495e;
}

.offset-select {
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: #ffffff;
  color: #2c3e50;
}

.time-input,.date-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 1em;
}

.week-selection {
  display: flex;
  flex-wrap: wrap;
}

.weekday-label {
  width: 50%;
  margin-bottom: 10px;
  color: #34495e;
  text-align: left;
}

.weekday-checkbox {
  margin-right: 8px;
  transform: scale(1.2);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.confirm-button,.back-button {
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