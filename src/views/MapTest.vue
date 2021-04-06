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
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'
// this is a simple triangle over the atlantic ocean
const data = {
    type: 'Feature',
    properties: {},
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [10.6360143, 49.10675],
                [10.16765, 49.09879],
                [9.0744, 48.991082],
                [8.33, 49.14],
            ],
        ],
    },
}
export default {
    name: 'MapTest',
    components: {},
    props: {},

    mounted() {
        const feature = new GeoJSON().readFeature(data, {
            // this is required since GeoJSON uses latitude/longitude,
            // but the map is rendered using “Web Mercator”
            featureProjection: 'EPSG:3857',
        })
        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [feature],
            }),
        })

        // this is where we create the OpenLayers map
        new Map({
            view: new View({
                zoom: 6,
                center: [9.99, 46.91],
                constrainResolution: true,
            }),
            // the map will be created using the 'map-root' ref
            target: this.$refs['map-root'],
            layers: [
                // adding a background tiled layer
                new TileLayer({
                    source: new OSM(), // tiles are served by OpenStreetMap
                }),
                vectorLayer,
            ],

            // the map view will initially show the whole world
        })
    },
}
</script>
