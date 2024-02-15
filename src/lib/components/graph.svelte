<script lang="ts">
	import * as config from '$lib/constants/graphConfig.constants';
	import { random2DGraphData } from '$lib/factories/randomGraphData';
	import * as d3 from 'd3';
	// import { leastSquares } from "$lib/regression/LinearRegression.svelte";
	export let name = 'Graph page';

	const data = random2DGraphData(100, 20, 'Weight', 'Size');

	const {
		width,
		height,
		innerHeight,
		innerWidth,
		marginBottom,
		marginLeft,
		marginRight,
		marginTop
	} = config;

	let gx: any = undefined;
	let gy: any = undefined;
	let observations: any = undefined;
	let gridlinesX: any = undefined;
	let gridlinesY: any = undefined;
	let line: any = undefined;

	const xExtent = d3.extent(data, (d) => d['Weight']);
	const yExtent = d3.extent(data, (d) => d['Size']);
	if (xExtent[0] === undefined || yExtent[0] === undefined) {
		throw Error('no extent');
	}

	$: x = d3
		.scaleLinear()
		.domain(xExtent)
		.range([marginLeft, width - marginRight]);

	$: y = d3
		.scaleLinear()
		.domain(yExtent)
		.range([height - marginBottom, marginTop]);

	// $: yGridLines = d3.axisBottom(x).tickSize(-innerHeight);

	$: d3.select(gx).call(d3.axisBottom(x));
	$: d3.select(gy).call(d3.axisLeft(y));

	$: d3.select(observations)
		.selectAll('circle')
		.data(data)
		.join('circle')
		.attr('cx', (d) => x(d['Weight']))
		.attr('cy', (d) => y(d['Size']))
		.attr('r', 3);

	$: d3.select(gridlinesY)
		.attr('class', 'y axis-grid')
		.call(
			d3
				.axisLeft(y)
				.tickSize(-innerWidth)
				.tickFormat(() => '')
		)
		.attr('transform', `translate(${marginLeft},0)`);

	$: d3.select(gridlinesX)
		.attr('class', 'x axis-grid')
		.call(
			d3
				.axisBottom(x)
				.tickSize(-innerHeight)
				.tickFormat(() => '')
		)
		.attr('transform', `translate(0,${innerHeight + marginTop})`);
</script>

<h1>{name}</h1>
<svg {width} {height}>
	<g bind:this={gridlinesY} />
	<g bind:this={gridlinesX} />
	<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
	<g bind:this={gy} transform="translate({marginLeft},0)" />
	<g bind:this={observations} />
	<g bind:this={line} />
</svg>

<style>
	:global(.axis-grid line) {
		stroke: #ddd;
	}
</style>
