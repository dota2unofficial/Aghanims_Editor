<template>
	<v-sheet class="mod-content">
		<v-sheet class="mod-avatar" v-show="getSelected">
			<v-avatar :size="128" tile>
				<v-img :src="getCurrentAvatar" contain></v-img>
			</v-avatar>

			<v-sheet class="backdrop">
				<v-dialog width="50vw">
					<template #activator="{ on, attrs }">
						<v-btn icon v-bind="attrs" v-on="on">
							<v-icon color="#fff">{{ penIcon }}</v-icon>
						</v-btn>
					</template>

					<v-card>
						<v-card-title>Edit Localization Data</v-card-title>

						<v-card-text>
							<v-row
								v-for="(row, index) in localizationEditable"
								:key="index"
							>
								<v-col cols="12">
									<v-text-field
										v-if="index === 0"
										dense
										hide-details
										outlined
										:label="row[1]"
										v-model="localization[row[0]]"
									></v-text-field>
									<v-textarea
										v-else
										dense
										hide-details
										outlined
										auto-grow
										:label="row[1]"
										v-model="localization[row[0]]"
									></v-textarea>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-dialog>
			</v-sheet>
		</v-sheet>

		<ag-grid-vue
			:style="styleObject"
			class="ag-theme-alpine"
			:columnDefs="columns"
			v-model="items"
			:tooltipShowDelay="0"
			:frameworkComponents="frameworkComponents"
			stopEditingWhenGridLosesFocus
			v-if="getSelected"
			@column-resized="onColumnResized"
		></ag-grid-vue>

		<v-sheet
			class="d-flex align-center justify-center expander"
			v-if="getSelected && isVisible"
		>
			<v-btn
				x-small
				text
				outlined
				color="primary"
				@click="toggleShowDefaultValues"
				>{{ `${getShowDefaultValues ? "Hide" : "Show"}` }} Unmodified
				Default Values</v-btn
			>
		</v-sheet>

		<ag-grid-vue
			style="width: 100%; height: calc(50vh - 140px)"
			class="ag-theme-alpine"
			:columnDefs="columns"
			v-model="originalItems"
			:tooltipShowDelay="0"
			:frameworkComponents="frameworkComponents"
			stopEditingWhenGridLosesFocus
			v-if="getSelected && getShowDefaultValues"
			@column-resized="onColumnResized"
			@cellValueChanged="onCellValueChanged"
			@cellClicked="onCellClicked"
		></ag-grid-vue>

		<v-sheet v-if="isOverride">
			<p v-for="(item, index) in getPreExisting" :key="index"></p>
		</v-sheet>
	</v-sheet>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import KeyCell from "../common/GridCells/KeyCell";
import ValueCell from "../common/GridCells/ValueCell";
import AbilityCell from "../common/GridCells/AbilityCell";
import AbilityHrefCell from "../common/GridCells/AbilityHrefCell";
import AbilitySelectCell from "../common/GridCells/AbilitySelectCell";
import VScriptCell from "../common/GridCells/VScriptCell";
import ScriptFile from "../common/GridCells/ScriptFile";
import NumberCell from "../common/GridCells/NumberCell";
import FileSelectCell from "../common/GridCells/FileSelectCell";
import { flatten } from "../utils/file";
import { checkItemType } from "../utils/file";

import fileMixin from "../mixin/fileMixin";
import { mdiPencil } from "@mdi/js";

import { getConstData, getDescription } from "../utils/cellEditor";
import { mapGetters, mapMutations, mapActions } from "vuex";

import { schemas } from "dota-data/lib/schemas";
import fs from "fs";

