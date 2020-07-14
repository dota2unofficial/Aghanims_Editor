<template>
    <v-sheet class="mod-content">
        <v-sheet 
            v-if="getUnitAvatar(selected, path)"
            class="mod-avatar"
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
            :components="frameworkComponents"
            :tooltipShowDelay="0"
            :getRowHeight="getRowHeight"
            v-if="getSelected"
            :frameworkComponents="frameworkComponents"
        ></ag-grid-vue>
    </v-sheet>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import MetaFile from '../common/MetaFile'
import KeyCell from '../common/KeyCell'
import AbilityCell from '../common/AbilityCell'

import fileMixin from '../mixin/fileMixin'

import { getConstData } from '../utils/cellEditor'
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
        MetaFile,
        AgGridVue,
        KeyCell,
        AbilityCell
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
                tooltip: (params) => `${params.data.description ? params.data.description : 'No Description'}`,
                cellRendererFramework: KeyCell,
            },
            {
                headerName: 'Value',
                field: 'value',
                editable: true,
                resizable: true,
                cellEditorSelector: (params) => {
                    const { data: { key } } = params
                    if (params.data.key.includes('Ability')) {
                        console.log(params.data.key)
                        return {
                            component: AbilityCell,
                        }
                    }

                    const options = getConstData(params.data.key)
                    if (options.length > 0) {
                        return {
                            component: 'agSelectCellEditor',
                            params: {
                                values: options
                            }
                        }
                    }

                    if (Number.isInteger(params.data.value)) {
                        return 'agTextCellEditor'
                    } else {
                        if (params.data.value[params.data.value.length - 1] === 's') {
                            return {
                                component: 'agTextCellEditor',
                                params: {
                                    value: params.data.value.splice(0, 1)
                                }
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
            fileInput: AbilityCell,
        },
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
            const { data: { key }} = params
            if (key.includes('Ability')) {
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
                description: getKeyInformation(key) ? getKeyInformation(key).description : 'No description'
            }))
        },
        items(value) {
            const newData = {}
            const selected = this.getSelected
            if (Object.keys(this.getCategories).includes(this.selected)) {
                value.forEach(item => newData[item.key] = item.value)
                this.setCategories({
                    ...this.getCategories,
                    [this.selected]: newData
                })
            } else if (Object.keys(this.getHeros).includes(this.selected)) {
                value.forEach(item => newData[item.key] = item.value)
                this.setHeros({
                    ...this.getHeros,
                    [this.selected]: newData
                })
            } else if (Object.keys(this.getAbilities).includes(this.selected)) {
                value.forEach(item => newData[item.key] = item.value)
                this.setHeros({
                    ...this.getAbilities,
                    [this.selected]: newData
                })
            } else if (Object.keys(this.getAbilitiesOverride).includes(this.selected)) {
                value.forEach(item => newData[item.key] = item.value)
                this.setHeros({
                    ...this.getAbilitiesOverride,
                    [this.selected]: newData
                })
            } else if (Object.keys(this.getPrecache).includes(this.selected)) {
                value.forEach(item => newData[item.key] = item.value)
                this.setHeros({
                    ...this.getPrecache,
                    [this.selected]: newData
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