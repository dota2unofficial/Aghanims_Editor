<template>
    <aside class="mod-sidebar">
        <ul class="mod-sidebar-list">
            <li
                v-for="item in treeData" 
                :key="item"
                class="mod-sidebar-item"
                :class="{'active': item === activeKey}"
                @click="onItemChanged(item)"
            >{{item}}</li>
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
        }
    },
    data: () => ({
        activeKey: '',
    }),
    methods: {
        onItemChanged(item) {
            this.activeKey = item
            this.$emit('itemChanged', item)
        }
    },
    computed: {
        treeData() {
            return Object.keys(this.categories);
        }
    },
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

        &:hover, &.active {
            background: #3598dc;
            color: #ffffff;
        }

    }
}
</style>