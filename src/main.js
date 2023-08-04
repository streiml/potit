//import './assets/main.css'

import { createApp } from 'vue'
//import { createPinia } from 'pinia'
import store from './store'

import App from './App.vue'
import router from './router'

import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab)
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(far)

import 'animate.css'

const app = createApp(App)

app.config.globalProperties.$PlayerColor = {
  indigo: '#520dc2',
  cyan: '#0dcaf0',
  red: '#842029',
  green: '#0a3622',
  teal: '#20c997',
  purple: '#432874',
  pink: '#d63384',
  orange: '#fd7e14',
  yellow: '#cc9a06',
  gray: '#444444'
}

app
  .use(router)
  .use(store)
  .component('font-awesome-icon', FontAwesomeIcon)
  //.use(createPinia())
  .mount('#app')
