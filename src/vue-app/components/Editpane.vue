<template>
    <v-sheet class="mod-content">
        <v-sheet
            class="mod-avatar"
            v-show="getSelected"
        >
            <v-avatar
                :size="128"
                tile
            >
                <v-img
                    :src="getCurrentAvatar"
                    contain
                ></v-img>
            </v-avatar>
        </v-sheet>
        <ag-grid-vue
            style="width: 100%; height: calc(100vh - 241px)"
            class="ag-theme-alpine"
            :columnDefs="columns"
            v-model="items"
            :defaultColDef="{flex: 1}"
            :tooltipShowDelay="0"
            :getRowHeight="getRowHeight"
            :frameworkComponents="frameworkComponents"
            stopEditingWhenGridLosesFocus
            v-if="getSelected"
        ></ag-grid-vue>
    </v-sheet>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import KeyCell from '../common/GridCells/KeyCell'
import ValueCell from '../common/GridCells/ValueCell'
import AbilityCell from '../common/GridCells/AbilityCell'
import AbilitySelectCell from '../common/GridCells/AbilitySelectCell'
import VScriptCell from '../common/GridCells/VScriptCell'
import ScriptFile from '../common/GridCells/ScriptFile'
import FileSelectCell from '../common/GridCells/FileSelectCell'
import { flatten } from '../utils/file'

import fileMixin from '../mixin/fileMixin'

import { getConstData, getDescription } from '../utils/cellEditor'
import { mapGetters, mapMutations, mapActions } from 'vuex'

import { schemas } from 'dota-data/lib/schemas'

