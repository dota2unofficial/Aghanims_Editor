<template lang="html">
	<div id="app">
		<v-app>
			<Toolbar />
			<v-main>
				<div class="content">
					<Sidebar />
					<Editpane />
				</div>
			</v-main>
			
			<v-overlay
				:value="getFileLoading"
			>
				<v-progress-linear
					indeterminate 
					color="pink"
					style="width: 40vw"
					striped
				></v-progress-linear>
			</v-overlay>

			<v-overlay
				:value="getLocalizationLoading"
			>
				<v-progress-linear
					indeterminate 
					color="pink"
					style="width: 40vw"
					striped
				></v-progress-linear>
			</v-overlay>

			<Alert />
		</v-app>
	</div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import Editpane from './components/Editpane'
import Alert from './common/Alert'
import { mapGetters, mapActions } from 'vuex';

export default {
	name: "App",
	components: {
		Toolbar,
		Sidebar,
		Editpane,
		Alert,
	},
	computed: {
		...mapGetters([
			'getFileLoading',
			'getLocalizationLoading',
			'getD2Found',
		]),
	},
	methods: {
		...mapActions([
			'findD2Path',
			'loadLocalization',
		]),
	},
	created() {
		this.findD2Path()
	},
	watch: {
		getD2Found(found) {
			if (found) this.loadLocalization()
		}
	}
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
	height: calc(100vh - 48px);
	overflow-y: auto;
}
</style>
