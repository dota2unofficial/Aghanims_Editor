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
                <span>
                    {{ customLocalization(item.name) }}
                </span>
            </template>
            <template v-slot:prepend="{ item, leaf }">
                <v-img
                    v-if="leaf"
                    :src="getHeroAvatar(item.name)"
                    :width="24"
                    :height="24"
                    tile
                    contain
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
            'getAbilities',
            'getItems',
            'getAbilitiesOverride',
            'getTokens',
            'getCustomLocalization',
            'getDetails',
            'getPrecache',
        ]),
        path() {
            return this.getPath
        },
        categories() {
            return Object.keys(this.getCategories).filter(key => key.includes(this.filterString) && key !== 'Version').sort((first, next) => {
                if (this.customLocalization(first) < this.customLocalization(next)) return -1
                return 1
            })
        },
        heros() {
            return Object.keys(this.getHeros).filter(key => key.includes(this.filterString) && key !== 'Version').sort((first, next) => {
                if (this.customLocalization(first) < this.customLocalization(next)) return -1
                return 1
            })
        },
        abilities() {
            return Object.keys(this.getAbilities).filter(key => key.includes(this.filterString) && key !== 'Version').sort((first, next) => {
                if (this.customLocalization(first) < this.customLocalization(next)) return -1
                return 1
            })
        },
        overrideAbilities() {
            return Object.keys(this.getAbilitiesOverride).filter(key => key.includes(this.filterString) && key !== 'Version').sort((first, next) => {
                if (this.customLocalization(first) < this.customLocalization(next)) return -1
                return 1
            })
        },
        items() {
            return Object.keys(this.getItems).filter(key => key.includes(this.filterString) && key !== 'Version').sort((first, next) => {
                if (this.customLocalization(first) < this.customLocalization(next)) return -1
                return 1
            })
        },
        precache() {
            return Object.keys(this.getPrecache).filter(key => key.includes(this.filterString) && key !== 'Version').sort((first, next) => {
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
                },
                {
                    id: "CUSTOM_Abilities",
                    name: 'Abilities :',
                    children: this.abilities.map(item => ({id: item, name: item}))
                },
                {
                    id: "CUSTOM ITEMS",
                    name: 'Items :',
                    children: this.items.map(item => ({id: item, name: item}))
                },
                {
                    id: "CUSTOM_ABILITIES",
                    name: 'Override Abilities :',
                    children: this.overrideAbilities.map(item => ({id: item, name: item}))
                },
                {
                    id: "CUSTOM_PRECACHE",
                    name: 'Precache :',
                    children: this.precache.map(item => ({id: item, name: item}))
                }
            ]
        },
    },
    methods: {
        ...mapMutations([
            'setDetails',
            'setSelected',
            'setCurrentAvatar'
        ]),
        ...mapActions([
            'addDebugLogs'
        ]),
        onItemChanged(item) {
            if (item.length === 0) {
                this.setSelected("")
                return
            }
            if (item[0] === 'Units :' || item[0] === 'Heros: ' || item[0] === 'Override Abilities :' || item[0] === 'Precache :') return
            this.setSelected(item[0])
            if (this.categories.findIndex(category => category === item[0]) > -1)
                this.setDetails(this.getCategories[item[0]])
            else if (this.heros.findIndex(hero => hero === item[0]) > -1)
                this.setDetails(this.getHeros[item[0]])
            else if (this.abilities.findIndex(category => category === item[0]) > -1)
                this.setDetails(this.getAbilities[item[0]])
            else if (this.items.findIndex(category => category === item[0]) > -1)
                this.setDetails(this.getItems[item[0]])
            else if (this.overrideAbilities.findIndex(hero => hero === item[0]) > -1)
                this.setDetails(this.getAbilitiesOverride[item[0]])
            else {
                this.setDetails(this.getPrecache[item[0]])
            }
            this.addDebugLogs(`Custom Unit ${item} is loaded.`)

            const hero = item[0]
            const defaultPath = `file:\\${process.cwd()}\\${process.env.NODE_ENV === 'development' ? '' : 'resources\\'}assets`

            if (this.categories.findIndex(category => category === hero) >= 0) {
                this.setCurrentAvatar(`${defaultPath}\\${this.getCategories[hero].Model.split('/').join('\\').replace('.vmdl', '.png')}`)
            } else if (this.precache.findIndex(precache => precache === hero) >= 0) {
                this.setCurrentAvatar(`${defaultPath}\\heroes\\${hero.replace('npc_precache_', '')}_png.png`)
            } else if (this.heros.findIndex(heroName => heroName === hero) >= 0) {
                if (!this.getHeros[hero.override_hero]) {
                    this.setCurrentAvatar(`${defaultPath}\\heroes\\${hero}_png.png`)
                } else {
                    this.setCurrentAvatar(`${defaultPath}\\heroes\\${this.getHeros[hero].override_hero}_png.png`)
                }
            } else {
                this.setCurrentAvatar('')
            }
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
            if (this.getHeros[key] && this.getHeros[key].override_hero) {
                const filteredKey = key.replace('custom_', '')
                if (this.localization[filteredKey]) return this.localization[filteredKey]
                if (this.getCustomLocalization[filteredKey]) return this.getCustomLocalization[filteredKey]    
            }
            if (this.getPrecache[key]) {
                const filteredKey = key.replace('npc_precache_', '')
                if (this.localization[filteredKey]) return this.localization[filteredKey]
                if (this.getCustomLocalization[filteredKey]) return this.getCustomLocalization[filteredKey]    
            }
            if (this.localization[key]) return this.localization[key]
            if (this.getCustomLocalization[key]) return this.getCustomLocalization[key]
            return key
        },
        getHeroAvatar(hero) {
            const defaultPath = `file:\\${process.cwd()}\\${process.env.NODE_ENV === 'development' ? '' : 'resources\\'}assets`
            if (this.categories.findIndex(category => category === hero) >= 0) {
                return `${defaultPath}\\${this.getCategories[hero].Model.split('/').join('\\').replace('.vmdl', '.png')}`
            } else if (this.precache.findIndex(precache => precache === hero) >= 0) {
                return `${defaultPath}\\heroes\\${hero.replace('npc_precache_', '')}_png.png`
            } else if (this.heros.findIndex(heroName => heroName === hero) >= 0) {
                if (!this.getHeros[hero.override_hero]) {
                    return `${defaultPath}\\heroes\\${hero}_png.png`
                } else {
                    return `${defaultPath}\\heroes\\${this.getHeros[hero].override_hero}_png.png`
                }
            }
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