<template>
    <div v-if="survey">
      <h2>{{ survey.title }}</h2>
  
      <form @submit.prevent="submitSurvey">
        <div v-for="(question, index) in survey.questions" :key="question.id" class="question-block">
          <p>{{ question.text }}</p>
          <div class="likert">
            <label v-for="rating in ratings" :key="rating.id">
              <input
                type="radio"
                :name="'q' + index"
                :value="rating.id"
                v-model="answers[index]"
                required
              />
              {{ rating.label }}
            </label>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
    <div v-else>
      <p>Loading survey...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '../axios'
  
  const route = useRoute()
  const surveyId = route.params.id
  
  const survey = ref(null)
  const ratings = ref([])
  const answers = ref([])
  
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
  
  const submitSurvey = async () => {
    try {
      const payload = survey.value.questions.map((q, i) => ({
        questionId: q.id,
        ratingId: answers.value[i],
      }))
  
      await api.post(`/surveys/${surveyId}/responses`, payload)
      alert('Thank you for your feedback!')
    } catch (error) {
      console.error('Failed to submit survey', error)
      alert('An error occurred. Please try again.')
    }
  }
  </script>
  
  <style scoped>
  .question-block {
    margin-bottom: 1em;
  }
  .likert {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  </style>  