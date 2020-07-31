<template>
	<div>
		<div class="cell">
			<img
				:src="getIcon(params.value)"
				alt="skill"
				v-if="hasIconInsideAssets(params.value)"
			/>
			<span class="text">{{ params.value }}</span>
		</div>
		<v-checkbox
			label="Always show ingame names for abilities"
			dense
			hide-details
			class="pt-0 mt-0"
			v-if="isAbilitySet"
			v-model="ability"
			@change="toggleAbility"
		></v-checkbox>
		<v-checkbox
			label="Hide Variable Input Type"
			dense
			hide-details
			class="pt-0 mt-0"
			v-if="isObjectType"
			v-model="hide"
			@change="toggleShow"
		></v-checkbox>
	</div>
</template>

<script>
import Vue from "vue";
import path from "path";
import fs, { readdirSync } from "fs";
import { mapGetters, mapMutations } from "vuex";

export default Vue.extend({
	name: "KeyCell",
	data: () => ({
		iconArray: [],
		ability: false,
		hide: false
	}),
	created() {
		const path = `${process.cwd()}\\${
			process.env.NODE_ENV === "development" ? "" : "resources\\"
		}assets\\icons\\`;
		const result = fs.readdirSync(path);
		this.iconArray = result.map(file => file.split(".")[0]);
		this.ability = this.getAbility;
		this.hide = this.getHideValueType;
	},
	methods: {
		...mapMutations(["setAbility", "setHideValueType"]),
		hasIconInsideAssets(key) {
			return (
				this.iconArray.includes(key) ||
				this.iconArray.includes(key.toLowerCase())
			);
		},
		getIcon(item) {
			const path = `file:\\${process.cwd()}\\${
				process.env.NODE_ENV === "development" ? "" : "resources\\"
			}assets\\icons\\${item}.png`;
			if (fs.existsSync(path)) return path;
			return `file:\\${process.cwd()}\\${
				process.env.NODE_ENV === "development" ? "" : "resources\\"
			}assets\\icons\\${item.toLowerCase()}.png`;
		},
		toggleShow() {
			this.setHideValueType(!this.getHideValueType);
		},
		toggleAbility() {
			this.setAbility(!this.getAbility);
		}
	},
	computed: {
		...mapGetters([
			"getAbility",
			"getDetails",
			"getHideValueType",
			"getOriginalItems"
		]),
		isAbilitySet() {
			if (!/Ability\d/.test(this.params.value)) return false;
			const newArray = Object.keys(this.getDetails).filter(key =>
				/Ability\d/.test(key)
			);
			let secondArray = this.getOriginalItems.filter(key =>
				/Ability\d/.test(key.key)
			);
			if (newArray.length > 0) secondArray = [{key: "nofound"}];
			if (newArray.length === 0 && secondArray === 0) return false;
			if (
				this.params.value === newArray[0] ||
				this.params.value === secondArray[0].key
			)
				return true;
			return false;
		},
		isObjectType() {
			return this.params.value === "AbilitySpecial";
		}
	}
});
</script>

<style lang="scss" scoped>
.cell {
	display: flex;
	align-items: center;
	white-space: normal;

	img {
		width: 24px;
		height: 24px;
		margin-right: 6px;
	}

	.text {
		word-break: break-all;
	}
}

.default {
	color: #aaa !important;
}
</style>
