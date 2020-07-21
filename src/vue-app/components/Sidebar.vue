<template>
	<v-navigation-drawer permanent ref="drawer" :width="navigationWidth">
		<v-sheet>
			<v-sheet class="pa-2">
				<v-text-field
					dense
					hide-details
					outlined
					v-model="filterString"
				></v-text-field>
			</v-sheet>
			<v-sheet class="treeview">
				<v-treeview
					:items="treeNodes"
					dense
					open-on-click
					selected-color="primary"
					hoverable
					activatable
					item-key="name"
					@update:active="onItemChanged"
					ref="treeView"
				>
					<template v-slot:label="{ item }">
						<span>
							{{ customLocalization(item.name) }}
						</span>
					</template>
					<template v-slot:prepend="{ item, leaf }">
						<v-img
							v-if="leaf"
							:src="getEntityIcon(item.name)"
							:width="24"
							:height="24"
							tile
							contain
						></v-img>
						<v-icon v-else>{{ mdiParent }}</v-icon>
					</template>
				</v-treeview>
			</v-sheet>
		</v-sheet>
		<v-sheet>
			<v-btn dark color="purple" block tile @click="collapseTree">
				<v-icon>{{ mdiCollapse }}</v-icon> Collapse
			</v-btn>
		</v-sheet>
	</v-navigation-drawer>
</template>

<script>
import fileMixin from "../mixin/fileMixin";
import localizationMixin from "../mixin/localizationMixin";
import { mapGetters, mapMutations, mapActions } from "vuex";
import fs, { existsSync } from "fs";

import { mdiAlienOutline, mdiClose } from "@mdi/js";

import { checkItemType } from "../utils/file";

