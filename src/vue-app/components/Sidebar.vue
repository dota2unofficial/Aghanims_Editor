<template>
    <aside class="mod-sidebar">
        <ul class="mod-sidebar-list">
            <li
                v-for="item in treeData" 
                :key="item"
                class="mod-sidebar-item"
                :class="{'active': item === activeKey}"
                @click="onItemChanged(item)"
            >
                <img 
                    :src="`file:///${getFileName(item)}`"
                    class="menu-icon"
                />
                {{item}}
            </li>
        </ul>
    </aside>
</template>

<script>

export default {
    name: 'Sidebar',
    props: {
        categories: {
            type: Object,
            required: true,
        },
        path: {
            type: String,
            required: true
        }
    },
    data: () => ({
        activeKey: '',
    }),
    computed: {
        treeData() {
            return Object.keys(this.categories);
        }
    },
    methods: {
        getFileName(file) {
            const name = file.replace('npc_dota_', '')
            return this.path + 'Round_' + name[0].toUpperCase() + name.slice(1) + '.png'
        },
        onItemChanged(item) {
            this.activeKey = item
            this.$emit('itemChanged', item)
        },
    },
    created() {
        console.log(window.location.href)
    }
}
</script>

<style lang="scss" scoped>
.mod-sidebar {
    width: 320px;
    overflow-x: scroll;
    min-height: calc(100vh - 49px);
    border-right: 1px solid #ccc;

    &-list {
        list-style-type: none;
        padding: 0;
    }

    &-item {
        cursor: pointer;
        transition: color .2s;
        padding: 4px 8px;
        display: flex;

        &:hover, &.active {
            background: #3598dc;
            color: #ffffff;
        }

    }

    .menu-icon {
        width: 20px;
        height: 20px;
        margin-right: 4px;
    }
}
</style>