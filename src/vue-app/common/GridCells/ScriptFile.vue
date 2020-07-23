<template>
	<div>
		<v-file-input outlined dense hide-details v-model="file"></v-file-input>
	</div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
	name: "ScriptCell",
	data: () => ({
		file: null
	}),
	computed: {
		...mapGetters(["getD2Path", "getPath"])
	},
	methods: {
		getValue() {
			if (!this.file) return this.params.value;
			const res = this.file.path
				.replace(
					`${this.getD2Path}\\dota_addons\\${this.getPath}\\scripts\\vscripts\\`,
					""
				)
				.replace(/\\/g, "/")
				.split(".")[0];
			return res;
		},
		isPopup() {
			return true;
		}
	}
});
</script>

<style lang="scss" scoped></style>
