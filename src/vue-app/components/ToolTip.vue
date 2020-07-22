<template>
	<div>
		<p>{{ description }}</p>
	</div>
</template>

<script>
export default {
	data: () => ({
		description: null
	}),
	beforeMount() {
		this.description = this.params.api.getDisplayedRowAtIndex(
			this.params.rowIndex
		).data;
	}
};
</script>
