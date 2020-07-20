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
    <v-checkbox
      v-model="ability"
      label="Always show ingame names for abilities"
      dense
      hide-details
      class="pt-0 mt-0"
      v-if="isAbilitySet"
    ></v-checkbox>
    <v-checkbox
      label="Hide Variable Input Type"
      dense
      hide-details
      class="pt-0 mt-0"
      v-if="isObjectType && !hide"
      v-model="getHideValueType"
    ></v-checkbox>
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
    iconArray: [],
    ability: false,
    hide: false,
  }),
  created() {
    const path = `${process.cwd()}\\${process.env.NODE_ENV === 'development' ? '' : 'resources\\'}assets\\icons\\`
    const result = fs.readdirSync(path)
    this.iconArray = result.map(file => file.split('.')[0])
    this.ability = this.getAbility
  },
  methods: {
    ...mapMutations([
      'setAbility',
      'setHideValueType',
    ]),
    hasIconInsideAssets(key) {
      return this.iconArray.includes(key) || this.iconArray.includes(key.toLowerCase())
    },
    getIcon(item) {
      const path = `file:\\${process.cwd()}\\${process.env.NODE_ENV === 'development' ? '' : 'resources\\'}assets\\icons\\${item}.png`
      if (fs.existsSync(path))
        return path
      return `file:\\${process.cwd()}\\${process.env.NODE_ENV === 'development' ? '' : 'resources\\'}assets\\icons\\${item.toLowerCase()}.png`
    },
  },
  computed: {
    ...mapGetters([
      'getAbility',
      'getDetails',
      'getHideValueType'
    ]),
    isAbilitySet() {
      const char = this.params.value.charAt(7)
      return this.params.value.includes('Ability') && char >= '0' && char <= '9'
    },
    isObjectType() {
      return typeof(this.getDetails[this.params.value]) === 'object'
    }
  },
  watch: {
    getAbility(able) {
      this.ability = able
    },
    ability(able) {
      if (able !== this.getAbility)
        this.setAbility(able)
    },
    hide(hidden) {
      console.log(hidden, this.getHideValueType)
      if (hidden !== this.getHideValueType)
        this.setHideValueType(hidden)
    }
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