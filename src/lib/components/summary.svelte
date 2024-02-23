<script lang="ts">
	import { calculatePearsonCorrelation } from '$lib/regression/LinearRegression';
	import type { DataService } from '$lib/services/dataService';
	import { getContext } from 'svelte';

	const dataService: DataService = getContext('dataService');

	$: pearsonCorrelation = calculatePearsonCorrelation(
		dataService.Data.map((d) => ({
			x: d['Weight'],
			y: d['Size']
		}))
	);
</script>

<h4>Correlation: {pearsonCorrelation}</h4>

<style lang="scss">
</style>
