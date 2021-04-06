import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Claims from '../views/Claims.vue'
import Authorities from '../views/Authorities.vue'
import IdentityContracts from '../views/IdentityContracts.vue'
import GenerationPlant from '../views/GenerationPlant.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/claims',
        component: Claims,
    },
    {
        path: '/authorities',
        component: Authorities,
    },
    {
        path: '/identityContracts',
        component: IdentityContracts,
    },
    {
        path: '/generationPlant',
        component: GenerationPlant,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
