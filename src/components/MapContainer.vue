<script>
import GeoJSON from 'ol/format/GeoJSON'

import Map from 'ol/Map'

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
    // ...

    mounted() {
        new Map({
            // ...
            // ...
        })
    },
}
</script>
