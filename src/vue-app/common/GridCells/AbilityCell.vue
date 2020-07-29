<template>
	<div>
		<span v-if="!isObject">{{ params.value }}</span>
		<div v-else>
			<div v-for="(item, index) in data" :key="index" class="table">
				<span class="pl-2">{{
					getFlattenArray(item)[1].toUpperCase()
				}}</span>
				<span v-if="!getHideValueType">
					<v-select
						dense
						hide-details
						outlined
						:items="getFields('FieldType')"
						v-model="models[index]['var_type']"
					></v-select>
				</span>
				<span>
					<v-text-field
						hide-details
						dense
						outlined
						:type="isNumber(models[index]) ? 'number' : 'string'"
						v-model="models[index][getFlattenArray(item)[1]]"
					></v-text-field>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import { flatten } from "../../utils/file";
import { getConstData } from "../../utils/cellEditor";

export default Vue.extend({
	name: "ValueCell",
	data: () => ({
		models: [],
		data: []
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
		...mapGetters(["getHideValueType"]),
		isObject() {
			if (typeof this.params.value !== "object") return false;
			return true;
		},
		getKeys() {
			return Object.keys(flatten(this.params.value));
		}
	},
	methods: {
		getVal(key) {
			const depth = key.split(".");
			let value = this.params.value;
			depth.forEach(nest => (value = value[nest]));
			return value;
		},
		getKey(key) {
			const depth = key.split(".").pop();
			return depth;
		},
		getValue() {
			const res = {};
			this.models.map((model, index) => {
				res[index + 1] = {};
				Object.keys(model).forEach((value, idx) => {
					res[index + 1][value] = model[value];
				});
			});
			return res;
		},
		getFields(key) {
			return getConstData(key);
		},
		getType(item) {
			if (this.getKey(item) === "var_type") return 1;
			if (!isNaN(this.models[item])) return 3;
			return 2;
		},
		getArray(item) {
			return this.models[item].split(" ");
		},
		getFlattenArray(item) {
			return Object.keys(item);
		},
		isNumber(str) {
			const value = str[Object.keys(str)[1]];
			console.log(value);
			return (
				typeof value === "number" ||
				(typeof value === "string" && value.indexOf(".") > -1)
			);
		}
	}
});
</script>

<style lang="scss" scoped>
.table {
	display: flex;

	span {
		flex: 50%;
		position: relative;
		display: flex;
		align-items: center;

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
