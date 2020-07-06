<template>
    <v-app-bar
        app
        color="primary"
        dark
    >
        <input type="file" ref="openFile" style="display: none" @change="readFile">
        <v-combobox
            v-model="selectedMod"
            :items="addonList"
            placeholder="Select your custom mod"
            dense
            hide-details
            outlined
            class="mr-5"
        >
        </v-combobox>
        <v-btn 
            dark
            @click="saveConfirm"
            outlined
            :disabled="fileName === null"
            class="mr-3"
        >
            Save
        </v-btn>
        <v-dialog
            v-model="confirmSave"
            persistent
        >
            <v-card>
                <v-card-title>Confirm Save</v-card-title>
                <v-card-text>Are you reall sure to save it?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined @click="confirmSave = false">Cancel</v-btn>
                    <v-btn color="primary" outlined @click="saveFile" :loading="loading">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app-bar>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { indent } from '../utils/text'
import fs from 'fs'

export default {
    name: 'Toolbar',
    computed: {
        ...mapGetters([
            'getCategories',
            'getFileLoading',
            'getD2Found',
            'getD2Path',
        ]),
    },
    data: () => ({
        fileName: null,
        fileContent: null,
        confirmSave: false,
        loading: false,
        dota2mods: [],
        addonList: [],
        selectedMod: null,
    }),
    methods: {
        ...mapMutations([
            'setFileLoading',
            'setCategories',
            'setPath',
            'setD2Found',
        ]),
        saveConfirm() {
            this.confirmSave = true
        },
        openFile() {
            const node = this.$refs.openFile
            node.click()
        },
        saveFile() {
            const lines = this.fileContent.split('\n')

            let i = 5
            while (i < lines.length - 1) {
                const line = lines[i].trim()
                if (line[0] === '"' && lines[i + 1].trim()[0] === '{' && line.length > 0) {
                    const lineName = lines[i].split('"')[1]
                    root[lineName] = {}
                    let j = i + 2
                    
                    while (lines[j].trim()[0] !== '}') {
                        const pair = lines[j].trim().split('"')
                        let text = ''
                        if (pair.length > 1 && this.getCategories[lineName][pair[1]]) {
                            text = indent(`"${pair[1]}" "${indent(this.getCategories[lineName][pair[1]], 1, 8)}"`, 2, 8)
                            lines[j] = text;
                        }
                        j ++
                    }
                    i = j
                } else {
                    i ++
                }
            }

            const result = lines.join("\r\n")
            fs.writeFile(this.fileName, result, err => {
                if (err) throw err
            })

            this.loading = false
            this.confirmSave = false
        },
        readFile(unitpath) {
            this.setFileLoading(true)
            fs.readFile(unitpath, 'utf8', (err, data) => {
                if (err) throw err;
                this.loadFinished(data)
            })
        },
        loadFinished(result) {
            this.fileContent = result
            const lines = result.split('\n')
            const items = []
            items[lines[3].substring(1, lines[3].length - 1)] = {}

            let root = items[lines[3].substring(1, lines[3].length - 1)]
            let i = 5
            while (i < lines.length - 1) {
                const line = lines[i].trim()
                if (line[0] === '"' && lines[i + 1].trim()[0] === '{' && line.length > 0) {
                    const lineName = lines[i].split('"')[1]
                    root[lineName] = {}
                    let j = i + 2
                    
                    while (lines[j].trim()[0] !== '}') {
                        const pair = lines[j].trim().split('"')
                        if (pair.length > 1 && pair[3]) root[lineName][pair[1]] = pair[3].trim()
                        j ++
                    }
                    i = j
                } else {
                    i ++
                }
            }
            this.setCategories(root)
            this.setFileLoading(false)
        }
    },
    watch: {
        getD2Found(found) {
            const d2path = this.getD2Path
            fs.readdir(`${d2path}/dota_addons/`, (err, files) => {
                if (err) {
                    this.setD2Found(false)
                }
                this.addonList = files
            })
        },
        selectedMod(folder) {
            const path = this.getD2Path + '/dota_addons/' + folder
            const unitPath = `${path}/scripts/npc/npc_units_custom.txt`
            console.log(this.getD2Path + folder)
            this.readFile(unitPath)
        }
    }
}
</script>

<style lang="scss" scoped>
.mod-toolbar {
    padding: 12px;
    background-color: #3598dc;
    display: flex;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);

    &-item {
        margin: 0 8px;
    }

    button {
        border: 1px solid #fff;
        border-radius: 8px;
        padding: 4px 12px;
        background: transparent;
        color: #fff;
        outline: 0;
        cursor: pointer;
        transition: all .2s;

        &:hover {
            background: #fff;
            color: #3598dc;
        }
    }
}
</style>