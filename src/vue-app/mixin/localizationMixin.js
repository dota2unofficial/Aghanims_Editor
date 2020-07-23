import { getLocalization } from "dota-data/lib/localization";
import { getHeroes, getAbilities, getItems } from "dota-data/lib/scripts";

export default {
	methods: {
		async getLocalization() {
			try {
				const localization = await getLocalization("english", {
					cache: { path: "./localization", preferCached: true }
				});
				return localization;
			} catch (err) {
				throw err;
			}
		},
		async getHeroData() {
			try {
				const hero = await getHeroes("english", {
					cache: { path: "./localization", preferCached: true }
				});
				return hero;
			} catch (err) {
				throw err;
			}
		},
		async getAbilitiesData() {
			try {
				const abilites = await getAbilities("english", {
					cache: { path: "./localization", preferCached: true }
				});
				return abilites;
			} catch (err) {
				throw err;
			}
		},
		async getItemsData() {
			try {
				const items = await getItems("english", {
					cache: { path: "./localization", preferCached: true }
				});
				return items;
			} catch (err) {
				throw err;
			}
		}
	}
};
