<template>
    <section class="mod-content">
        <table class="mod-table">
            <tr>
                <th>Key</th>
                <th>Value</th>
            </tr>
            <tr
                v-for="item in items"
                :key="item.key"
                class="form-control"
            >
                <td>{{item.key}}</td>
                <td :ref="item.key" @dblclick="editItem(item.key)">{{item.value}}</td>
            </tr>
        </table>
    </section>
</template>

<script>
import MetaInput from '../common/MetaInput'

export default {
    name: 'EditPane',
    components: { MetaInput },
    props: {
        details: {
            type: Object,
            required: true,
        }
    },
    methods: {
        editItem(key) {
            console.log(key, this.$refs[key])
            this.$refs[key][0].innerHTML = `
                <meta-input />
            `
        }
    },
    computed: {
        items() {
            console.log("details:", this.details)
            return Object.keys(this.details).map(key => ({
                key: key,
                value: this.details[key],
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