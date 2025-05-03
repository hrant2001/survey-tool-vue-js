<template>
    <div>
      <h1>Welcome to the Survey Tool</h1>
      <ul>
        <li v-for="survey in surveys" :key="survey.id">
          <router-link :to="`/surveys/${survey.id}`">
            {{ survey.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '../axios'

  const surveys = ref([])
  
  onMounted(async () => {
    try {
      const res = await api.get('/surveys')
      surveys.value = res.data
    } catch (err) {
      console.error('Failed to load surveys:', err)
    }
  })
  </script>
  