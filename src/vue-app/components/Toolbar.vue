<template>
    <header class="mod-toolbar">
        <div class="mod-toolbar-item">
            <input type="file" ref="openFile" style="display: none" @change="readFile">
            <button @click="openFile">Open</button>
        </div>

        <div class="mod-toolbar-item">
            <button @click="saveFile">Save</button>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Toolbar',
    methods: {
        openFile() {
            const node = this.$refs.openFile
            node.click()
        },
        saveFile() {
            console.log('save file')
        },
        readFile(event) {
            const file = event.target.files[0]
            const reader = new FileReader()
            const path = file.path.split('/')
            path.pop()

            this.$emit('folderLoad', path.join('/')+'/data/content/panorama/images/custom_game/round_images/')
            reader.onload = e => this.loadFinished(e.target.result)
            reader.readAsText(file)
            event.target.value = null
        },
        loadFinished(result) {
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
            this.$emit('setCategories', root)
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