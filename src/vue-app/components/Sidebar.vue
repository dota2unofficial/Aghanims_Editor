<template>
    <v-navigation-drawer
        permanent
    >
        <v-list
            dense
            nav
        >
            <v-list-item
                v-for="item in categories" 
                :key="item"
                :class="{'active': item === activeKey}"
                @click="onItemChanged(item)"
            >
                <v-list-item-icon
                    class="mr-3"
                >
                    <v-img 
                        :src="getUnitAvatar(item, path)"
                        :width="24"
                        :height="24"
                    ></v-img>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import fileMixin from '../mixin/fileMixin'
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'Sidebar',
    mixins: [ fileMixin ],
    data: () => ({
        activeKey: '',
    }),
    computed: {
        ...mapGetters([
            'getPath',
            'getCategories'
        ]),
        path() {
            return this.getPath
        },
        categories() {
            return Object.keys(this.getCategories)
        },
    },
    methods: {
        ...mapMutations([
            'setDetails',
            'setSelected'
        ]),
        onItemChanged(item) {
            this.activeKey = item
            this.setSelected(item)
            this.setDetails(this.getCategories[item])
        },
    },
}
</script>

<style lang="scss" scoped>
</style>