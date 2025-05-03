<template>
  <form @submit.prevent="submitSurvey">
    <div v-for="(question, index) in questions" :key="index" class="question-block">
      <p>{{ question }}</p>
      <div class="likert">
        <label v-for="n in 5" :key="n">
          <input
            type="radio"
            :name="'q' + index"
            :value="n"
            v-model="answers[index]"
            required
          />
          {{ n }}
        </label>
      </div>
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import api from '../axios'

const questions = [
  'The survey was clear and easy to follow.',
  'The content was relevant to me.',
  'I would recommend this survey to others.',
  'I found the interface user-friendly.',
  'I was able to complete the survey quickly.',
]

const answers = ref(Array(questions.length).fill(null))

const submitSurvey = async () => {
  try {
    console.log(answers.value);
    const temp = [
  { "questionId": 1, "ratingId": 1 },
  { "questionId": 2, "ratingId": 1 },
  { "questionId": 3, "ratingId": 3 },
  { "questionId": 4, "ratingId": 2 },
  { "questionId": 5, "ratingId": 1 }
];
    await api.post('/surveys/1/responses', temp)
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
}
</style>
