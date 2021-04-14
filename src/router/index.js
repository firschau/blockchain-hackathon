import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Authorities from '../views/Authorities.vue'
import IdentityContracts from '../views/IdentityContracts.vue'
import GenerationPlants from '../views/GenerationPlants.vue'
import ConsumptionPlants from '../views/ConsumptionPlants.vue'
import Claims from '../views/admin/Claims.vue'
import SignGenerationPlants from '../views/admin/SignGenerationPlants.vue'
import SignConsumptionPlants from '../views/admin/SignConsumptionPlants.vue'

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
        path: '/generationPlants',
        component: GenerationPlants,
    },
    {
        path: '/consumptionPlants',
        component: ConsumptionPlants,
    },
    {
        path: '/signGenerationPlants',
        component: SignGenerationPlants,
    },
    {
        path: '/signConsumptionPlants',
        component: SignConsumptionPlants,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
