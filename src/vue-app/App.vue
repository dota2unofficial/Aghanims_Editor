<template lang="html">
	<div id="app">
		<v-app>
			<Toolbar
				@toggleDebugger="toggleDebugger"
				:localization="localizationData"
			/>
			<v-main>
				<div class="content">
					<Sidebar :localization="localizationData" />
					<Editpane :localization="localizationData" />
				</div>
			</v-main>

			<v-overlay :value="getFileLoading">
				<v-progress-linear
					indeterminate
					color="pink"
					style="width: 40vw"
					striped
				></v-progress-linear>
			</v-overlay>

			<v-overlay :value="getLocalizationLoading">
				<v-progress-linear
					indeterminate
					color="pink"
					style="width: 40vw"
					striped
				></v-progress-linear>
			</v-overlay>

			<Debugger
				:isVisible="isDebugger"
				@toggleDebugger="toggleDebugger"
			/>

			<Alert />
		</v-app>
	</div>
</template>

<script>
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import Editpane from "./components/Editpane";
import Alert from "./common/Alert";
import Debugger from "./common/Debugger";
import { mapGetters, mapActions, mapMutations } from "vuex";
import localizationMixin from "./mixin/localizationMixin";

export default {
	name: "App",
	mixins: [localizationMixin],
	components: {
		Toolbar,
		Sidebar,
		Editpane,
		Alert,
		Debugger
	},
	computed: {
		...mapGetters([
			"getFileLoading",
			"getLocalizationLoading",
			"getD2Found"
		])
	},
	methods: {
		...mapActions(["findD2Path"]),
		...mapMutations([
			"setLocalizationData",
			"setDefaultHeroes",
			"setDefaultAbilities",
			"setDefaultItems"
		]),
		toggleDebugger() {
			this.isDebugger = !this.isDebugger;
		}
	},
	created() {
		this.findD2Path();
	},
	async mounted() {
		this.localizationData = await this.getLocalization();
		const heroes = await this.getHeroData();
		const abilities = await this.getAbilitiesData();
		const items = await this.getItemsData();
		this.setLocalizationData(this.localizationData);
		this.setDefaultHeroes(heroes);
		this.setDefaultAbilities(abilities);
		this.setDefaultItems(items);
	},
	data: () => ({
		isDebugger: false,
		localizationData: {}
	})
};
</script>

<style src="ag-grid-community/dist/styles/ag-grid.css"></style>
<style src="ag-grid-community/dist/styles/ag-theme-alpine.css"></style>

<style lang="scss">
body {
	padding: 0;
	margin: 0;
}

ul {
	margin: 0;
}

.content {
	display: flex;
	height: calc(100vh - 64px);
	overflow-y: auto;
}

.ag-cell-inline-editing {
	overflow: visible !important;
	height: 100% !important;
}

.ag-popup-child {
	width: 49%;
}

.v-input__slot {
	.v-label {
		white-space: normal !important;
	}
}

.ag-tooltip {
	user-select: none !important;
}

.v-input--checkbox {
	.v-label {
		font-size: 12px;
	}
}

::-webkit-scrollbar {
	width: 0;
	background-color: transparent;
}
</style>