export default {
	name: "EditPane",
	mixins: [fileMixin],
	components: {
		AgGridVue,
		KeyCell,
		ValueCell,
		FileSelectCell
	},
	data() {
		return {
			isFirst: false,
			penIcon: mdiPencil,
			columns: [
				{
					headerName: "Key",
					field: "key",
					sortable: true,
					filter: true,
					resizable: true,
					autoHeight: true,
					tooltip: params =>
						`${
							params.data.description
								? params.data.description
								: getDescription[params.data.key]
								? getDescription[params.data.key]
								: "No Description"
						}`,
					cellRendererFramework: KeyCell,
					cellClass: "wrap-cell",
					flex: 2
				},
				{
					headerName: "Value",
					field: "value",
					editable: true,
					resizable: true,
					autoHeight: true,
					cellRendererFramework: ValueCell,
					flex: 3,
					cellEditorSelector: params => {
						const {
							data: { key, value }
						} = params;

						if (!isNaN(value)) {
							return {
								component: "numberEditor",
								params
							};
						}

						if (key === "AbilitySpecial") {
							return {
								component: "abilityEditor",
								params
							};
						}

						const options = getConstData(key);
						if (options.length > 0) {
							return {
								component: "agSelectCellEditor",
								params: {
									values: options
								}
							};
						}

						return {
							component: "agTextCellEditor"
						};
					}
				}
			],
			items: [],
			frameworkComponents: {
				abilityEditor: AbilityCell,
				fileEditor: FileSelectCell,
				numberEditor: NumberCell,
				abilitySelector: AbilitySelectCell,
				vscriptSelector: VScriptCell,
				scriptSelector: ScriptFile,
				abilityHrefSelector: AbilityHrefCell
			},
			originalItems: []
		};
	},
	computed: {
		...mapGetters([
			"getDetails",
			"getPath",
			"getUnits",
			"getAbility",
			"getHeros",
			"getCurrentAvatar",
			"getCustomLocalization",
			"getAbilities",
			"getItems",
			"getAbilitiesOverride",
			"getPrecache",
			"getSelected",
			"getDefaultHeroes",
			"getDefaultAbilities",
			"getDefaultItems",
			"getLocalizationData",
			"getShowDefaultValues"
		]),
		details() {
			return this.getDetails;
		},
		selected() {
			return this.getSelected;
		},
		path() {
			return this.getPath;
		},
		isOverride() {
			if (this.getAbilitiesOverride[this.getSelected]) return true;
		},
		getPreExisting() {
			const list = this.getAbilities[this.getSelected];
			return [];
		},
		localizationEditable() {
			if (!this.getSelected) return [];
			const entityName = this.getSelected;
			switch (checkItemType(entityName)) {
				case "UNIT":
					return [
						[entityName, "Name"],
						[`${entityName}_hype`, "Hype"],
						[`${entityName}_bio`, "Bio"]
					];
				case "HERO":
					return [
						[entityName, "Name"],
						[`${entityName}_hype`, "Hype"],
						[`${entityName}_bio`, "Bio"]
					];
				case "ABILITY":
					return [
						[`DOTA_Tooltip_ability_${entityName}`, "Name"],
						[
							`DOTA_Tooltip_ability_${entityName}_Description`,
							"Description"
						],
						[`DOTA_Tooltip_ability_${entityName}_Lore`, "Lore"]
					];
				case "ITEM":
					const isEntity = this.getLocalizationData[
						`DOTA_Tooltip_ability_${entityName}`
					];
					return [
						[
							`DOTA_Tooltip_${
								isEntity ? "ability" : "Ability"
							}_${entityName}`,
							"Name"
						],
						[
							`DOTA_Tooltip_${
								isEntity ? "ability" : "Ability"
							}_${entityName}_Description`,
							"Description"
						]
					];
			}
			return [];
		},
		localization() {
			return this.getLocalizationData;
		},
		styleObject() {
			return {
				width: "100%",
				height: this.getShowDefaultValues
					? "calc(50vh - 140px)"
					: "calc(100vh - 279px)"
			};
		},
		isVisible() {
			return this.originalItems.length > 0;
		}
	},
	methods: {
		...mapMutations([
			"setUnits",
			"setAbilities",
			"setItems",
			"setAbilitiesOverride",
			"setPrecache",
			"setHeros",
			"setCurrentAvatar",
			"setDetails",
			"setSelected",
			"setOriginalItems"
		]),
		...mapActions(["addDebugLogs", "toggleShowDefaultValues"]),
		getRowHeight(params) {
			const {
				data: { key, value }
			} = params;
			if (typeof value === "object") {
				if (Object.keys(value).length === 1) return 80;
				return Object.keys(value).length * 40;
			}
			const char = key.charAt(7);
			if (key.includes("Ability") && char >= "0" && char <= "9") {
				const keyArr = Object.keys(this.getDetails);
				const index = keyArr.findIndex(value => value === key);
				return keyArr
					.splice(0, index)
					.findIndex(value => value.includes("Ability")) > -1
					? 40
					: 80;
			}
			return 40;
		},
		onColumnResized(params) {
			params.api.resetRowHeights();
		},
		onCellValueChanged(event) {
			const { data } = event;
			this.items = [...this.items, data];
			this.originalItems = this.originalItems.filter(
				item => item.key !== data.key
			);
			this.setOriginalItems(this.originalItems);
		},
		onCellClicked(event) {
			if (this.getDefaultAbilities[event.value]) {
				const selectedKey = event.value;
				this.setSelected(selectedKey);
				this.setDetails(this.getDefaultAbilities[event.value]);

				const defaultPath = `file:\\${process.cwd()}\\${
					process.env.NODE_ENV === "development" ? "" : "resources\\"
				}assets`;
				const texture = this.getLocalizationData[
					`DOTA_Tooltip_ability_${event.value}`
				];

				const textureIcon = `${defaultPath}\\spells\\${(texture
					? texture
					: ""
				)
					.split(" ")
					.join("_")}_icon.png`;

				let retUrl = null;

				try {
					fs.accessSync(textureIcon);
					retUrl = textureIcon;
				} catch (err) {
					const normalPath = `${defaultPath}\\spells\\${event.value}.png`;
					retUrl = normalPath;
				}

				this.setCurrentAvatar(retUrl);
			}
		}
	},
	watch: {
		details(details) {
			if (!details) return [];
			const { npc_units_custom } = schemas;
			const getKeyInformation = name =>
				npc_units_custom._rest.schema._fields.find(
					field => field.name === name
				);

			this.items = Object.keys(details).map(key => ({
				key: key,
				value: details[key],
				description:
					getKeyInformation(key) && getKeyInformation(key).description
						? getKeyInformation(key).description
						: getDescription(key)
						? getDescription(key)
						: "No description"
			}));

			let orginalData = {};
			switch (checkItemType(this.getSelected)) {
				case "HERO":
					orginalData = this.getDefaultHeroes[this.getSelected];
					break;
				case "ABILITY":
					orginalData = this.getDefaultAbilities[this.getSelected];
					break;
				case "ITEM":
					orginalData = this.getDefaultItems[this.getSelected];
					break;
				default:
					break;
			}

			if (!orginalData) orginalData = {};

			this.originalItems = Object.keys(orginalData)
				.map(key => ({
					key: key,
					value: orginalData[key],
					description:
						getKeyInformation(key) &&
						getKeyInformation(key).description
							? getKeyInformation(key).description
							: getDescription(key)
							? getDescription(key)
							: "No description"
				}))
				.filter(
					item =>
						!this.items
							.map(modified => modified.key)
							.includes(item.key)
				);
				this.setOriginalItems(this.originalItems)
		},
		items(value) {
			let newData = {};
			value.forEach(item => (newData[item.key] = item.value));
			const selected = this.getSelected;
			if (Object.keys(this.getUnits).includes(selected)) {
				this.setUnits({
					...this.getUnits,
					[selected]: newData
				});
			} else if (Object.keys(this.getHeros).includes(selected)) {
				this.setHeros({
					...this.getHeros,
					[selected]: newData
				});
			} else if (Object.keys(this.getAbilities).includes(selected)) {
				this.setAbilities({
					...this.getAbilities,
					[selected]: newData
				});
			} else if (
				Object.keys(this.getAbilitiesOverride).includes(selected)
			) {
				this.setAbilitiesOverride({
					...this.getAbilitiesOverride,
					[selected]: newData
				});
			} else if (Object.keys(this.getPrecache).includes(selected)) {
				this.setPrecache({
					...this.getPrecache,
					[selected]: newData
				});
			} else if (Object.keys(this.getItems).includes(selected)) {
				this.setItems({
					...this.getItems,
					[selected]: newData
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.mod-content {
	flex: 1;
	overflow-x: scroll;

	.mod-avatar {
		display: flex;
		justify-content: center;
		padding: 16px;
		width: 128px;
		position: relative;
		margin: 0 auto;

		.backdrop {
			background-color: rgba(0, 0, 0, 0.5);
			position: absolute;
			left: 0;
			top: 16px;
			width: 128px;
			height: 128px;
			display: none;
		}

		&:hover {
			.backdrop {
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.mod-unit-avatar {
		width: 128px;
		height: 128px;
		object-fit: cover;
	}
}

.form-control {
	margin-bottom: 12px;

	input {
		border: 1px solid #ccc;
		border-radius: 4px;
		outline: 0;
		width: 100%;
		padding: 2px 8px;
		font-size: 16px;
		transition: all 0.2s;

		&:focus {
			box-shadow: 0px 0px 4px #3598dccc;
		}
	}
}

.mod-table {
	border-collapse: collapse;
	width: calc(100% - 2px);
	box-sizing: border-box;

	th,
	td {
		padding: 8px;
	}

	th {
		text-align: left;
		background-color: #1578ac;
		color: #fff;
		position: sticky;
		top: 0;
	}

	td {
		text-align: left;
		border: 1px solid #ccc;
	}
}

.wrap-cell {
	white-space: normal !important;
}

.expander {
	height: 38px;
}
</style>
