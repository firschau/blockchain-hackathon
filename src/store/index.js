import Vue from 'vue'
import Vuex from 'vuex'

import { identityContractsModule } from './modules/identityContracts'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    modules: {
        identityContracts: identityContractsModule,
    },
})

export default store
