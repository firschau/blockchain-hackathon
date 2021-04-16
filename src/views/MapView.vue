<template>
    <v-container>
        <v-card class="ma-10">
            <v-card-title style="">Plant Locations</v-card-title>
            <div ref="map-root" style="width: 100%; height: 600px"></div>
        </v-card>
        <!-- 
        <v-row class="text-center">
            <v-col justify="center"> </v-col>
        </v-row> -->
    </v-container>
</template>

<script>
import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

export default {
    name: 'MapView',

    data() {
        return {
            isNewConsumptionPlantDialogOpen: false,
            consumptionPlants: {},
            generationPlants: {},
        }
    },
    mounted() {
        // this is where we create the OpenLayers map
        new Map({
            // the map will be created using the 'map-root' ref
            target: this.$refs['map-root'],
            layers: [
                // adding a background tiled layer
                new TileLayer({
                    source: new OSM(), // tiles are served by OpenStreetMap
                }),
            ],

            // the map view will initially show the whole world
            view: new View({
                zoom: 0,
                center: [0, 0],
                constrainResolution: true,
            }),
        })
    },

    methods: {
        loadConsumptionPlants() {
            this.consumptionPlants = {}
            fetch('/api/consumptionPlants', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const activeUsersConsumptionPlants = data.filter((data) => data.owner === this.activeAccount)
                    activeUsersConsumptionPlants.forEach((plant) => {
                        this.$set(this.consumptionPlants, plant.idcAddress, plant)
                    })
                })
        },
        loadGenerationPlants() {
            this.generationPlants = {}
            fetch('/api/generationPlants', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const activeUsersGenerationPlants = data.filter((data) => data.owner === this.activeAccount)
                    activeUsersGenerationPlants.forEach((plant) => {
                        this.$set(this.generationPlants, plant.idcAddress, plant)
                    })
                })
        },
        // probably not needed
        addConsumptionPlant(consumptionPlant) {
            this.$set(this.consumptionPlants, consumptionPlant.idcAddress, consumptionPlant)
        },
    },
}
</script>
