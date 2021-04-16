<template>
    <v-container>
        <v-card class="ma-10">
            <v-card-title style="">Plant Locations</v-card-title>
            <div ref="map-root" style="width: 100%; height: 600px"></div>
            <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
            </div>
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
import { fromLonLat } from 'ol/proj'
var container = document.getElementById('popup')
var content = document.getElementById('popup-content')
var closer = document.getElementById('popup-closer')

// import ol from 'ol'
//import Geom from 'ol/geom'

import Feature from 'ol/Feature'
import LayerVector from 'ol/layer/Vector'
import SourceVector from 'ol/source/Vector'
import Point from 'ol/geom/Point'
import Overlay from 'ol/Overlay'
//import Source from 'ol/source'
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
        const karlsruheGPS = [8.40436, 49.013941] //first Long then Lat !
        // this is where we create the OpenLayers map

        var map = new Map({
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

        var layer = new LayerVector({
            source: new SourceVector({
                features: [
                    new Feature({
                        geometry: new Point(fromLonLat(karlsruheGPS)),
                    }),
                ],
            }),
        })
        map.addLayer(layer)

        var overlay = new Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
        })
        map.addOverlay(overlay)

        closer.onclick = function () {
            overlay.setPosition(undefined)
            closer.blur()
            return false
        }

        map.on('singleclick', function (event) {
            if (map.hasFeatureAtPixel(event.pixel) === true) {
                var coordinate = event.coordinate

                content.innerHTML = '<b>Plant ID-23323</b>'
                overlay.setPosition(coordinate)
            } else {
                overlay.setPosition(undefined)
                closer.blur()
            }
        })

        // var layer = new ol.layer.Vector({
        //     source: new ol.source.Vector({
        //         features: [
        //             new ol.Feature({
        //                 geometry: new ol.geom.Point(ol.proj.fromLonLat([4.35247, 50.84673])),
        //             }),
        //         ],
        //     }),
        // })
        // map.addLayer(layer)
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
