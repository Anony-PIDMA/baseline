<template>
  <div class="time-range-condition-container">
    <h1 class="main-title">Time Period</h1>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Condition Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Within the range' }" 
          @click="selectOption('Within the range')"
          class="option-button"
        >
          Within the range
        </button>
        <button 
          :class="{ selected: selectedOption === 'Outside the range' }" 
          @click="selectOption('Outside the range')"
          class="option-button"
        >
          Outside the range
        </button>
        <button 
          :class="{ selected: selectedOption === 'After a certain time' }" 
          @click="selectOption('After a certain time')"
          class="option-button"
        >
          After a certain time
        </button>
        <button 
          :class="{ selected: selectedOption === 'Before a certain time' }" 
          @click="selectOption('Before a certain time')"
          class="option-button"
        >
          Before a certain time
        </button>
      </div>
    </div>

    <!-- Time input boxes -->
    <div class="section">
      <h2 class="section-title" v-if="showTimeInput">Set Time Period</h2>
      <div class="time-inputs">
        <!-- Start time input box, only displayed when "Within the range", "Outside the range" or "After a certain time" is selected -->
        <div class="time-input-group" v-if="showBeginTime">
          <label for="begin-time">Start Time</label>
          <input 
            type="time" 
            v-model="beginTime" 
            id="begin-time" 
            class="time-input"
            @focus="onBeginTimeFocus"
            @input="onBeginTimeInput"
          />
        </div>
        <!-- End time input box, only displayed when "Within the range", "Outside the range" or "Before a certain time" is selected -->
        <div class="time-input-group" v-if="showEndTime">
          <label for="end-time">End Time</label>
          <input 
            type="time" 
            v-model="endTime" 
            id="end-time" 
            class="time-input"
            @focus="onEndTimeFocus"
            @input="onEndTimeInput"
          />
        </div>
      </div>
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
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useRuleStore } from '../../stores/ruleStore';
import { addLog } from '../../utils/logger';

const router = useRouter();
const route = useRoute();
const ruleStore = useRuleStore();

// Declare reactive data
const selectedOption = ref(null);
const repeatOption = ref(null);
const beginTime = ref('');
const endTime = ref('');
const selectedWeekdays = ref([]);
const selectedDate = ref(null);

// Weekday options
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Computed properties to determine whether to show start time and end time input boxes
const showBeginTime = computed(() => {
  return selectedOption.value === 'Within the range' ||
         selectedOption.value === 'Outside the range' ||
         selectedOption.value === 'After a certain time';
});

const showEndTime = computed(() => {
  return selectedOption.value === 'Within the range' ||
         selectedOption.value === 'Outside the range' ||
         selectedOption.value === 'Before a certain time';
});

const showTimeInput = computed(() => {
  return selectedOption.value === 'Within the range' ||
         selectedOption.value === 'Outside the range' ||
         selectedOption.value === 'Before a certain time' ||
         selectedOption.value === 'After a certain time';
});

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id;
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id);
    if (condition) {
      selectedOption.value = condition.details.option || null;
      repeatOption.value = condition.details.repeat || null;
      beginTime.value = condition.details.begin_time || '';
      endTime.value = condition.details.end_time || '';
      selectedWeekdays.value = condition.details.selectedWeekdays || [];
      selectedDate.value = condition.details.selectedDate || null;
    }
  }
});

// Select condition type
const selectOption = (option) => {
  selectedOption.value = option;
  // Clear corresponding time inputs according to the option
  if (option === 'After a certain time') {
    endTime.value = '';
  } else if (option === 'Before a certain time') {
    beginTime.value = '';
  } else if (!option) {
    beginTime.value = '';
    endTime.value = '';
  }
  // Add log record: Select condition type
  addLog('Select Option', { 
    selectedOption: option 
  });
};

// Select the repeat cycle
const selectRepeat = (repeat) => {
  repeatOption.value = repeat;
  if (repeat !== 'Weekly') {
    selectedWeekdays.value = []; // Clear selected weekdays
  }
  if (repeat !== 'Monthly') {
    selectedDate.value = null; // Clear the date
  }
  // Add log record: Select repeat cycle
  addLog('Select Repeat Option', { 
    repeatOption: repeat 
  });
};

// Select weekdays
const onWeekdayChange = () => {
  addLog('Select Weekdays', {
    selectedWeekdays: selectedWeekdays.value.join(', ')
  });
};

// Record when the input field gets focus
const onActionFocus = () => {
  addLog('Action Input Start');
};

