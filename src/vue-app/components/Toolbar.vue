<template>
    <v-app-bar
        app
        color="primary"
        dark
    >
        <input type="file" ref="openFile" style="display: none" @change="readFile">
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
            :disabled="fileName === null"
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
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { indent } from '../utils/text'
import fs, { lstatSync, readdirSync } from 'fs'
import path from 'path'
import chardet from 'chardet'
import parseKV from 'parse-kv'
const vdfplus = require('vdfplus')

export default {
    name: 'Toolbar',
    computed: {
        ...mapGetters([
            'getCategories',
            'getFileLoading',
            'getD2Found',
            'getD2Path',
            'getHeros'
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
            'setCategories',
            'setPath',
            'setD2Found',
            'setHeros',
            'setAbilities',
            'setItems',
            'setAbilitiesOverride',
            'setPrecache'
        ]),
        ...mapActions([
            'addDebugLogs',
            'loadCustomLocalization'
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
        readFile(unitpath) {
            this.setFileLoading(true)
            fs.readFile(unitpath, 'utf8', (err, data) => {
                if (err) {
                    this.setFileLoading(false)
                    throw err
                }
                this.loadFinished(data)
            })
        },
        readHeros(heropath) {
            this.setFileLoading(true)
            fs.readFile(heropath, 'utf8', (err, data) => {
                if (err) {
                    this.setFileLoading(false)
                    throw err
                }
                this.loadHeroFinished(data)
            })
        },
        readAbilities(abilitiesPath) {
            this.setFileLoading(true)
            fs.readFile(abilitiesPath, 'utf8', (err, data) => {
                if (err) {
                    this.setFileLoading(false)
                    throw err
                }
                this.loadAbilitiesFinished(data)
            })
        },
        readAbilitiesOverride(override) {
            this.setFileLoading(true)
            fs.readFile(override, 'utf8', (err, data) => {
                if (err) {
                    this.setFileLoading(false)
                    throw err
                }
                this.loadAbilitiesOverrideFinished(data)
            })
        },
        readItems(itemsPath) {
            this.setFileLoading(true)
            fs.readFile(itemsPath, 'utf8', (err, data) => {
                if (err) {
                    this.setFileLoading(false)
                    throw err
                }
                this.loadItemsFinished(data)
            })
        },
        readPrecache(precache) {
            this.setFileLoading(true)
            fs.readFile(precache, 'utf8', (err, data) => {
                if (err) {
                    this.setFileLoading(false)
                    throw err
                }
                this.loadPrecacheFinished(data)
            })
        },
        loadFinished(result) {
            const root = vdfplus.parse(result)
            this.setCategories(root.DOTAUnits)
            this.setFileLoading(false)
        },
        loadHeroFinished(result) {
            const root = vdfplus.parse(result)
            this.setHeros(root.DOTAHeroes)
            this.setFileLoading(false)
        },
        loadAbilitiesFinished(result) {
            const root = vdfplus.parse(result)
            this.setAbilities(root.DOTAAbilities)
            this.setFileLoading(false)
        },
        loadItemsFinished(result) {
            const root = vdfplus.parse(result)
            this.setItems(root.DOTAAbilities)
            this.setFileLoading(false)
        },
        loadAbilitiesOverrideFinished(result) {
            const root = vdfplus.parse(result)
            this.setAbilitiesOverride(root.DOTAAbilities)
            this.setFileLoading(false)
        },
        loadPrecacheFinished(result) {
            const root = vdfplus.parse(result)
            this.setPrecache(root.DOTAUnits)
            this.setFileLoading(false)
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
                    const lines = result.split('\n')

                    let root = {}
                    let i = 3
                    while (i < lines.length - 1) {
                        const line = lines[i].trim()
                        const arr = line.split(`"`)
                        if (arr[1] === "addon_game_name") {
                            return {
                                value: file,
                                text: arr[3]
                            }
                        }
                        i ++
                    }
                })
            } catch (err) {
                this.addDebugLogs(`Dota2 : `, err)
            }
        },
        selectedMod(folder) {
            const path = this.getD2Path + '\\dota_addons\\' + folder
            const unitPath = `${path}\\scripts\\npc\\npc_units_custom.txt`
            const heroPath = `${path}\\scripts\\npc\\npc_heroes_custom.txt`
            const abilitiesPath = `${path}\\scripts\\npc\\npc_abilities_custom.txt`
            const itemsPath = `${path}\\scripts\\npc\\npc_items_custom.txt`
            const abilitiesOverridePath = `${path}\\scripts\\npc\\npc_abilities_override.txt`
            const precachePath = `${path}\\scripts\\npc\\npc_unit_precache.txt`
            this.addDebugLogs(`${folder} mod is loaded.`)
            this.loadCustomLocalization(folder)
            this.readFile(unitPath)
            this.readHeros(heroPath)
            this.readAbilities(abilitiesPath)
            this.readItems(itemsPath)
            this.readAbilitiesOverride(abilitiesOverridePath)
            this.readPrecache(precachePath)
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