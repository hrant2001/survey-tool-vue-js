<template>
    <form @submit.prevent="submitSurvey">
      <div v-for="(question, index) in questions" :key="index" class="question-block">
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
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '../axios'
  
  const questions = ref([
    { id: 1, text: 'The survey was clear and easy to follow.' },
    { id: 2, text: 'The content was relevant to me.' },
    { id: 3, text: 'I would recommend this survey to others.' },
    { id: 4, text: 'I found the interface user-friendly.' },
    { id: 5, text: 'I was able to complete the survey quickly.' },
  ])
  
  const ratings = ref([])
  const answers = ref(Array(questions.value.length).fill(null))
  
  onMounted(async () => {
    try {
      const res = await api.get('/ratings')
      ratings.value = res.data
    } catch (err) {
      console.error('Failed to load ratings:', err)
    }
  })
  
  const submitSurvey = async () => {
    try {
      const payload = questions.value.map((q, i) => ({
        questionId: q.id,
        ratingId: answers.value[i],
      }))
      await api.post('/surveys/1/responses', payload)
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
  