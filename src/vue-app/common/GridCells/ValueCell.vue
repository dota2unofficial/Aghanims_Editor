<template>
  <div
    :style="{height: getHeight}"
  >
    <span v-if="!isObject">{{params.value}}</span>
    <div v-else>
      <div
        v-for="item in getKeys"
        :key="item"
        class="table"
      >
        <span>{{getKey(item)}}</span>
        <span>{{getValue(item)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { flatten } from '../../utils/file'

export default Vue.extend({
  name: 'ValueCell',
  computed: {
    isObject() {
      if (typeof(this.params.value) !== 'object') return false
      return true
    },
    getKeys() {
      return Object.keys(flatten(this.params.value))
    },
    getHeight() {
      return `${Object.keys(this.params.value).length * 40}px`
    }
  },
  methods: {
    getValue(key) {
      const depth = key.split('.')
      let value = this.params.value
      depth.forEach(nest => value = value[nest])
      return value
    },
    getKey(key) {
      const depth = key.split('.').pop()
      return depth
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
    overflow: hidden;

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