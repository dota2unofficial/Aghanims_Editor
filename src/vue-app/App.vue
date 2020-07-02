<template lang="html">
	<div id="app">
		<v-app>
			<Toolbar />
			<v-content>
				<div class="content">
					<Sidebar />
					<Editpane />
				</div>
			</v-content>
		</v-app>
	</div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import Editpane from './components/Editpane'

export default {
	name: "App",
	components: {
		Toolbar,
		Sidebar,
		Editpane,
	},
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
