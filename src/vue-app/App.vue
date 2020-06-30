<template lang="html">
	<div id="app">
		<img src="@/assets/logo.png" />
	</div>
</template>

<script>

	"use strict";

	export default {
		name: "App",
		data: () => ({
			message: "Welcome to Your Vue.js App"
		})
	};
</script>

<style lang="scss">
	@charset "utf-8";

	#app {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}

	h1, h2 {
		font-weight: normal;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	a {
		color: #42b983;
	}
</style>
