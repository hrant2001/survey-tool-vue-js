import { createRouter, createWebHistory } from 'vue-router'
import SurveyForm from '../components/SurveyForm.vue'
import SurveyList from '../components/SurveyList.vue'

const routes = [
  { path: '/', component: SurveyList },
  { path: '/surveys/:id', component: SurveyForm },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
