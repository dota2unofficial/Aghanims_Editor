<template>
  <span
    class="cell"
  >
    <img
      :src="getIcon(params.value)"
      alt="skill"
      v-if="hasIconInsideAssets(params.value)"
    />
    {{params.value}}
  </span>
</template>

<script>
import Vue from 'vue'
import path from 'path'

export default Vue.extend({
  name: 'KeyCell',
  data: () => ({
    iconArray: [
      'ArmorPhysical',
      'AttackDamageMax',
      'AttackDamageMin',
      'BaseClass',
      'gamesoundsfile',
      'SoundSet',
      'StatusHealth',
      'StatusHealthRegen',
    ]
  }),
  methods: {
    hasIconInsideAssets(key) {
      return this.iconArray.includes(key)
    },
    getIcon(item) {
      return `file:\\${process.cwd()}\\${process.env.NODE_ENV === 'development' ? '' : 'resources\\'}assets\\icons\\${item}.png`
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