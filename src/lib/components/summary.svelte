<script lang="ts">
	import { linearRegressionGraph } from '$lib/factories/graph.factory';
	import { calculatePearsonCorrelation, linearRegression, type Point } from '$lib/regression/LinearRegression';
	import type { DataService } from '$lib/services/dataService';
	import { number } from 'mathjs';
	import { getContext } from 'svelte';

	const dataService: DataService = getContext('dataService');

	let pearsonCorrelation = {} as any;
	let lr = {} as any;

	if (dataService.Data) {
		
		dataService.Data$.subscribe((_data: any) => {
			lr = linearRegression(
				_data.map((d:any) => ({
					x: d['Weight'],
					y: d['Size']
				}))
			)
			pearsonCorrelation = calculatePearsonCorrelation(
				_data.map((d: any) => ({
					x: d['Weight'],
					y: d['Size']
				}))
			);
		});
	}
</script>

{#each Object.entries(pearsonCorrelation) as [key,value]}
{#if ["covariance","dependentVariance"].includes(key)}
	<p>{key}: {value}</p>
{/if}
{/each}
<p><b>Sum of Squares</b>: {lr.sumOfSquares}</p>
<p><b>Correlation</b>: {pearsonCorrelation.value}</p>



<style lang="scss">
</style>
