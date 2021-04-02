import Vue from 'vue'
import Vuex from 'vuex'

import { currentUserModule } from './modules/currentUser'
import { identityContractsModule } from './modules/identityContracts'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    modules: {
        identityContracts: identityContractsModule,
        currentUser: currentUserModule,
    },
})

export default store
