<template lang="html">
	<div id="app">
		<Toolbar 
			@setCategories="setCategories" 
			@folderLoad="setFolder"
		/>
		<div class="content">
			<Sidebar 
				:categories="categories"
				:path="folderPath"
				@itemChanged="onItemChanged"
			/>
			<Editpane :details="details" />
		</div>
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
	data: () => ({
		categories: {},
		details: {},
		folderPath: ''
	}),
	methods: {
		setCategories(categories) {
			this.categories = categories
		},
		onItemChanged(item) {
			this.details = this.categories[item]
		},
		setFolder(path) {
			this.folderPath = path
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
	height: calc(100vh - 49px);
	overflow-y: auto;
}
</style>
