<script lang="ts">
	import { calculatePearsonCorrelation } from '$lib/regression/LinearRegression';
	import type { DataService } from '$lib/services/dataService';
	import { number } from 'mathjs';
	import { getContext } from 'svelte';

	const dataService: DataService = getContext('dataService');

	$: pearsonCorrelation = 0;

	if (dataService.Data) {
		dataService.Data$.subscribe((_data: any) => {
			pearsonCorrelation = calculatePearsonCorrelation(
				_data.map((d: any) => ({
					x: d['Weight'],
					y: d['Size']
				}))
			);
		});
	}
</script>

<h4>Correlation: {pearsonCorrelation}</h4>

<style lang="scss">
</style>
