import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

// Todo: Update this when publishing
// import drizzleVuePlugin from '@drizzle/vue-plugin'
//
import drizzleVuePlugin from '@drizzle/vue-plugin'
import drizzleOptions from './drizzleOptions'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.use(Vuex)
const store = new Vuex.Store({ state: {} })

Vue.use(drizzleVuePlugin, { store, drizzleOptions })

Vue.config.productionTip = false

new Vue({
    store,
    router,
    vuetify,
    render: (h) => h(App),
}).$mount('#app')
