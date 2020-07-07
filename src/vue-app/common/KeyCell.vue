<template>
  <span
    class="cell"
  >
    <img
      :src="`assets/icons/${params.value}.png`"
      alt="skill"
      v-if="hasIconInsideAssets(params.value)"
    />
    {{params.value}}
  </span>
</template>

<script>
import Vue from 'vue'
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