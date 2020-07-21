import Vue from "vue";
import Vuex from "vuex";

import { findSteamAppById } from "find-steam-app";
import fs from "fs";
import chardet from "chardet";
import vdfextra from "vdf-extra";
const vdfplus = require("vdfplus");

import { getData, checkItemType } from "./utils/file";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		entities: {},
		path: null,
		units: {},
		heros: {},
		abilities: {},
		ablitiesOverride: {},
		precache: {},
		details: {},
		items: {},
		selected: null,
		fileLoading: false,
		d2Found: false,
		d2Path: null,
		localization: {},
		localizationLoading: false,
		customLocalization: {},
		debugLogs: [],
		availability: true,
		currentAvatar: "",
		localizationData: {},
		hideValueType: false
	},
	getters: {
		getPath: state => state.path,
		getUnits: state => state.units,
		getHeros: state => state.heros,
		getAbilities: state => state.abilities,
		getItems: state => state.items,
		getAbilitiesOverride: state => state.ablitiesOverride,
		getPrecache: state => state.precache,
		getDetails: state => state.details,
		getSelected: state => state.selected,
		getFileLoading: state => state.fileLoading,
		getD2Found: state => state.d2Found,
		getD2Path: state => state.d2Path,
		getLocalization: state => state.localization,
		getLocalizationLoading: state => state.localizationLoading,
		getDebugLogs: state => state.debugLogs,
		getCustomLocalization: state => state.customLocalization,
		getAbility: state => state.availability,
		getCurrentAvatar: state => state.currentAvatar,
		getLocalizationData: state => state.localizationData,
		getHideValueType: state => state.hideValueType
	},
	mutations: {
		setPath(state, path) {
			state.path = path;
		},
		setUnits(state, units) {
			state.units = units;
		},
		setHeros(state, heros) {
			state.heros = heros;
		},
		setAbilities(state, abilities) {
			state.abilities = abilities;
		},
		setItems(state, items) {
			state.items = items;
		},
		setAbilitiesOverride(state, abilities) {
			state.ablitiesOverride = abilities;
		},
		setPrecache(state, precache) {
			state.precache = precache;
		},
		setDetails(state, details) {
			state.details = details;
		},
		setSelected(state, selected) {
			state.selected = selected;
		},
		setFileLoading(state, loading) {
			state.fileLoading = loading;
		},
		setD2Found(state, found) {
			state.d2Found = found;
		},
		setD2Path(state, path) {
			state.d2Path = path;
		},
		setLocalization(state, localization) {
			state.localization = localization;
		},
		setLocalizationLoading(state, loading) {
			state.localizationLoading = loading;
		},
		setDebugLogs(state, logs) {
			state.debugLogs = logs;
		},
		setCustomLocalization(state, localization) {
			state.customLocalization = localization;
		},
		setAbility(state, availability) {
			state.availability = availability;
		},
		setCurrentAvatar(state, avatar) {
			state.currentAvatar = avatar;
		},
		setLocalizationData(state, localization) {
			state.localizationData = localization;
		},
		setHideValueType(state, payload) {
			state.hideValueType = payload;
		}
	},
	actions: {
		async findD2Path({ commit }) {
			let dota2Path = "";
			try {
				dota2Path = await findSteamAppById(570);
				if (dota2Path === undefined) {
					commit("setD2Found", false);
					return;
				}
				commit("setD2Found", true);
			} catch (err) {
				commit(
					"setD2Path",
					"D:\\steam\\steamapps\\common\\dota 2 beta\\game"
				);
				commit("setD2Found", true);
				throw err;
			}
			commit("setD2Path", `${dota2Path}\\game`);
		},
		addDebugLogs({ commit, getters }, log) {
			commit("setDebugLogs", [...getters.getDebugLogs, log]);
		},
		loadCustomLocalization({ commit, getters }, mod) {
			const filePath = `${getters.getD2Path}\\dota_addons\\${mod}\\resource\\addon_english.txt`;
			const encoding = chardet.detectFileSync(filePath);
			const result = fs.readFileSync(filePath, encoding);
			const root = vdfextra.parse(result, { parseUnquotedStrings: true });
			commit("setCustomLocalization", root.Tokens);
		},
		analyzeFullEntities({ commit, dispatch, getters }, folder) {
			const path = getters.getD2Path + "\\dota_addons\\" + folder;
			const unitPath = `${path}\\scripts\\npc\\npc_units_custom.txt`;
			const heroPath = `${path}\\scripts\\npc\\npc_heroes_custom.txt`;
			const abilitiesPath = `${path}\\scripts\\npc\\npc_abilities_custom.txt`;
			const itemsPath = `${path}\\scripts\\npc\\npc_items_custom.txt`;
			const abilitiesOverridePath = `${path}\\scripts\\npc\\npc_abilities_override.txt`;
			const precachePath = `${path}\\scripts\\npc\\npc_unit_precache.txt`;

			commit("setPath", folder);
			commit("setFileLoading", true);
			dispatch("loadCustomLocalization", folder);

			Promise.all([
				getData(unitPath, "utf8"),
				getData(heroPath, "utf8"),
				getData(abilitiesPath, "utf8"),
				getData(itemsPath, "utf8"),
				getData(abilitiesOverridePath, "utf8"),
				getData(precachePath, "utf8")
			])
				.then(
					([
						units,
						heros,
						abilities,
						items,
						abilitiesOverride,
						precache
					]) => {
						const fullEntities = {
							...vdfplus.parse(units).DOTAUnits,
							...vdfplus.parse(heros).DOTAHeroes,
							...vdfplus.parse(abilities).DOTAAbilities,
							...vdfplus.parse(items).DOTAAbilities,
							...vdfplus.parse(abilitiesOverride).DOTAAbilities,
							...vdfplus.parse(precache).DOTAUnits
						};

						Object.keys(fullEntities).forEach(entity => {
							switch (checkItemType(entity)) {
								case "HERO":
									commit("setHeros", {
										...getters.getHeros,
										[entity]: fullEntities[entity]
									});
									break;
								case "ITEM":
									commit("setItems", {
										...getters.getItems,
										[entity]: fullEntities[entity]
									});
									break;
								case "UNIT":
									commit("setUnits", {
										...getters.getUnits,
										[entity]: fullEntities[entity]
									});
									break;
								case "ABILITY":
									commit("setAbilities", {
										...getters.getAbilities,
										[entity]: fullEntities[entity]
									});
									break;
								case "PRECACHE":
									commit("setPrecache", {
										...getters.getPrecache,
										[entity]: fullEntities[entity]
									});
									break;
							}
						});
					}
				)
				.finally(() => commit("setFileLoading", false));
		}
	}
});

export default store;
