<template>
    <v-navigation-drawer
        permanent
        ref="drawer"
        :width="navigationWidth"
    >
        <v-sheet
            class="pa-2"
        >
            <v-text-field 
                dense 
                hide-details
                outlined
                v-model="filterString"
            ></v-text-field>
        </v-sheet>
        <v-treeview 
            :items="treeNodes"
            dense
            open-on-click
            selected-color="primary"
            hoverable
            activatable
            item-key="name"
            @update:active="onItemChanged"
        >
            <template v-slot:label="{ item }">
                <span @click="onItemChanged(item.name)">
                    {{ customLocalization(item.name) }}
                </span>
            </template>
            <template v-slot:prepend="{ item, leaf }">
                <v-img
                    v-if="leaf"
                    src="/images/units/electron.png"
                    :width="24"
                    :height="24"
                ></v-img>
                <v-icon v-else>{{mdiParent}}</v-icon>
            </template>
        </v-treeview>
    </v-navigation-drawer>
</template>

<script>
import fileMixin from '../mixin/fileMixin'
import localizationMixin from '../mixin/localizationMixin'
import { mapGetters, mapMutations, mapActions } from 'vuex'

import { mdiAlienOutline  } from '@mdi/js'

export default {
    name: 'Sidebar',
    mixins: [
        fileMixin,
        localizationMixin,
    ],
    data: () => ({
        activeKey: '',
        navigationWidth: 300,
        filterString: '',
        mdiParent: mdiAlienOutline,
    }),
    props: {
        localization: {
            type: Object,
            required: true,
        }
    },
    computed: {
        ...mapGetters([
            'getPath',
            'getCategories',
            'getHeros',
            'getTokens',
            'getCustomLocalization',
        ]),
        path() {
            return this.getPath
        },
        categories() {
            return Object.keys(this.getCategories).filter(key => key.includes(this.filterString)).sort((first, next) => {
                if (this.customLocalization(first) < this.customLocalization(next)) return -1
                return 1
            })
        },
        heros() {
            return Object.keys(this.getHeros).filter(key => key.includes(this.filterString)).sort((first, next) => {
                if (this.customLocalization(first) < this.customLocalization(next)) return -1
                return 1
            })
        },
        treeNodes() {
            return [
                {
                    id: "CUSTOM_UNITS",
                    name: 'Units :',
                    children: this.categories.map(item => ({id: item, name: item}))
                },
                {
                    id: "CUSTOM_HEROS",
                    name: 'Heros :',
                    children: this.heros.map(item => ({id: item, name: item}))
                }
            ]
        },
    },
    methods: {
        ...mapMutations([
            'setDetails',
            'setSelected'
        ]),
        ...mapActions([
            'addDebugLogs'
        ]),
        onItemChanged(item) {
            if (item[0] === 'Units :' || item[0] === 'Heros: ') return
            this.activeKey = item[0]
            this.setSelected(item[0])
            if (this.getCategories[item[0]])
                this.setDetails(this.getCategories[item[0]])
            else
                this.setDetails(this.getHeros[item[0]])
            this.addDebugLogs(`Custom Unit ${item} is loaded.`)
        },
        setBorderWidth() {
            const node = this.$refs.drawer.$el.querySelector('.v-navigation-drawer__border')
            node.style.width = `3px`
            node.style.cursor = 'ew-resize'
            node.style.backgroundColor = 'primary'
        },
        setDragEvents() {
            const minSize = 3
            const el = this.$refs.drawer.$el
            const drawerBorder = el.querySelector('.v-navigation-drawer__border')
            const vm = this
            const direction = 'left'

            const resize = (e) => {
                document.body.style.cursor = 'ew-resize'
                el.style.width = `${e.clientX}px`
            }

            drawerBorder.addEventListener(
                'mousedown',
                (e) => {
                    if (e.offsetX < 3) {
                        el.style.transition = 'initial'
                        document.addEventListener('mousemove', resize, false)
                        this.addDebugLogs(`Sidebar is resized.`)
                    }
                },
                false
            )

            document.addEventListener(
                'mouseup',
                () => {
                    el.style.transition = ''
                    document.body.style.cursor = ''
                    this.navigationWidth = el.style.width
                    document.removeEventListener('mousemove', resize, false)
                }
            )
        },
        customLocalization(key) {
            if (this.localization[key]) return this.localization[key]
            if (this.getCustomLocalization[key]) return this.getCustomLocalization[key]
            return key
        }
    },
    mounted() {
        this.setBorderWidth()
        this.setDragEvents()
    },
}
</script>

<style lang="scss" scoped>
</style>