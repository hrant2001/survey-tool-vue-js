<template>
    <div class="survey-listing-container">
      <div class="survey-listing-header">
        <h1 class="survey-listing-title">📋 Welcome to the Survey Tool</h1>
        <p class="survey-listing-subtitle">Select a survey to begin</p>
      </div>
  
      <div class="surveys-grid">
        <div v-if="surveys.length > 0">
          <router-link
            v-for="survey in surveys"
            :key="survey.id"
            :to="`/surveys/${survey.id}`"
            class="survey-card"
          >
            <div class="survey-card-content">
              <h2 class="survey-card-title">{{ survey.title }}</h2>
              <p v-if="survey.description" class="survey-card-description">{{ survey.description }}</p>
              <div class="survey-card-meta" v-if="survey.questionCount || survey.createdAt">
                <span v-if="survey.questionCount" class="meta-item">
                  <span class="meta-icon">❓</span>
                  {{ survey.questionCount }} questions
                </span>
                <span v-if="survey.createdAt" class="meta-item">
                  <span class="meta-icon">🗓️</span>
                  {{ formatDate(survey.createdAt) }}
                </span>
              </div>
              <div class="survey-card-action">
                <span class="take-survey-btn">Take Survey</span>
              </div>
            </div>
          </router-link>
        </div>
  
        <div v-else class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading available surveys...</p>
        </div>
      </div>
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
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  </script>
  
  <style scoped>
  .survey-listing-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
    background-color: #f8fafc;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    color: #333;
  }
  
  .survey-listing-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .survey-listing-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  .survey-listing-subtitle {
    color: #64748b;
    font-size: 1.1rem;
  }
  
  .surveys-grid {
    display: grid;
    gap: 1.5rem;
  }
  
  .survey-card {
    display: block;
    text-decoration: none;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;
  }
  
  .survey-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
  
  .survey-card-content {
    padding: 1.5rem;
  }
  
  .survey-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.75rem;
    transition: color 0.2s;
  }
  
  .survey-card:hover .survey-card-title {
    color: #3b82f6;
  }
  
  .survey-card-description {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }
  
  .survey-card-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .meta-icon {
    margin-right: 0.375rem;
  }
  
  .survey-card-action {
    display: flex;
    justify-content: flex-end;
  }
  
  .take-survey-btn {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .survey-card:hover .take-survey-btn {
    background-color: #2563eb;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
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
  
  @media (max-width: 640px) {
    .survey-listing-container {
      padding: 1.5rem 1rem;
    }
    
    .survey-listing-title {
      font-size: 1.75rem;
    }
    
    .survey-card-content {
      padding: 1.25rem;
    }
    
    .survey-card-title {
      font-size: 1.125rem;
    }
  }
  </style>