<template>
	<div>
		<v-text-field
			:value="value"
			readonly
			outlined
			hide-details
			dense
			@click="onClick"
		>
		</v-text-field>
		<input
			type="file"
			class="ability-selector"
			ref="abilitySelector"
			@change="onFileSelect"
		/>
	</div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
	name: "AbilitySelectCell",
	data: () => ({
		file: null,
		value: null
	}),
	mounted() {
		this.value = this.params.value;
	},
	computed: {
		...mapGetters(["getD2Path", "getPath"])
	},
	methods: {
		getValue() {
			if (!this.file) return this.params.value;
			return this.file.name.split(".")[0];
		},
		isPopup() {
			return true;
		},
		onClick() {
			const node = this.$refs.abilitySelector;
			node.click();
		},
		onFileSelect(evt) {
			const file = evt.target.files[0];
			this.file = file;
			this.value = file.name;
		}
	}
});
</script>

<style lang="scss" scoped>
.ability-selector {
	display: none;
}
</style>