// Record when input occurs in the input field
const onActionInput = (event) => {
  const inputValue = event.target.value;
  let inputType = '';
  if (selectedOption.value === 'Specific Time') {
    inputType = 'specificTime';
  } else if (selectedOption.value === 'Sunrise' || selectedOption.value === 'Sunset') {
    inputType = 'timeOffset';
  }
  if (inputType) {
    addLog('Action Input', { 
      inputType: inputType, 
      input: inputValue 
    });
  }
};

// Record when the start time input box gets focus
const onBeginTimeFocus = () => {
  addLog('Begin Time Input Start');
};

// Record when input occurs in the start time input box
const onBeginTimeInput = (event) => {
  addLog('Begin Time Input', { input: event.target.value });
};

// Record when the end time input box gets focus
const onEndTimeFocus = () => {
  addLog('End Time Input Start');
};

// Record when input occurs in the end time input box
const onEndTimeInput = (event) => {
  addLog('End Time Input', { input: event.target.value });
};

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id;
  const fromPage = 'TimeRange'; // Current page name
  addLog('Go Back', { 
    from: fromPage, 
    to: 'ConditionSelection' 
  });
  router.push({ name: 'ConditionSelection', query: { id } });
};

// Confirm the selection and return
const confirmSelection = () => {
  const id = parseInt(route.query.id);
  if (!isNaN(id)) {
    // Time validation
    if ((selectedOption.value === 'Within the range' || selectedOption.value === 'Outside the range') && beginTime.value && endTime.value) {
      if (beginTime.value >= endTime.value) {
        addLog('Time Validation Error', { beginTime: beginTime.value, endTime: endTime.value });
        alert('The start time must be earlier than the end time.');
        return;
      }
    }
    if (selectedOption.value === 'After a certain time' && !beginTime.value) {
      addLog('Validation Error', { message: 'The start time cannot be empty.' });
      alert('Please select a start time.');
      return;
    }
    if (selectedOption.value === 'Before a certain time' && !endTime.value) {
      addLog('Validation Error', { message: 'The end time cannot be empty.' });
      alert('Please select an end time.');
      return;
    }

    const details = { 
      type: 'TimeRange', 
      option: selectedOption.value, 
      repeat: repeatOption.value, 
      begin_time: showBeginTime.value ? beginTime.value : null,
      end_time: showEndTime.value ? endTime.value : null,
      selectedWeekdays: selectedWeekdays.value,
      selectedDate: selectedDate.value,
      text: generateText()
    };
    ruleStore.updateConditionDetails(id, details);
    // Add log record: Submit condition
    addLog('Submit Condition', { 
      conditionId: id,
      option: selectedOption.value,
      repeatOption: repeatOption.value,
      begin_time: beginTime.value,
      end_time: endTime.value,
      selectedWeekdays: selectedWeekdays.value,
      selectedDate: selectedDate.value
    });
  }
  router.push({ name: 'Home' });
};

// Generate descriptive text
const generateText = () => {
  let description = '';

  // Describe the condition type
  if (selectedOption.value) {
    description += `${selectedOption.value} `;
    if (selectedOption.value === 'Within the range' || selectedOption.value === 'Outside the range') {
      description += `between ${beginTime.value} and ${endTime.value}`;
    } else if (selectedOption.value === 'After a certain time') {
      description += `after ${beginTime.value}`;
    } else if (selectedOption.value === 'Before a certain time') {
      description += `before ${endTime.value}`;
    }
  }

  // Describe the repeat settings
  if (repeatOption.value) {
    description += ' (';

    if (repeatOption.value === 'Daily') {
      description += 'Daily';
    } else if (repeatOption.value === 'Weekly') {
      description += `Weekly: ${selectedWeekdays.value.join(', ')}`;
    } else if (repeatOption.value === 'Monthly') {
      description += `Monthly: ${selectedDate.value}th`;
    }

    description += ')';
  }

  return description;
};
</script>

<style scoped>
.time-range-condition-container {
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

.options, .repeat-options, .week-selection {
  display: flex;
  flex-direction: column;
}

.week-selection {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.option-button, .repeat-button {
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

.option-button.selected, .repeat-button.selected {
  background-color: #16a085; /* Selected state color */
}

.option-button:hover, .repeat-button:hover {
  background-color: #16a085;
}

.time-inputs {
  display: flex;
  flex-direction: column;
}

.time-input-group {
  margin-bottom: 15px;
}

.time-input-group label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
  font-size: 1em;
}

.time-input, .date-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
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