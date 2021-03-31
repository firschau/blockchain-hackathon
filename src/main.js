import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import router from './router'
import vuetify from './plugins/vuetify'

// Drizzle Adapter for vue
import drizzleVuePlugin from '@drizzle/vue-plugin'
import drizzleOptions from './plugins/drizzleOptions'
Vue.use(drizzleVuePlugin, { store, drizzleOptions })

Vue.config.productionTip = false

new Vue({
    store,
    router,
    vuetify,
    render: (h) => h(App),
}).$mount('#app')
