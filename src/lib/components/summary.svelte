<script lang="ts">
	import { linearRegressionGraph } from '$lib/factories/graph.factory';
	import {
		calculatePearsonCorrelation,
		linearRegression,
		type Point
	} from '$lib/regression/LinearRegression';
	import type { DataService } from '$lib/services/dataService';
	import { difference } from 'd3';
	import { number } from 'mathjs';
	import { getContext } from 'svelte';

	const dataService: DataService = getContext('dataService');

	let pearsonCorrelation = {} as any;
	let lr = {} as any;

	if (dataService.Data) {
		dataService.Data$.subscribe((_data: any) => {
			lr = linearRegression(
				_data.map((d: any) => ({
					x: d['Weight'],
					y: d['Size']
				}))
			);
			pearsonCorrelation = calculatePearsonCorrelation(
				_data.map((d: any) => ({
					x: d['Weight'],
					y: d['Size']
				}))
			);
		});
	}
</script>

<div class="summary">
	<h3>Linear Regression of a Randomized Dataset</h3>
	<div class="poi">
		<b>Variance</b>
		{#each Object.entries(pearsonCorrelation) as [key, value]}
			{#if ['covariance', 'dependentVariance'].includes(key)}
				<p>{key}: {value}</p>
			{/if}
		{/each}
	</div>
	<div class="poi">
		<b>Sum of Squares</b>: {lr.sumOfSquares}
		<p>
			The sum of squares above is a matrix representing the sum of the squared differences between
			the projected line and the actual data plotted on each axis. Since we have two axis' we have a
			tuple
		</p>
	</div>
	<div class="poi">
		<b>Pearson Correlation</b>: {pearsonCorrelation.value}
		<p>---</p>
	</div>
</div>

<style lang="scss">
	.summary {
		margin: 1em;
	}
	.poi {
		border-top: dashed 1px;
		padding-top: 1em;
	}
</style>
