<template>
    <div class="survey-container">
      <div v-if="showThankYou" class="thank-you-container">
        <div class="thank-you-card">
          <div class="thank-you-icon">✓</div>
          <h1 class="thank-you-title">Thank You!</h1>
          <p class="thank-you-message">Your feedback has been successfully submitted.</p>
          <button @click="returnToHome" class="return-button">Return to Home Page</button>
        </div>
      </div>
      
      <div v-else-if="survey" class="survey-content">
        <div class="survey-header">
          <h1 class="survey-title">{{ survey.title }}</h1>
          <p class="survey-description" v-if="survey.description">{{ survey.description }}</p>
        </div>
  
        <form @submit.prevent="validateAndSubmit" class="survey-form" novalidate>
          <!-- Validation Warning -->
          <div v-if="showValidationWarning" class="warning-message">
            <div class="warning-icon">!</div>
            <div class="warning-text">
              <p class="warning-title">Please complete all questions</p>
              <p class="warning-details">All questions require a response before submission.</p>
            </div>
          </div>
  
          <div v-for="(question, index) in survey.questions" :key="question.id" class="question-card">
            <h3 class="question-text">{{ question.text }}</h3>
            
            <div class="likert-scale">
              <div class="likert-labels">
                <span v-for="rating in ratings" :key="rating.id" class="rating-label">
                  {{ rating.label }}
                </span>
              </div>
              
              <div class="likert-options">
                <label v-for="rating in ratings" :key="rating.id" class="rating-option">
                  <input
                    type="radio"
                    :name="'q' + index"
                    :value="rating.id"
                    v-model="answers[index]"
                  />
                  <span class="radio-custom"></span>
                </label>
              </div>
            </div>
            
            <!-- Question-specific validation warning -->
            <p v-if="validationAttempted && answers[index] === null" class="field-validation-warning">
              Please select an option
            </p>
          </div>
          
          <div class="survey-actions">
            <button type="submit" class="submit-button">Submit Survey</button>
          </div>
          
          <div v-if="submitError" class="error-message">
            {{ submitError }}
          </div>
        </form>
      </div>
      
      <div v-else class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading survey...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import api from '../axios'
  
  const route = useRoute()
  const router = useRouter()
  const surveyId = route.params.id
  
  const survey = ref(null)
  const ratings = ref([])
  const answers = ref([])
  const showThankYou = ref(false)
  const submitError = ref(null)
  const validationAttempted = ref(false)
  const showValidationWarning = ref(false)
  
  onMounted(async () => {
    try {
      const [surveyRes, ratingsRes] = await Promise.all([
        api.get(`/surveys/${surveyId}`),
        api.get('/ratings')
      ])
  
      survey.value = surveyRes.data
      ratings.value = ratingsRes.data
      answers.value = Array(survey.value.questions.length).fill(null)
    } catch (err) {
      console.error('Error loading survey or ratings', err)
    }
  })
  
  const isFormValid = computed(() => {
    return answers.value.every(answer => answer !== null)
  })
  
  const validateAndSubmit = async () => {
    validationAttempted.value = true
    
    if (!isFormValid.value) {
      showValidationWarning.value = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    showValidationWarning.value = false
    await submitSurvey()
  }
  
  const submitSurvey = async () => {
    try {
      const payload = survey.value.questions.map((q, i) => ({
        questionId: q.id,
        ratingId: answers.value[i],
      }))
  
      await api.post(`/surveys/${surveyId}/responses`, payload)
      showThankYou.value = true
    } catch (error) {
      console.error('Failed to submit survey', error)
      submitError.value = 'An error occurred. Please try again.'
    }
  }
  
  const returnToHome = () => {
    router.push('/')
  }
  </script>
  
  <style scoped>
  .survey-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    color: #333;
  }
  
  .survey-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .survey-title {
    font-size: 2rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  .survey-description {
    color: #5d6778;
    font-size: 1.1rem;
  }
  
  .question-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: transform 0.2s;
  }
  
  .question-card:hover {
    transform: translateY(-3px);
  }
  
  .question-text {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }
  
  .likert-scale {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .likert-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem;
  }
  
  .rating-label {
    font-size: 0.9rem;
    color: #64748b;
    text-align: center;
    flex: 1;
  }
  
  .likert-options {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
  
  .rating-option {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    cursor: pointer;
  }
  
  .rating-option input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .radio-custom {
    height: 24px;
    width: 24px;
    background-color: #edf2f7;
    border-radius: 50%;
    display: inline-block;
    transition: all 0.2s;
    border: 2px solid #cbd5e0;
  }
  
  .rating-option:hover .radio-custom {
    background-color: #e2e8f0;
  }
  
  .rating-option input:checked ~ .radio-custom {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }
  
  .survey-actions {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .submit-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
  }
  
  .submit-button:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
  }
  
  .submit-button:active {
    transform: translateY(0);
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: #64748b;
  }
  
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #3b82f6;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .thank-you-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  
  .thank-you-card {
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 3rem 2rem;
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .thank-you-icon {
    background-color: #4ade80;
    color: white;
    width: 80px;
    height: 80px;
    font-size: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }
  
  .thank-you-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1rem;
  }
  
  .thank-you-message {
    font-size: 1.125rem;
    color: #64748b;
    margin-bottom: 2rem;
  }
  
  .return-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.875rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .return-button:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
  }
  
  .return-button:active {
    transform: translateY(0);
  }
  
  .error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #fee2e2;
    border-left: 4px solid #ef4444;
    color: #b91c1c;
    border-radius: 4px;
  }
  
  .warning-message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #fff3cd;
    border-radius: 8px;
    border-left: 4px solid #fbbf24;
  }
  
  .warning-icon {
    background-color: #fbbf24;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .warning-text {
    flex: 1;
  }
  
  .warning-title {
    font-weight: 600;
    color: #92400e;
    margin: 0 0 0.25rem 0;
  }
  
  .warning-details {
    color: #92400e;
    margin: 0;
    font-size: 0.9rem;
  }
  
  .field-validation-warning {
    color: #b45309;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
  
  @media (max-width: 640px) {
    .survey-container {
      padding: 1rem;
    }
    
    .question-card {
      padding: 1.25rem;
    }
    
    .rating-label {
      font-size: 0.8rem;
    }
    
    .radio-custom {
      height: 20px;
      width: 20px;
    }
    
    .thank-you-card {
      padding: 2rem 1.5rem;
    }
    
    .thank-you-icon {
      width: 60px;
      height: 60px;
      font-size: 30px;
    }
    
    .thank-you-title {
      font-size: 1.75rem;
    }
  }
  </style>