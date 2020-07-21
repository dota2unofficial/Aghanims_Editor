<template>
    <v-app-bar
        app
        color="primary"
        dark
    >
        <v-select
            v-model="selectedMod"
            :items="addonList"
            placeholder="Select your custom mod"
            dense
            hide-details
            outlined
            class="mr-5"
        ></v-select>
        <v-btn 
            dark
            @click="saveConfirm"
            outlined
            class="mr-3"
        >
            Save
        </v-btn>

        <v-btn 
            dark
            @click="showDebugger"
            outlined
        >
            Show Debugger
        </v-btn>

        <v-dialog
            v-model="confirmSave"
            persistent
        >
            <v-card>
                <v-card-title>Confirm Save</v-card-title>
                <v-card-text>Are you really sure to save it?</v-card-text>
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
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { indent } from '../utils/text'
import fs, { lstatSync, readdirSync } from 'fs'
import path from 'path'
import chardet from 'chardet'
const vdfplus = require('vdfplus')
import vdfextra from 'vdf-extra'

export default {
    name: 'Toolbar',
    computed: {
        ...mapGetters([
            'getCategories',
            'getFileLoading',
            'getD2Found',
            'getD2Path',
            'getHeros',
            'getEntities'
        ]),
    },
    props: {
        localization: {
            type: Object,
            required: true,
        }
    },
    data: () => ({
        fileName: null,
        fileContent: null,
        confirmSave: false,
        loading: false,
        dota2mods: [],
        addonList: [],
        selectedMod: null,
        isDebugger: false,
    }),
    methods: {
        ...mapMutations([
            'setFileLoading',
            'setPath',
            'setD2Found',
            'setHeros',
            'setAbilities',
            'setItems',
            'setAbilitiesOverride',
            'setPrecache',
            'setEntities',
        ]),
        ...mapActions([
            'addDebugLogs',
            'loadCustomLocalization',
            'analyzeFullEntities'
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
            this.addDebugLogs(`Custom Units Saved.`)
        },
        showDebugger() {
            this.$emit('toggleDebugger')
        }
    },
    watch: {
        getD2Found(found) {
            const d2path = this.getD2Path
            try {
                const files = readdirSync(`${d2path}\\dota_addons\\`, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)
                .filter(dirent => {
                    const filePath = `${d2path}\\dota_addons\\${dirent}\\resource\\addon_english.txt`
                    if (fs.existsSync(filePath)) return true
                    return false
                })
                this.addDebugLogs(`Dota2 mods List`)
                this.addDebugLogs(files.toString())
                this.addDebugLogs(`Dota2 is found on your pc.`)
                this.addonList = files
                this.addonList = files.map(file => {
                    const filePath = `${d2path}\\dota_addons\\${file}\\resource\\addon_english.txt`
                    const encoding = chardet.detectFileSync(filePath)
                    const result = fs.readFileSync(filePath, encoding)
                    const root = vdfextra.parse(result, {parseUnquotedStrings: true})
                    return {
                        value: file,
                        text: root.Tokens['addon_game_name'] ? root.Tokens['addon_game_name'] : file
                    }
                })
            } catch (err) {
                this.addDebugLogs(`Dota2 : `, err)
                throw err
            }
        },
        selectedMod(folder) {
            this.analyzeFullEntities(folder)
        },
        
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