export default {
    name: 'EditPane',
    mixins: [ fileMixin ],
    props: {
        localization: {
            type: Object,
            required: true
        }
    },
    components: { 
        AgGridVue,
        KeyCell,
        ValueCell,
        FileSelectCell,
    },
    data: () => ({
        isFirst: false,
        columns: [
            {
                headerName: 'Key', 
                field: 'key', 
                sortable: true, 
                filter: true,
                resizable: true,
                tooltip: (params) => `${params.data.description ? params.data.description : getDescription[params.data.key] ? getDescription[params.data.key] : 'No Description'}`,
                cellRendererFramework: KeyCell,
            },
            {
                headerName: 'Value',
                field: 'value',
                editable: true,
                resizable: true,
                cellRendererFramework: ValueCell,
                cellEditorSelector: (params) => {
                    const { data: { key, value } } = params
                    
                    if (typeof(value) === 'object' && value) {
                        return {
                            component: 'abilityEditor',
                            params
                        }
                    }

                    if (key === 'Model' || key === 'ProjectileModel') {
                        return {
                            component: 'fileEditor',
                            params
                        }
                    }

                    if (key === 'vscripts') {
                        return {
                            component: 'vscriptSelector',
                            params
                        }
                    }

                    if (key === 'ScriptFile') {
                        return {
                            component: 'scriptSelector',
                            params
                        }
                    }

                    if (key.includes('Ability')) {
                        return {
                            component: 'abilitySelector',
                            params
                        }
                    }

                    const options = getConstData(key)
                    if (options.length > 0) {
                        return {
                            component: 'agSelectCellEditor',
                            params: {
                                values: options
                            }
                        }
                    }

                    return {
                        component: 'agTextCellEditor'
                    }
                }
            },
        ],
        items: [],
        frameworkComponents: {
            abilityEditor: AbilityCell,
            fileEditor: FileSelectCell,
            abilitySelector: AbilitySelectCell,
            vscriptSelector: VScriptCell,
            scriptSelector: ScriptFile,
        }
    }),
    computed: {
        ...mapGetters([
            'getDetails',
            'getSelected',
            'getPath',
            'getCategories',
            'getAbility',
            'getHeros',
            'getCurrentAvatar',
            'getCustomLocalization',
            'getAbilities',
            'getItems',
            'getAbilitiesOverride',
            'getPrecache',
            'getSelected',
        ]),
        details() {
            return this.getDetails
        },
        selected() {
            return this.getSelected
        },
        path() {
            return this.getPath
        },
    },
    methods: {
        ...mapMutations([
            'setCategories',
            'setAbilities',
            'setItems',
            'setAbilitiesOverride',
            'setPrecache',
            'setHeros'
        ]),
        ...mapActions([
            'addDebugLogs'
        ]),
        getRowHeight(params) {
            const { data: { key, value }} = params
            if (typeof(value) === 'object') {
                return Object.keys(flatten(value)).length * 40
            }
            const char = key.charAt(7)
            if (key.includes('Ability') && char >= '0' && char <= '9') {
                const keyArr = Object.keys(this.getDetails)
                const index = keyArr.findIndex(value => value === key)
                return keyArr.splice(0, index).findIndex(value => value.includes('Ability')) > -1 ? 40 : 80
            }
            return 40
        }
    },
    watch: {
        details(details) {
            if (!details) return []
            const { npc_units_custom } = schemas;
            const getKeyInformation = (name) => npc_units_custom._rest.schema._fields.find(field => field.name === name);
            this.items = Object.keys(details).map(key => ({
                key: key,
                value: details[key],
                description: (getKeyInformation(key) && getKeyInformation(key).description) ? getKeyInformation(key).description : getDescription(key) ? getDescription(key) : 'No description'
            }))
        },
        items(value) {
            const newData = {}
            value.forEach(item => newData[item.key] = item.value)
            const selected = this.getSelected
            if (Object.keys(this.getCategories).includes(selected)) {
                this.setCategories({
                    ...this.getCategories,
                    [selected]: newData
                })
            } else if (Object.keys(this.getHeros).includes(selected)) {
                this.setHeros({
                    ...this.getHeros,
                    [selected]: newData
                })
            } else if (Object.keys(this.getAbilities).includes(selected)) {
                this.setAbilities({
                    ...this.getAbilities,
                    [selected]: newData
                })
            } else if (Object.keys(this.getAbilitiesOverride).includes(selected)) {
                this.setAbilitiesOverride({
                    ...this.getAbilitiesOverride,
                    [selected]: newData
                })
            } else if (Object.keys(this.getPrecache).includes(selected)) {
                this.setPrecache({
                    ...this.getPrecache,
                    [selected]: newData
                })
            } else if (Object.keys(this.getItems).includes(selected)) {
                this.setItems({
                    ...this.getItems,
                    [selected]: newData
                })
            }
        },
        getAbility(ability) {
            const { npc_units_custom } = schemas;
            const getKeyInformation = (name) => npc_units_custom._rest.schema._fields.find(field => field.name === name);
            this.items = Object.keys(this.details).map(key => ({
                key: key,
                value: key.includes('Ability') ? this.localization[this.details[key]] ? this.localization[this.details[key]] : this.details[key] : this.details[key],
                description: getKeyInformation(key) ? getKeyInformation(key).description : 'No description'
            }))
        }
    }
}
</script>

<style lang="scss" scoped>
.mod-content {
    flex: 1;
    overflow-x: scroll;

    .mod-avatar {
        display: flex;
        justify-content: center;
        padding: 16px;
    }

    .mod-unit-avatar {
        width: 128px;
        height: 128px;
        object-fit: cover;
    }
}

.form-control {
    margin-bottom: 12px;

    input {
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: 0;
        width: 100%;
        padding: 2px 8px;
        font-size: 16px;
        transition: all .2s;

        &:focus {
            box-shadow: 0px 0px 4px #3598dccc;
        }
    }
}

.mod-table {
    border-collapse: collapse;
    width: calc(100% - 2px);
    box-sizing: border-box;

    th, td {
        padding: 8px;
    }

    th {
        text-align: left;
        background-color: #1578ac;
        color: #fff;
        position: sticky;
        top: 0;
    }

    td {
        text-align: left;
        border: 1px solid #ccc;
    }
}
</style>