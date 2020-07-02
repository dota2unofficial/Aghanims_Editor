<template>
    <v-app-bar
        app
        color="primary"
        dense
        dark
    >
        <input type="file" ref="openFile" style="display: none" @change="readFile">
        <v-btn 
            dark
            @click="openFile"
            small
            outlined
            class="mr-3"
        >
            Open
        </v-btn>
        <v-btn 
            dark
            @click="saveFile"
            small
            outlined
            class="mr-3"
        >
            Save
        </v-btn>
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
        ]),
    },
    data: () => ({
        fileName: null,
        fileContent: null,
    }),
    methods: {
        ...mapMutations([
            'setCategories',
            'setPath',
        ]),
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
                        if (pair.length > 1) {
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
        },
        readFile(event) {
            const file = event.target.files[0]
            const reader = new FileReader()
            const path = file.path.split('\\')
            path.pop()

            this.fileName = file.path
            this.setPath(path.join('/')+'/data/content/panorama/images/custom_game/round_images/')

            reader.onload = e => this.loadFinished(e.target.result)
            reader.readAsText(file)
            event.target.value = null
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
                        if (pair.length > 1) root[lineName][pair[1]] = pair[3]
                        j ++
                    }
                    i = j
                } else {
                    i ++
                }
            }
            this.setCategories(root)
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