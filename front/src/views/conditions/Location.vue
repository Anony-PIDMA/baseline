<template>
  <div class="location-condition-container">
    <h1 class="main-title">Location</h1>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Condition Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Arriving at' }" 
          @click="selectOption('Arriving at')"
          class="option-button"
        >
          Arriving at
        </button>
        <button 
          :class="{ selected: selectedOption === 'Leaving' }" 
          @click="selectOption('Leaving')" 
          class="option-button"
        >
          Leaving
        </button>
        <button 
          :class="{ selected: selectedOption === 'Be at' }" 
          @click="selectOption('Be at')" 
          class="option-button"
        >
          Be at
        </button>
        <button 
          :class="{ selected: selectedOption === 'Not be at' }" 
          @click="selectOption('Not be at')" 
          class="option-button"
        >
          Not be at
        </button>
      </div>
    </div>

    <!-- Baidu Map for location selection -->
    <div class="section" v-if="selectedOption">
      <h2 class="section-title">Select Location</h2>
          <!-- Search box for location search -->
      <div class="section">
        <input 
          type="text" 
          v-model="searchQuery"
          @keyup.enter="searchLocation"
          class="search-box" 
          placeholder="Search for a place"
        />
      </div>
      <div id="baidu-map" style="width: 100%; height: 200px;"></div>
      <div id="results" style="width: 100%;  overflow: auto;"></div>
      <div v-if="location">
        <p>Selected Location: {{ location }}</p>
      </div>
    </div>

    <!-- Slider for distance -->
    <div class="section" v-if="selectedOption">
      <h2 class="section-title">Set Distance</h2>
      <input 
        type="range" 
        v-model="distance"
        min="0" 
        max="200" 
        step="10"
        class="slider"
      />
      <p>Selected Distance: {{ distance }} meters</p>
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
import { loadBaiduMapScript } from '../../map.js';

const router = useRouter();
const route = useRoute();
const ruleStore = useRuleStore();

const selectedOption = ref(null);
const location = ref('');
const searchQuery = ref('');
const distance = ref(100);
let mapInstance = null;
let markerInstance = null;

onMounted(() => {
  const id = route.query.id;
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id);
    if (condition) {
      selectedOption.value = condition.details.option || null;
      location.value = condition.details.location || '';
      distance.value = condition.details.distance || 100;
    }
  }
});

const initBaiduMap = (BMap) => {
  mapInstance = new BMap.Map("baidu-map");
  const point = new BMap.Point(116.404, 39.915); // Default coordinates (Beijing)
  mapInstance.centerAndZoom(point, 15); // Set initial zoom level and center
  mapInstance.enableScrollWheelZoom(true); // Enable scroll zoom

  markerInstance = new BMap.Marker(point); // Create marker
  mapInstance.addOverlay(markerInstance); // Add marker to map

  mapInstance.addEventListener("click", (e) => {
    const lat = e.point.lat;
    const lng = e.point.lng;

    location.value = `Latitude: ${lat}, Longitude: ${lng}`;
    addLog('Map Clicked', { lat, lng });

    // Update marker position
    markerInstance.setPosition(new BMap.Point(lng, lat));
  });
};

const searchLocation = () => {
  if (!searchQuery.value) {
    return;
  }

  const localSearch = new BMap.LocalSearch(mapInstance, {
    renderOptions: { map: mapInstance, panel: "results" },
  });

  localSearch.search(searchQuery.value); // Start the search
    // Define a callback function to handle search results
    localSearch.setSearchCompleteCallback(function(results) {
    const poi = results.getPoi(0); // Get the first result
    if (poi) {
      const address = poi.title;  // Retrieve the address of the result
      location.value = `${address}`;
      addLog('Search Result', { address });
      console.log('Found Address: ', address);
    }
  });
};
const selectOption = (option) => {
  selectedOption.value = option;
  location.value = '';
  addLog('Select Option', { selectedOption: option });
  loadBaiduMapScript('IKptEff3JURCfNtVjMNMOUJk1grLFnZi').then(BMap => {
    initBaiduMap(BMap);
  }).catch(err => {
    console.error("Failed to load Baidu Maps script:", err);
  });
};

const navigateBack = () => {
  const id = route.query.id;
  addLog('Go Back', { from: 'Location', to: 'ConditionSelection' });
  router.push({ name: 'ConditionSelection', query: { id } });
};

const confirmSelection = () => {
  const id = parseInt(route.query.id);
  if (!isNaN(id)) {
    const details = {
      type: 'Location',
      option: selectedOption.value,
      location: location.value,
      text: generateText()
    };
    ruleStore.updateConditionDetails(id, details);
  }
  addLog('Submit Condition', { condition: generateText() });
  router.push({ name: 'Home' });
};

const generateText = () => {
  let description = '';
  if (selectedOption.value) {
    description += `${selectedOption.value} "${location.value}" in "${distance.value}" meters`;
  }

  return description;
};
</script>

<style scoped>
.location-condition-container {
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


.section-title {
  text-align: left;
  color: #2c3e50;
  font-size: 1.5em;
  margin-bottom: 15px;
}

.search-box {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  margin-bottom: 10px;
}

.options {
  display: flex;
  flex-direction: column;
}

.option-button {
  margin: 5px 0;
  padding: 12px 20px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s;
}

.option-button.selected {
  background-color: #16a085;
}

.option-button:hover {
  background-color: #16a085;
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

.slider {
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}
</style>