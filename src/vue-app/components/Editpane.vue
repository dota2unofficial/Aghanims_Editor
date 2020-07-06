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
                    src="/images/units/electron.png"
                ></v-img>
            </v-avatar>
        </v-sheet>
        <ag-grid-vue
            style="width: 100%; height: calc(100vh - 225px)"
            class="ag-theme-alpine"
            :columnDefs="columns"
            v-model="items"
            :defaultColDef="{flex: 1}"
            :components="components"
        ></ag-grid-vue>
    </v-sheet>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import MetaFile from '../common/MetaFile'

import fileMixin from '../mixin/fileMixin'

import { getConstData } from '../utils/cellEditor'
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'EditPane',
    mixins: [ fileMixin ],
    components: { 
        MetaFile,
        AgGridVue,
    },
    data: () => ({
        columns: [
            {
                headerName: 'Key', 
                field: 'key', 
                sortable: true, 
                filter: true,
            },
            {
                headerName: 'Value',
                field: 'value',
                editable: true,
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
        }
    }),
    computed: {
        ...mapGetters([
            'getDetails',
            'getSelected',
            'getPath',
            'getCategories'
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
    },
    watch: {
        details(details) {
            if (!details) return []
            this.items = Object.keys(details).map(key => ({
                key: key,
                value: details[key],
            }))
        },
        items(value) {
            const newData = {}
            value.forEach(item => newData[item.key] = item.value)
            this.setCategories({
                ...this.getCategories,
                [this.selected]: newData
            })
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