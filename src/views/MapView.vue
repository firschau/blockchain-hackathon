<template>
    <v-container>
        <v-card class="ma-10">
            <v-card-title style="">Plant Locations</v-card-title>
            <div ref="map-root" style="width: 100%; height: 600px"></div>
            <div ref="container" class="ol-popup">
                <a href="#" ref="closer" class="ol-popup-closer"></a>
                <div ref="content" id="content"></div>
            </div>
        </v-card>
    </v-container>
</template>

<script>
import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import LayerVector from 'ol/layer/Vector'
import SourceVector from 'ol/source/Vector'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'

export default {
    name: 'MapView',

    data() {
        return {
            consumptionPlants: {},
            generationPlants: {},
            map: null,
            generationStyle: new Style({
                image: new Icon({
                    imgSize: [20, 20],
                    src: 'wind-turbine.svg',
                }),
            }),
            consumptionStyle: new Style({
                image: new Icon({
                    imgSize: [20, 20],
                    src: 'home.svg',
                }),
            }),
        }
    },

    mounted() {
        const karlsruheGPS = [8.40436, 49.013941] //first Long then Lat !
        // this is where we create the OpenLayers map

        this.map = new Map({
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
                zoom: 7,
                center: fromLonLat(karlsruheGPS),
                constrainResolution: true,
            }),
        })

        // load json-server data
        this.loadConsumptionPlants()
        this.loadGenerationPlants()
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
                    // add layers for consumption plants
                    this.addLayers(data, 'consumption')
                    data.forEach((plant) => {
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
                    // add layers for generation plants
                    this.addLayers(data, 'generation')
                    data.forEach((plant) => {
                        this.$set(this.generationPlants, plant.idcAddress, plant)
                    })
                })
        },

        // add markers to the map for the given plant types
        addLayers(plants, type) {
            const features = []

            // style depending on plant type
            const style = type === 'generation' ? this.generationStyle : this.consumptionStyle

            plants.forEach((plant) => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat([plant.long, plant.lat])),
                    style,
                })

                feature.setStyle(style)

                features.push(feature)
            })

            if (this.map && features.length) {
                var layer = new LayerVector({
                    source: new SourceVector({
                        features: features,
                    }),
                })
                this.map.addLayer(layer)
            }
        },
    },
}
</script>
