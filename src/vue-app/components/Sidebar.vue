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
			<v-sheet>
				<v-expansion-panels accordion hover tile>
					<v-expansion-panel>
						<v-expansion-panel-header class="panel-header"
							>Units</v-expansion-panel-header
						>
						<v-expansion-panel-content class="expansion-panel-content">
							<v-treeview
								:items="unitTree"
								dense
								open-on-click
								selected-color="primary"
								hoverable
								activatable
								item-key="name"
								@update:active="onItemChanged"
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
						</v-expansion-panel-content>
					</v-expansion-panel>

					<v-expansion-panel>
						<v-expansion-panel-header class="panel-header"
							>Heroes</v-expansion-panel-header
						>
						<v-expansion-panel-content class="expansion-panel-content">
							<v-treeview
								:items="heroTree"
								dense
								open-on-click
								selected-color="primary"
								hoverable
								activatable
								item-key="name"
								@update:active="onItemChanged"
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
						</v-expansion-panel-content>
					</v-expansion-panel>

					<v-expansion-panel>
						<v-expansion-panel-header class="panel-header"
							>Abilities</v-expansion-panel-header
						>
						<v-expansion-panel-content class="expansion-panel-content">
							<v-treeview
								:items="abilityTree"
								dense
								open-on-click
								selected-color="primary"
								hoverable
								activatable
								item-key="name"
								@update:active="onItemChanged"
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
						</v-expansion-panel-content>
					</v-expansion-panel>

					<v-expansion-panel>
						<v-expansion-panel-header class="panel-header"
							>Items</v-expansion-panel-header
						>
						<v-expansion-panel-content class="expansion-panel-content">
							<v-treeview
								:items="itemTree"
								dense
								open-on-click
								selected-color="primary"
								hoverable
								activatable
								item-key="name"
								@update:active="onItemChanged"
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
						</v-expansion-panel-content>
					</v-expansion-panel>

					<v-expansion-panel>
						<v-expansion-panel-header class="panel-header"
							>Precache</v-expansion-panel-header
						>
						<v-expansion-panel-content class="expansion-panel-content">
							<v-treeview
								:items="precacheTree"
								dense
								open-on-click
								selected-color="primary"
								hoverable
								activatable
								item-key="name"
								@update:active="onItemChanged"
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
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-sheet>
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
		unitTree() {
			return [
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
			];
		},
		heroTree() {
			return this.heros.map(item => ({ id: item, name: item }));
		},
		abilityTree() {
			return [
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
			];
		},
		itemTree() {
			return this.items.map(item => ({ id: item, name: item }));
		},
		precacheTree() {
			return this.precache.map(item => ({
				id: item,
				name: item
			}));
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
			const itemType = checkItemType(selectedKey);
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
					if (selectedEntity["Model"])
						avatarPath = `${selectedEntity["Model"].replace(
							".vmdl",
							"_full.png"
						)}`;
					else avatarPath = `heroes\\${selectedKey}.png`;
					break;
				case "ITEM":
					selectedEntity = this.getItems[selectedKey];
					avatarPath = `items\\${selectedKey.replace(
						"item_",
						""
					)}.png`;
					break;
				case "ABILITY":
					selectedEntity = this.getAbilities[selectedKey];
					const texture = selectedEntity["AbilityTextureName"];
					if (fs.existsSync(texture))
						avatarPath = `spells\\${texture}_icon.png`;
					avatarPath = `spells\\${selectedKey}.png`;
					break;
				case "PRECACHE":
					selectedEntity = this.getPrecache[selectedKey];
					avatarPath = `heroes\\${selectedKey.replace("npc_precache_", "")}.png`;
					break;
			}

			this.setDetails(selectedEntity);
			this.setCurrentAvatar(`${defaultPath}${avatarPath}`);
		},
		setBorderWidth() {
			const node = this.$refs.drawer.$el.querySelector(
				".v-navigation-drawer__border"
			);
			node.style.width = `3px`;
			node.style.cursor = "ew-resize";
			node.style.zIndex = 100;
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
				return `${defaultPath}\\items\\${entity.replace(
					"item_",
					""
				)}.png`;
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
				return `${defaultPath}\\spells\\${entity}.png`;
			}
			if (this.heros.includes(entity)) {
				if (
					this.getHeros[entity].Model &&
					!fs.existsSync(`${defaultPath}\\heroes\\${entity}.png`)
				) {
					return `${defaultPath}\\${this.getHeros[entity].Model}`.replace(
						".vmdl",
						"_full.png"
					);
				}
				return `${defaultPath}\\heroes\\${entity}.png`;
			}
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
.expansion-panel-content {
	max-height: calc(100vh - 377px);
	padding-top: 16px;
	overflow: auto;
}

.panel-header {
	position: relative;

	&:after {
		content: "";
		position: absolute;
		bottom: -1px;
		height: 1px;
		left: 0;
		right: 0;
		background-color: #ccc;
	}
}
</style>
