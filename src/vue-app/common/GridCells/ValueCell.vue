<template>
	<div :class="{ default: isDefault }">
		<span v-if="!isAbilitySpecial">{{ getFormattedValue }}</span>
		<div v-else>
			<div v-for="(item, index) in data" :key="index" class="table">
				<span>{{ getTitle(item) }}</span>
				<span v-if="!getHideValueType">{{ getKey(index) }}</span>
				<span>{{ getValue(index) }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import { flatten } from "../../utils/file";

export default Vue.extend({
	name: "ValueCell",
	data: () => ({
		data: [],
		models: []
	}),
	created() {
		Object.keys(this.params.value).forEach(key => {
			let newValue = {};
			Object.keys(this.params.value[key]).forEach(index => {
				newValue[index] = this.params.value[key][index];
			});
			this.data.push(newValue);
			this.models.push(newValue);
		});
	},
	computed: {
		...mapGetters([
			"getLocalizationData",
			"getCustomLocalization",
			"getHideValueType"
		]),
		isAbilitySpecial() {
			if (this.params.data.key !== "AbilitySpecial") return false;
			return true;
		},
		isDefault() {
			return this.params.data.weight === 1;
		},
		getKeys() {
			return Object.keys(flatten(this.params.value));
		},
		getHeight() {
			return `${Object.keys(this.params.value).length * 40}px`;
		},
		getFormattedValue() {
			if (
				this.getCustomLocalization[
					`DOTA_Tooltip_ability_${this.params.value}`
				]
			)
				return this.getCustomLocalization[
					`DOTA_Tooltip_ability_${this.params.value}`
				].replace("{s:value}", this.params.value.split("_").pop());
			return this.getLocalizationData[
				`DOTA_Tooltip_ability_${this.params.value}`
			]
				? this.getLocalizationData[
						`DOTA_Tooltip_ability_${this.params.value}`
				  ].replace("{s:value}", this.params.value.split("_").pop())
				: this.params.value;
		}
	},
	methods: {
		getValue(index) {
			return this.models[index][Object.keys(this.models[index])[1]];
		},
		getKey(index) {
			return this.models[index][Object.keys(this.models[index])[0]];
		},
		getFlattenArray(item) {
			return Object.keys(item);
		},
		getTitle(item) {
			const str = this.getFlattenArray(item)[1];
			if (str) return str.toUpperCase();
			return "";
		}
	}
});
</script>

<style lang="scss" scoped>
.default {
  color: #aaa !important;
}
.table {
	display: flex;
	position: relative;

	&.border-top {
		&:before {
			content: "";
			height: 1px;
			position: absolute;
			left: -17px;
			right: -17px;
			top: -1px;
			background-color: #000;
		}
	}

	span {
		flex: 50%;
		position: relative;
		overflow: hidden;

		&:not(last-child) {
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
