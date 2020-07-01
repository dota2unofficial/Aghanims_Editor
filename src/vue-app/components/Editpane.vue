<template>
    <section class="mod-content">
        <div>
            <ag-grid-vue
                style="width: 100%; height: calc(100vh - 64px)"
                class="ag-theme-alpine"
                :columnDefs="columns"
                v-model="items"
                :defaultColDef="{flex: 1}"
                :components="components"
            ></ag-grid-vue>
        </div>
    </section>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import MetaFile from '../common/MetaFile'

import { getConstData } from '../utils/cellEditor'

export default {
    name: 'EditPane',
    components: { 
        MetaFile,
        AgGridVue,
    },
    props: {
        details: {
            type: Object,
            required: true,
        }
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

                    if ( key === 'vscripts' || key === 'ProjectileModel' || key === 'Model') {
                        return {
                            component: MetaFile
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
    methods: {
        editItem(key) {
            console.log(key, this.$refs[key])
            this.$refs[key][0].innerHTML = `
                <meta-input />
            `
        }
    },
    watch: {
        details(details) {
            this.items = Object.keys(details).map(key => ({
                key: key,
                value: details[key],
            }))
        }
    }
}
</script>

<style lang="scss" scoped>
.mod-content {
    flex: 1;
    overflow-x: scroll;
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