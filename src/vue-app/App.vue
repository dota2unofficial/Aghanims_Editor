<template lang="html">
	<div id="app">
		<Toolbar @setCategories="setCategories" />
		<div class="content">
			<Sidebar 
				:categories="categories"
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
	}),
	methods: {
		setCategories(categories) {
			this.categories = categories
		},
		onItemChanged(item) {
			this.details = this.categories[item]
		}
	}
};
</script>

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
