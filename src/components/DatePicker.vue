<template>
    <v-menu
        v-model="isDatePickerOpen"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="formattedDate"
                :label="label"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker v-model="dateString" @input="onDatePickerInput"></v-date-picker>
    </v-menu>
</template>

<script>
export default {
    name: 'DatePicker',

    props: {
        value: {
            type: Number,
            required: true,
        },
        label: {
            type: String,
            required: false,
            default: 'Date Input',
        },
    },

    data() {
        return {
            isDatePickerOpen: false,
            dateString: new Date(this.value).toISOString().substring(0, 10),
        }
    },

    computed: {
        formattedDate() {
            return new Date(this.dateString).toLocaleDateString()
        },
    },

    methods: {
        onDatePickerInput(newDate) {
            this.isDatePickerOpen = false

            this.$emit('input', +new Date(newDate))
        },
    },
}
</script>

<style></style>
