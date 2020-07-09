<template>
  <div style="height: 100px">
    <div
      class="cell"
    >
      <img
        :src="getIcon(params.value)"
        alt="skill"
        v-if="hasIconInsideAssets(params.value)"
      />
      {{params.value}}
    </div>
    <p class="mb-0" v-if="isAbility">
      <input
        type="checkbox"
        placeholder="Hello"
        :id="`checkbox${params.value}`"
        @change="onChange"
      >
      <label
        :for="`checkbox${params.value}`"
      >Always show ingame names for abilities</label>
    </p>
  </div>
</template>

<script>
import Vue from 'vue'
import path from 'path'
import fs, { readdirSync } from 'fs'
import { mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'KeyCell',
  data: () => ({
    iconArray: []
  }),
  created() {
    const path = `${process.cwd()}\\${process.env.NODE_ENV === 'development' ? '' : 'resources\\'}assets\\icons\\`
    const result = fs.readdirSync(path)
    this.iconArray = result.map(file => file.split('.')[0])
  },
  methods: {
    ...mapMutations([
      'setAbility'
    ]),
    hasIconInsideAssets(key) {
      return this.iconArray.includes(key)
    },
    getIcon(item) {
      return `file:\\${process.cwd()}\\${process.env.NODE_ENV === 'development' ? '' : 'resources\\'}assets\\icons\\${item}.png`
    },
    onChange() {
      this.setAbility(false)
    }
  },
  computed: {
    ...mapGetters([
      'getAbility'
    ]),
    isAbility() {
      return this.params.value.includes('Ability') && this.getAbility
    },
  }
})
</script>

<style lang="scss" scoped>
.cell {
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }
}
</style>