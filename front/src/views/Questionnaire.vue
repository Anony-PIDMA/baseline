<template>
    <div class="questionnaire-container">
      <h1 class="questionnaire-title">反馈问卷</h1>
      <form @submit.prevent="submitQuestionnaire">
        <div class="form-group">
        <label for="rule-id">用户 ID：</label>
          <input 
            id="user-id" 
            v-model="userId" 
            type="text" 
            required 
            placeholder="请输入用户 ID"
            />
          <label for="rule-id">规则 ID：</label>
          <input 
            id="rule-id" 
            v-model="ruleId" 
            type="text" 
            required 
            placeholder="请输入规则 ID"
          />
        </div>
  
        <div v-for="(question, index) in questions" :key="index" class="form-group">
          <label :for="'question-' + index">{{ index + 1 }}. {{ question.text }}</label>
          <input 
            :id="'question-' + index" 
            v-model.number="answers[index]" 
            type="number" 
            min="1" 
            max="7" 
            required 
            placeholder="1-7"
          />
        </div>
  
        <button type="submit" class="submit-button">提交问卷</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { addLog, sendLogs } from '../utils/logger' // 确保路径正确
  
  const router = useRouter()
  const route = useRoute()
  const userId = ref('')
  const ruleId = ref('')
  const questions = ref([
    {
      text: '这条规则在你日常中常用程度怎么样？请回复1-7（1：非常不常用，7：非常常用）'
    },
    {
      text: '你对得到的规则满意程度如何？请回复1-7（1：非常不满意，7：非常满意）'
    },
    {
      text: '您在规则构建过程中，是否需要进行复杂的思考或决策？请回复1-7（1：非常复杂，7：非常简单）'
    },
    {
      text: '您是否感到在规则构建过程中需要进行麻烦的界面操作？请回复1-7（1：非常麻烦，7：非常轻松）'
    },
    {
      text: '在构建规则时，您是否感到有时间限制或紧迫感？请回复1-7（1：非常紧张，7：不紧张）'
    },
    {
      text: '您在构建规则时，感觉自己完成任务的能力如何？请回复1-7（1：效果非常差，7：效果非常佳）'
    },
    {
      text: '完成规则构建任务所需的思考过程和界面操作是否符合您的预期？请回复1-7（1：比预期麻烦很多，7：比预期简单很多）'
    },
    {
      text: '在构建规则时，您是否感到挫败感？请回复1-7（1：非常挫败，7：完全不挫败）'
    }
  ])
  
  const answers = ref(Array(8).fill(null))
  
  
  const submitQuestionnaire = () => {
    if (!userId.value.trim()) {
      alert('请填写用户 ID。')
      return
    }
    
    if (!ruleId.value.trim()) {
      alert('请填写规则 ID。')
      return
    }
    
    // 验证所有问题都已回答
    for (let i = 0; i < answers.value.length; i++) {
      const answer = answers.value[i]
      if (answer === null || answer < 1 || answer > 7) {
        alert(`请为问题 ${i + 1} 提供1-7的有效回答。`)
        return
      }
    }
  
    
  
    // 构建日志数据
    const logData = {
      userId: userId.value,
      ruleId: ruleId.value,
      responses: answers.value
    }
  
    console.log('提交的问卷数据:', logData)
    addLog("questionaire", logData)
  
    // 调用 sendLogs 函数发送日志
    sendLogs()
  
    // 提示用户提交成功
    alert('感谢您的反馈！')
  
    // 跳转回主页面或其他页面
    router.push({ name: 'Home' }) // 根据您的路由配置调整
  }
  </script>
  
  <style scoped>
  .questionnaire-container {
    padding: 30px;
    max-width: 700px;
    margin: 0 auto;
    background-color: #f9fafb;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .questionnaire-title {
    text-align: center;
    color: #34495e;
    margin-bottom: 40px;
    font-size: 2em;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
  }
  
  .form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-bottom: 5px;
    color: #2c3e50;
    font-size: 1.1em;
  }
  
  input[type="text"],
  input[type="number"] {
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1em;
    box-sizing: border-box;
  }
  
  .submit-button {
    width: 100%;
    padding: 15px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-button:hover {
    background-color: #2980b9;
  }
  </style>
  