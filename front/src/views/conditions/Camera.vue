<!-- src/components/conditions/Camera.vue -->
<template>
  <div class="camera-condition-container">
    <h1 class="main-title">Camera</h1>

    

    <!-- Camera feed -->
    <div class="section-camera">
      <h2 class="section-title">Camera Feed</h2>
      <video ref="video" autoplay class="camera-feed" v-if = "!capturedImage"></video>
      <button @click="captureImage" class="capture-button" v-if = "!capturedImage">Capture</button>
      <img :src="capturedImage" alt="Captured Image" v-if="capturedImage" class="captured-image" />
    </div>

    <!-- Condition type selection -->
    <div class="section">
      <h2 class="section-title">Select Condition Type</h2>
      <div class="options">
        <button 
          :class="{ selected: selectedOption === 'Contains Object' }" 
          @click="selectOption('Contains Object')"
          class="option-button"
        >
          Camera contains object
        </button>
        <button 
          :class="{ selected: selectedOption === 'Is Scene' }" 
          @click="selectOption('Is Scene')"
          class="option-button"
        >
          Camera contains scene
        </button>
      </div>
    </div>

    <!-- Object name input box -->
    <div v-if="selectedOption === 'Contains Object'" class="section">
      <h2 class="section-title">Enter Object Category</h2>
      <input 
        type="text" 
        v-model="objectName" 
        id="object-input" 
        placeholder="e.g.: Shared bike" 
        class="object-input"
        @focus="onActionFocus"
        @input="onActionInput"
      />
    </div>

    <!-- Scene type input box -->
    <div v-if="selectedOption === 'Is Scene'" class="section">
      <h2 class="section-title">Enter Scene Description</h2>
      <input 
        type="text" 
        v-model="sceneType" 
        id="scene-input" 
        placeholder="e.g.: Park" 
        class="scene-input"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRuleStore } from '../../stores/ruleStore'
import { addLog } from '../../utils/logger'

const router = useRouter()
const route = useRoute()
const ruleStore = useRuleStore()

// Declare reactive data
const selectedOption = ref(null)
const objectName = ref('')
const sceneType = ref('')
const video = ref(null)
const capturedImage = ref(null)

// Load conditions based on the passed id
onMounted(() => {
  const id = route.query.id
  if (id) {
    const condition = ruleStore.conditions.find(c => c.id == id)
    if (condition) {
      selectedOption.value = condition.details.option || null
      objectName.value = condition.details.objectName || ''
      sceneType.value = condition.details.sceneType || ''
    }
  }
  // Start the camera
  startCamera()
})

onUnmounted(() => {
  // stopCamera()
})

// Select condition type
const selectOption = (option) => {
  selectedOption.value = option
  // Clear relevant inputs
  if (option === 'Contains Object') {
    sceneType.value = ''
  } else if (option === 'Is Scene') {
    objectName.value = ''
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
  const inputType = selectedOption.value === 'Contains Object' ? 'objectName' : 'sceneType'
  addLog('Action Input', { 
    inputType: inputType, 
    input: inputValue 
  })
}

// Navigate back to ConditionSelection.vue
const navigateBack = () => {
  const id = route.query.id
  const fromPage = 'Camera' // Current page name
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
      type: 'Camera', 
      option: selectedOption.value, 
      objectName: objectName.value,
      sceneType: sceneType.value,
      text: generateText()
    }
    ruleStore.updateConditionDetails(id, details)
  }
  // Add log record: Submit condition
  addLog('Submit Condition', { 
    conditionId: id,
    option: selectedOption.value,
    objectName: objectName.value,
    sceneType: sceneType.value
  })
  router.push({ name: 'Home' })
}

// Generate descriptive text
const generateText = () => {
  let description = ''

  // Describe the condition type
  if (selectedOption.value === 'Contains Object') {
    description += `The camera contains the object "${objectName.value}"`
  } else if (selectedOption.value === 'Is Scene') {
    description += `The camera shows the scene "${sceneType.value}"`
  }

  return description
}

// Start the camera
const startCamera = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
      video: {
        facingMode: 'environment', // Use the rear camera
      },
      // video: true,
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        video.value.srcObject = stream
      })
      .catch((error) => {
        console.error("Error accessing camera:", error)
      })
  }
}

// Stop the camera
const stopCamera = () => {
  if (video.value.srcObject) {
    const tracks = video.value.srcObject.getTracks()
    tracks.forEach(track => track.stop())
  }
}

// Capture the image
const captureImage = () => {
  const canvas = document.createElement("canvas")
  canvas.width = video.value.videoWidth
  canvas.height = video.value.videoHeight
  canvas.getContext("2d").drawImage(video.value, 0, 0, canvas.width, canvas.height)
  capturedImage.value = canvas.toDataURL("image/png")
  stopCamera()
}
</script>
<style scoped>
.camera-condition-container {
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

.object-input, .scene-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 1em;
  box-sizing: border-box;
}

/* .section-camera {
  height: 200px;
} */
.camera-feed {
  width: 100%;
  border-radius: 4px;
  margin-top: 10px;
  object-fit: cover;
}

.capture-button {
  padding: 10px 20px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.capture-button:hover {
  background-color: #16a085;
}

.captured-image {
  width: 100%;
  border-radius: 4px;
  margin-top: 10px;
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