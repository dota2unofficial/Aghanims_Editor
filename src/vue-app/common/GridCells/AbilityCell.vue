<template>
  <div>
    <span v-if="!isObject">{{params.value}}</span>
    <div v-else>
      <div
        v-for="item in getKeys"
        :key="item"
        class="table"
      >
        <span class="pl-2">{{getKey(item)}}</span>
        <span>
          <v-select
            v-if="getType(item) === 1"
            v-model="models[item]"
            dense
            hide-details
            outlined
            :items="getFields('FieldType')"
          ></v-select>
          <v-text-field
            hide-details
            dense
            outlined
            v-model="models[item]"
            v-else
            :type="getType(item) === 3 ? 'number' : 'text'"
          ></v-text-field>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { flatten } from '../../utils/file'
import { getConstData } from '../../utils/cellEditor'

export default Vue.extend({
  name: 'ValueCell',
  data: () => ({
    models: {}
  }),
  created() {
    this.getKeys.forEach((key => {
      this.models[key] = this.getVal(key)
    }))
  },
  computed: {
    isObject() {
      if (typeof(this.params.value) !== 'object') return false
      return true
    },
    getKeys() {
      return Object.keys(flatten(this.params.value))
    }
  },
  methods: {
    getVal(key) {
      const depth = key.split('.')
      let value = this.params.value
      depth.forEach(nest => value = value[nest])
      return value
    },
    getKey(key) {
      const depth = key.split('.').pop()
      return depth
    },
    getValue() {
      const res = {}
      Object.keys(this.models).forEach(key => {
        const list = key.split('.')
        res[list[0]] = {...res[list[0]]}
        res[list[0]][list[1]] = this.models[key]
      })
      return res
    },
    getFields(key) {
      return getConstData(key)
    },
    getType(item) {
      if (this.getKey(item) === 'var_type') return 1
      if (!isNaN(this.models[item])) return 3
      return 2
    },
    getArray(item) {
      return this.models[item].split(' ')
    }
  }
})
</script>

<style lang="scss" scoped>
.table {
  display: flex;

  span {
    flex: 50%;
    position: relative;
    display: flex;
    align-items: center;

    &:first-child {
      &:after {
        content: "";
        position: absolute;
        right: 8px;
        top: 8px;
        width: 1px;
        bottom: 8px;
        background-color: #ccc;
      }
    }

    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 0;
      height: 1px;
      background-color: #ccc;
    }
  }
}
</style>