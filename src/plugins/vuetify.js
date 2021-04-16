import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

// some default colors
export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#000',
                accent: '#f90',
                gray: '#909090',
                white: '#FFFFFF',
                darkblueshade: '#011F30',
                darkyellow: '#AF7922',
            },
        },
    },
})