export default {
	name: "Sidebar",
	mixins: [fileMixin, localizationMixin],
	data: () => ({
		navigationWidth: 300,
		filterString: "",
		mdiParent: mdiAlienOutline,
		mdiCollapse: mdiClose
	}),
	props: {
		localization: {
			type: Object,
			required: true
		}
	},
	computed: {
		...mapGetters([
			"getPath",
			"getUnits",
			"getHeros",
			"getAbilities",
			"getItems",
			"getAbilitiesOverride",
			"getTokens",
			"getCustomLocalization",
			"getDetails",
			"getPrecache",
			"getD2Path",
			"getPath",
			"getEntities"
		]),
		path() {
			return this.getPath;
		},
		units() {
			return Object.keys(this.getUnits)
				.filter(
					key => key.includes(this.filterString) && key !== "Version"
				)
				.filter(
					key =>
						key.includes("npc_dota_") &&
						!key.includes("npc_dota_hero") &&
						!key.includes("npc_dota_precache")
				)
				.sort((first, next) => {
					if (
						this.customLocalization(first) <
						this.customLocalization(next)
					)
						return -1;
					return 1;
				});
		},
		heros() {
			return Object.keys(this.getHeros)
				.filter(
					key => key.includes(this.filterString) && key !== "Version"
				)
				.sort((first, next) => {
					if (
						this.customLocalization(first) <
						this.customLocalization(next)
					)
						return -1;
					return 1;
				});
		},
		abilities() {
			return Object.keys(this.getAbilities)
				.filter(
					key => key.includes(this.filterString) && key !== "Version"
				)
				.sort((first, next) => {
					if (
						this.customLocalization(first) <
						this.customLocalization(next)
					)
						return -1;
					return 1;
				})
				.filter(
					key => this.customLocalization(key).indexOf("{s:value}") < 0
				);
		},
		overrideAbilities() {
			return Object.keys(this.getAbilitiesOverride)
				.filter(
					key => key.includes(this.filterString) && key !== "Version"
				)
				.sort((first, next) => {
					if (
						this.customLocalization(first) <
						this.customLocalization(next)
					)
						return -1;
					return 1;
				})
				.filter(
					key => this.customLocalization(key).indexOf("{s:value}") < 0
				);
		},
		items() {
			return Object.keys(this.getItems)
				.filter(
					key => key.includes(this.filterString) && key !== "Version"
				)
				.sort((first, next) => {
					if (
						this.customLocalization(first) <
						this.customLocalization(next)
					)
						return -1;
					return 1;
				});
		},
		precache() {
			return Object.keys(this.getPrecache)
				.filter(
					key => key.includes(this.filterString) && key !== "Version"
				)
				.sort((first, next) => {
					if (
						this.customLocalization(first) <
						this.customLocalization(next)
					)
						return -1;
					return 1;
				});
		},
		movable() {
			return this.units
				.map(item => ({ id: item, name: item }))
				.filter(
					item =>
						this.getUnits[item.id]["MovementCapabilities"] !==
						"DOTA_UNIT_CAP_MOVE_NONE"
				);
		},
		unmovable() {
			return this.units
				.map(item => ({ id: item, name: item }))
				.filter(
					item =>
						this.getUnits[item.id]["MovementCapabilities"] ===
						"DOTA_UNIT_CAP_MOVE_NONE"
				);
		},
		treeNodes() {
			return [
				{
					id: "CUSTOM_UNITS",
					name: "Units :",
					children: [
						{
							id: "CUSTOM_UNITS_MOVABLE",
							name: "Can Move :",
							children: this.movable
						},
						{
							id: "CUSTOM_UNITS_UNMOVABLE",
							name: "Cannot Move :",
							children: this.unmovable
						},
						{
							id: "CUSTOM_UNITS_ALL",
							name: "All :",
							children: [...this.movable, ...this.unmovable]
						}
					]
				},
				{
					id: "CUSTOM_HEROS",
					name: "Heros :",
					children: this.heros.map(item => ({ id: item, name: item }))
				},
				{
					id: "ABILITIES",
					name: "Abilities :",
					children: [
						{
							id: "CUSTOM_ABILITIES",
							name: "Override Abilities :",
							children: this.abilities
								.map(item => ({
									id: item,
									name: item
								}))
								.filter(
									item =>
										this.localization[
											`DOTA_Tooltip_ability_${item.id}`
										]
								)
						},
						{
							id: "CUSTOM_Abilities",
							name: "Custom Abilities :",
							children: this.abilities
								.map(item => ({
									id: item,
									name: item
								}))
								.filter(
									item =>
										this.getCustomLocalization[
											`DOTA_Tooltip_ability_${item.id}`
										]
								)
						}
					]
				},
				{
					id: "CUSTOM ITEMS",
					name: "Items :",
					children: this.items.map(item => ({ id: item, name: item }))
				},
				{
					id: "CUSTOM_PRECACHE",
					name: "Precache :",
					children: this.precache.map(item => ({
						id: item,
						name: item
					}))
				}
			];
		}
	},
	methods: {
		...mapMutations(["setDetails", "setSelected", "setCurrentAvatar"]),
		...mapActions(["addDebugLogs"]),
		onItemChanged(item) {
			if (item.length === 0) {
				this.setSelected("");
				return;
			}
			const selectedKey = item[0];
			if (
				selectedKey === "Units :" ||
				selectedKey === "Abilities :" ||
				selectedKey === "Heros: " ||
				selectedKey === "Override Abilities :" ||
				selectedKey === "Precache :" ||
				selectedKey === "Can Move :" ||
				selectedKey === "Cannot Move :" ||
				selectedKey === "All :"
			)
				return;

			this.setSelected(selectedKey);
			const itemType = this.checkItemType(selectedKey);
			this.addDebugLogs(`Custom Unit ${item} is loaded.`);

			const defaultPath = `file:\\${process.cwd()}\\${
				process.env.NODE_ENV === "development" ? "" : "resources\\"
			}assets\\`;
			let avatarPath = "";
			let selectedEntity;

			switch (itemType) {
				case "UNIT":
					selectedEntity = this.getUnits[selectedKey];
					avatarPath = selectedEntity.Model.replace(".vmdl", ".png");
					break;
				case "HERO":
					selectedEntity = this.getHeros[selectedKey];
					if (selectedEntity['Model'])
						avatarPath = `${selectedEntity['Model'].replace('.vmdl', '_full.png')}`;
					else
						avatarPath = `heroes\\${selectedKey}.png`;
					break;
				case "ITEM":
					selectedEntity = this.getItems[selectedKey];
					avatarPath = `items\\${selectedKey.replace(
						"item_",
						""
					)}_png.png`;
					break;
				case "ABILITY":
					selectedEntity = this.getAbilities[selectedKey];
					const texture = selectedEntity["AbilityTextureName"];
					if (fs.existsSync(texture))
						avatarPath = `spells\\${texture}_icon.png`;
					avatarPath = `spells\\${selectedKey}_png.png`;
					break;
				case "PRECACHE":
					selectedEntity = this.getPrecache[selectedKey];
					avatarPath = selectedKey.replace("npc_precache_", "");
					break;
			}

			this.setDetails(selectedEntity);
			this.setCurrentAvatar(`${defaultPath}${avatarPath}`);
			console.log(defaultPath + avatarPath)
		},
		setBorderWidth() {
			const node = this.$refs.drawer.$el.querySelector(
				".v-navigation-drawer__border"
			);
			node.style.width = `3px`;
			node.style.cursor = "ew-resize";
			node.style.backgroundColor = "primary";
		},
		setDragEvents() {
			const minSize = 3;
			const el = this.$refs.drawer.$el;
			const drawerBorder = el.querySelector(
				".v-navigation-drawer__border"
			);
			const vm = this;
			const direction = "left";

			const resize = e => {
				document.body.style.cursor = "ew-resize";
				el.style.width = `${e.clientX}px`;
			};

			drawerBorder.addEventListener(
				"mousedown",
				e => {
					if (e.offsetX < 3) {
						el.style.transition = "initial";
						document.addEventListener("mousemove", resize, false);
						this.addDebugLogs(`Sidebar is resized.`);
					}
				},
				false
			);

			document.addEventListener("mouseup", () => {
				el.style.transition = "";
				document.body.style.cursor = "";
				this.navigationWidth = el.style.width;
				document.removeEventListener("mousemove", resize, false);
			});
		},
		customLocalization(key) {
			let filteredKey, altKey;

			switch (checkItemType(key)) {
				case "HERO":
				case "UNIT":
					filteredKey = key;
					break;
				case "ITEM":
				case "ABILITY":
					filteredKey = `DOTA_Tooltip_ability_${key}`;
					altKey = `DOTA_Tooltip_Ability_${key}`;
					break;
				case "PRECACHE":
					filteredKey = key.replace("npc_precache_", "");
					break;
			}

			return this.localization[filteredKey]
				? this.localization[filteredKey]
				: this.getCustomLocalization[filteredKey]
				? this.getCustomLocalization[filteredKey]
				: this.localization[altKey]
				? this.localization[altKey]
				: key;
		},
		getEntityIcon(entity) {
			const defaultPath = `file:\\${process.cwd()}\\${
				process.env.NODE_ENV === "development" ? "" : "resources\\"
			}assets`;

			if (this.units.includes(entity)) {
				if (this.getUnits[entity].Model)
					return `${defaultPath}\\${this.getUnits[entity].Model.split(
						"/"
					)
						.join("\\")
						.replace(".vmdl", ".png")}`;
				return "";
			}
			if (this.precache.includes(entity)) {
				return `${defaultPath}\\heroes\\${entity.replace(
					"npc_precache_",
					""
				)}.png`;
			}
			if (this.items.includes(entity)) {
				if (this.getItems[entity].Model)
					return `${defaultPath}\\${this.getItems[entity].Model.split(
						"/"
					)
						.join("\\")
						.replace(".vmdl", ".png")}`;
				return `${defaultPath}\\items\\${entity.replace("item_", "")}_png.png`;
			}
			if (this.abilities.includes(entity)) {
				if (this.getAbilities[entity]["AbilityTextureName"]) {
					if (
						fs.existsSync(
							`${this.getD2Path}\\dota_addons\\${this.getPath}\\resource\\flash3\\images\\spellicons\\${this.getAbilities[entity]["AbilityTextureName"]}_lua.png`
						)
					)
						return `${this.getD2Path}\\dota_addons\\${this.getPath}\\resource\\flash3\\images\\spellicons\\${this.getAbilities[entity]["AbilityTextureName"]}_lua.png`;
					else
						return `${this.getD2Path}\\dota_addons\\${this.getPath}\\resource\\flash3\\images\\spellicons\\${this.getAbilities[entity]["AbilityTextureName"]}.png`;
				}
				return `${defaultPath}\\spells\\${entity}_png.png`;
			}
			if (this.heros.includes(entity)) {
				if (this.getHeros[entity].Model) {
					return `${defaultPath}\\${this.getHeros[entity].Model}`.replace('.vmdl', '_full.png');
				}
				return `${defaultPath}\\heroes\\${entity}.png`;
			}
		},
		collapseTree() {
			const tree = this.$refs.treeView;
			tree.updateAll(false);
		},
		checkItemType(key) {
			if (key.includes("npc_dota_hero")) return "HERO";
			else if (key.includes("npc_dota_precache")) return "PRECACHE";
			else if (key.includes("npc_dota")) return "UNIT";
			else if (key.includes("item_")) return "ITEM";
			else return "ABILITY";
		}
	},
	mounted() {
		this.setBorderWidth();
		this.setDragEvents();
	}
};
</script>

<style lang="scss" scoped>
.treeview {
	height: calc(100vh - 156px) !important;
	overflow-y: auto;
}
</style>
