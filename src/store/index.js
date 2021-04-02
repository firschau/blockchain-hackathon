import Vue from 'vue'
import Vuex from 'vuex'

import { currentUserModule } from './modules/currentUser'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    modules: {
        currentUser: currentUserModule,
    },
})

export default store
