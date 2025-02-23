<!-- src/components/conditions/UsageTime.vue -->
<template>
  <div class="usage-time-condition-container">
    <h1 class="main-title">Usage Time</h1>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Condition Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Single Usage' }" 
          @click="selectOption('Single Usage')"
          class="option-button"
        >
          Single session usage of a specific app
        </button>
        <button 
          :class="{ selected: selectedOption === 'Total Usage Today' }" 
          @click="selectOption('Total Usage Today')"
          class="option-button"
        >
          Total usage of a specific app one day
        </button>
        <button 
          :class="{ selected: selectedOption === 'Total Phone Usage Today' }" 
          @click="selectOption('Total Phone Usage Today')"
          class="option-button"
        >
          Total phone usage one day
        </button>
      </div>
    </div>

    <!-- App name selection dropdown (only for single usage and total usage today) -->
    <div v-if="selectedOption === 'Single Usage' || selectedOption === 'Total Usage Today'" class="section">
      <h2 class="section-title">Select App</h2>
      <select v-model="appName" class="app-select" @change="onAppSelect">
        <option value="" disabled>Select an app</option>
        <option v-for="app in apps" :key="app.name" :value="app.name">{{ app.name }}</option>
      </select>
    </div>

    <!-- Usage time input box -->
    <div v-if="selectedOption" class="section">
      <h2 class="section-title">Enter Usage Time (minutes)</h2>
      <input 
        type="number" 
        v-model="usageTime" 
        id="time-input" 
        placeholder="e.g., 30" 
        min="1" 
        class="time-input"
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
import { ref, onMounted } from 'vue';
import { useRuleStore } from '../../stores/ruleStore';
import { addLog } from '../../utils/logger';
import getDeviceInfo from '../../utils/deviceInfo';

const router = useRouter();
const route = useRoute();
const ruleStore = useRuleStore();

// Declare reactive data
const selectedOption = ref(null);
const appName = ref('');
const usageTime = ref(null);
const apps = ref([]);

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id;
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id);
    if (condition) {
      selectedOption.value = condition.details.option || null;
      appName.value = condition.details.appName || '';
      usageTime.value = condition.details.usageTime || null;
    }
  }

  // Load the device info (apps, bluetooth, wifi, location)
  const deviceInfo = getDeviceInfo();
  apps.value = deviceInfo.apps;
});

// Select condition type
const selectOption = (option) => {
  selectedOption.value = option;
  // Clear relevant inputs
  if (option === 'Total Phone Usage Today') {
    appName.value = '';
  } else {
    // Keep appName
    // Clear usageTime
    usageTime.value = null;
  }
  // Add log record: Select condition type
  addLog('Select Condition Option', { 
    selectedOption: option 
  });
};

// Handle app selection
const onAppSelect = () => {
  // Add log record: App selected
  addLog('App Selected', { 
    selectedApp: appName.value 
  });
};

// Record when the input box gets focus
const onActionFocus = () => {
  addLog('Action Input Start');
};

// Record when input occurs in the input box
const onActionInput = (event) => {
  const inputValue = event.target.value;
  let inputType = '';
  if (selectedOption.value === 'Single Usage' || selectedOption.value === 'Total Usage Today') {
    inputType = 'appName';
  } else if (selectedOption.value === 'Total Phone Usage Today') {
    inputType = 'usageTime';
  }
  if (inputType) {
    addLog('Action Input', { 
      inputType: inputType, 
      input: inputValue 
    });
  }
};

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id;
  const fromPage = 'UsageTime'; // Current page name
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
    const details = { 
      type: 'UsageTime', 
      option: selectedOption.value, 
      appName: appName.value,
      usageTime: usageTime.value,
      text: generateText()
    };
    ruleStore.updateConditionDetails(id, details);
    // Add log record: Submit condition
    addLog('Submit Condition', { 
      conditionId: id,
      option: selectedOption.value,
      appName: appName.value,
      usageTime: usageTime.value
    });
  }
  router.push({ name: 'Home' });
};

// Generate descriptive text
const generateText = () => {
  let description = '';

  // Describe the condition type
  if (selectedOption.value === 'Single Usage') {
    description += `Single usage of the "${appName.value}" app reaches ${usageTime.value} minutes`;
  } else if (selectedOption.value === 'Total Usage Today') {
    description += `Total usage of the "${appName.value}" app today reaches ${usageTime.value} minutes`;
  } else if (selectedOption.value === 'Total Phone Usage Today') {
    description += `Total phone usage today reaches ${usageTime.value} minutes`;
  }

  return description;
};
</script>

<style scoped>
.usage-time-condition-container {
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

.app-input, .time-input {
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

.app-select, .time-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 1em;
  box-sizing: border-box;
}
</style>