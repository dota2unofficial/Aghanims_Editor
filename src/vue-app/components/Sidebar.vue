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
                <span @click="onItemChanged(item.name)">{{ item.name }}</span>
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
import { mapGetters, mapMutations } from 'vuex'

import { mdiAlienOutline  } from '@mdi/js'

export default {
    name: 'Sidebar',
    mixins: [ fileMixin ],
    data: () => ({
        activeKey: '',
        navigationWidth: 300,
        filterString: '',
        mdiParent: mdiAlienOutline,
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
            return Object.keys(this.getCategories).filter(key => key.includes(this.filterString))
        },
        treeNodes() {
            return [
                {
                    id: "CUSTOM_UNITS",
                    name: 'Units :',
                    children: this.categories.map(item => ({ id: item, name: item }))
                }
            ]
        }
    },
    methods: {
        ...mapMutations([
            'setDetails',
            'setSelected'
        ]),
        onItemChanged(item) {
            if (item[0] === 'Units :') return
            this.activeKey = item[0]
            this.setSelected(item[0])
            this.setDetails(this.getCategories[item[0]])
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
    },
    mounted() {
        this.setBorderWidth()
        this.setDragEvents()
    },
}
</script>

<style lang="scss" scoped>
</style>