<template>
  <div>
    <v-text-field
      outlined
      dense
      hide-details
      type="number"
      v-model="data"
    ></v-text-field>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'NumberCell',
  data() {
    return {
      data: 0,
    }
  },
  created() {
    console.log(this.param)
  },
  methods: {
    getValue() {
      return this.number
    },
  }
})
</script>

<style lang="scss" scoped>
</style>1