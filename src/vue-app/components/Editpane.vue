<template>
    <v-sheet class="mod-content">
        <v-sheet 
            v-if="getUnitAvatar(selected, path)"
            class="mod-avatar"
        >
            <v-avatar
                :size="128"
                :rounded="false"
            >
                <v-img
                    :src="getCurrentAvatar"
                ></v-img>
            </v-avatar>
        </v-sheet>
        <ag-grid-vue
            style="width: 100%; height: calc(100vh - 241px)"
            class="ag-theme-alpine"
            :columnDefs="columns"
            v-model="items"
            :defaultColDef="{flex: 1}"
            :components="components"
            :tooltipShowDelay="0"
            :getRowHeight="getRowHeight"
        ></ag-grid-vue>
    </v-sheet>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import MetaFile from '../common/MetaFile'
import KeyCell from '../common/KeyCell'

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
    },
    data: () => ({
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
                    const options = getConstData(params.data.key)
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
        components: {
            fileInput: MetaFile,
        },
    }),
    computed: {
        ...mapGetters([
            'getDetails',
            'getSelected',
            'getPath',
            'getCategories',
            'getAbility',
            'getCurrentAvatar',
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
            'setCategories'
        ]),
        ...mapActions([
            'addDebugLogs'
        ]),
        getRowHeight(params) {
            return params.data.key.includes('Ability') && this.getAbility ? 80 : 40
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
            if (!Object.keys(this.getCategories).includes(this.selected)) return
            value.forEach(item => newData[item.key] = item.value)
            this.setCategories({
                ...this.getCategories,
                [this.selected]: newData
            })
        },
        getAbility(ability) {
            const { npc_units_custom } = schemas;
            const getKeyInformation = (name) => npc_units_custom._rest.schema._fields.find(field => field.name === name);
            console.log(this.localization[this.details['ability_hide_healthbar']])
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