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
		</v-app>
	</div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import Editpane from './components/Editpane'
import { mapGetters } from 'vuex';

export default {
	name: "App",
	components: {
		Toolbar,
		Sidebar,
		Editpane,
	},
	computed: {
		...mapGetters([
			'getFileLoading'
		]),
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
