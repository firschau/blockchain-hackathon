<template>
    <v-card class="ma-10">
        <v-card-title>Location</v-card-title>
        <v-card-subtitle>Check where your Energy comes from</v-card-subtitle>
        <div ref="map-root" style="width: 800px; height: 400px; margin: 20px"></div>
    </v-card>
</template>

<script>
import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'

export default {
    name: 'MapTest',
    components: {},
    props: {},
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
}
</script>
