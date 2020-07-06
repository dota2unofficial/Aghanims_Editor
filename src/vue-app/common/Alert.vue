<template>
    <v-dialog
        v-model="d2Found"
        persistent
        width="50vw"
    >
        <v-card>
            <v-card-title
                class="red white--text"
            >Dota 2 Not Found</v-card-title>

            <v-card-text>
                We can't find Dota 2 installed on your computer.
            </v-card-text>

            <v-card-actions>
                <input
                    type="file" 
                    webkitdirectory
                    multiple
                    directory
                    ref="folder"
                    style="display: none"
                    @change="setFolderPath"
                >
                <v-spacer></v-spacer>
                <v-btn
                    dense
                    outlined
                    small
                    color="primary"
                    @click="findD2Path"
                >Search again</v-btn>
                <v-btn
                    dense
                    outlined
                    small
                    color="primary"
                    @click="setCustomPath"
                >Choose Custom Path</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
    name: 'ErrorAlert',
    computed: {
        ...mapGetters([
            'getD2Found'
        ]),
        d2Found() {
            return !this.getD2Found
        },
    },
    data: () => ({
        d2Path: null,
    }),
    methods: {
        ...mapActions([
            'findD2Path',
        ]),
        ...mapMutations([
            'setD2Path',
            'setD2Found',
        ]),
        setCustomPath() {
            this.$refs.folder.click()
        },
        setFolderPath(evt) {
            if (evt.target.files.length < 1) return
            const file = evt.target.files[0]
            const path = file.path.split('\\').splice(0, file.path.split('\\').findIndex(item => item === 'game')).join('/')
            this.setD2Path(`${path}/game/`)
            this.setD2Found(true)
        }
    },
}
</script>