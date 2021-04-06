<template>
    <v-card class="ma-6">
        <v-card-title>Neue Erzeugungsanlage erstellen</v-card-title>
        <v-form v-model="valid">
            <v-container>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="plant_name" label="Name der Anlage" required> </v-text-field>
                    </v-col>
                    <v-col>
                        <v-select v-model="plant_type" :items="items" label="Art der Anlage" required></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field v-model="plant_location" label="Lokation der Anlage" required></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="plant_image_url" label="Foto der Anlage" required></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn class="ma-4" type="submit"> Anlage erstellen </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-card>
</template>

<script>
/*
import { mapGetters, mapState } from 'vuex'
import { claimTypes, claimTypeToName } from '../utils/claims'
import { getNewContract } from '../utils/drizzle'
import IdentityContract from '../contracts/IdentityContract.json'
import Distributor from '../contracts/Distributor.json' */

export default {
    name: 'GenerationPlant',
    data() {
        return {
            plant_name: '',
            plant_type: '',
            plant_location: '',
            plant_image_url: '',
            // Automatisch generiert:
            issuer: '',
            items: ['Photovoltaikanlage', 'Windkraftanlage', 'Biogasanlage', 'Atomkraftwerk', 'Braunkohlekraftwerk'],
            example_images: {
                photovoltaik: [
                    'https://www.verbraucherzentrale.de/sites/default/files/styles/article_full_image_desktop/public/2019-10/AdobeStock_268782123.jpg?h=8e07be04&itok=UNOsnwZ-',
                    'https://www.maschinenring.de/uploads/tx_semrnews/170-Newsmeldung-Photovoltaik-800x473-min_01.png',
                    'https://www.eon.de/content/dam/eon/eon-de-zwei/images/solar/haus-mit-solaranlage-abends/haus-mit-solaranlage-abends_2x1.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg',
                ],
                windkraft: [
                    'https://upload.wikimedia.org/wikipedia/commons/f/f3/20090808_l_xl_wiki_1938.jpg',
                    'https://www.scinexx.de/wp-content/uploads/n/o/nordseewindg.jpg',
                    'https://mar.prod.image.rndtech.de/var/storage/images/maz/brandenburg/streit-um-riesige-windraeder-hoeher-schneller-und-nerviger/687541451-9-ger-DE/Hoeher-schneller-und-nerviger_big_teaser_article.jpg',
                ],
                biogas: [
                    'https://www.umweltbundesamt.de/sites/default/files/medien/376/bilder/biogasanlage_bildautor_kletr_fotolia_162162835_l_0.jpg',
                    'https://cdn0.scrvt.com/fb8496fd305492cbfa1c87030c44a4e8/51f4b8d95c9cb8c7/aa08c02f7e23/heizungsarten_gasheizung_wissen_biogasanlage.jpg',
                    'https://www.biobg.de/bilder/2015/10/biogasanlage.jpg',
                ],
                atomkraft: [
                    'https://cdn.prod.www.spiegel.de/images/501aad5c-0001-0004-0000-000000089739_w920_r1.77_fpx70.04_fpy49.99.jpg',
                    'https://www.toptarif.de/bilder/atomkraftwerk_0201w1000_8233.jpg',
                    'https://www.capital.de/wp-content/uploads/2020/10/akw-isar2-imago0100179313h.jpg',
                ],
                kohlekraft: [
                    'https://www.handelsblatt.com/images/braunkohlekraftwerk/23595868/3-format2020.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Coal-fired_power_station_Werdohl_Elverlingsen_Germany.jpg/1200px-Coal-fired_power_station_Werdohl_Elverlingsen_Germany.jpg',
                    'https://www.uniper.energy/sites/default/files/styles/hero_tablet_portrait/public/hero-power-plant-datteln4_0.jpg?itok=XcSdiNO8',
                ],
            },
        }
    },
    methods: {
        submit() {
            // Identity Contract erstellen und Adresse + andere Daten an JSON Server schicken
        },
    },
}
</script>
