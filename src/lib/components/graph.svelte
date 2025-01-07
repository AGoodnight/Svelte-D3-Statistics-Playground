<script lang="ts">
	import * as config from '$lib/constants/graphConfig.constants';
	import type { DataService } from '$lib/services/dataService';
	import * as d3 from 'd3';

	import { getContext, onDestroy, onMount } from 'svelte';
	import { Subject } from 'rxjs';
	import { linearRegressionGraph } from '$lib/factories/graph.factory';

	let dataService: DataService = getContext('dataService');
	let onDestroyed: Subject<void> = new Subject();

	onMount(() => {
		dataService.Data$.subscribe((_data: Record<string, number>[]) => {
			const graph = linearRegressionGraph(_data);

			d3.select(axisBottom).call(graph.axisBottom);
			d3.select(axisLeft).call(graph.axisLeft);
			d3.select(observations)
				.selectAll('circle')
				.data(_data)
				.join('circle')
				.attr('cx', (d) => graph.x(d['Weight']))
				.attr('cy', (d) => graph.y(d['Size']))
				.attr('r', 3);

			d3.select(gridlinesY)
				.call(graph.gridLinesY)
				.attr('class', 'y axis-grid')
				.attr('transform', `translate(${marginLeft},0)`);

			d3.select(gridlinesX)
				.call(graph.gridLinesX)
				.attr('class', 'x axis-grid')
				.attr('transform', `translate(0,${innerHeight + marginTop})`);

			d3.select(labelX)
				.text('Weight')
				.attr('x', marginLeft)
				.attr('y', innerHeight + marginTop + marginBottom / 1.2);

			d3.select(labelY)
				.text('Size')
				.attr('transform', `translate(0,${innerHeight + marginTop})`);

			line = graph.line(graph.fittedLine);
		});
	});

	onDestroy(() => {
		onDestroyed.next();
	});

	const { width, height, innerHeight, marginBottom, marginLeft, marginTop } = config;

	let axisBottom: any = undefined;
	let axisLeft: any = undefined;
	let observations: any = undefined;
	let gridlinesX: any = undefined;
	let gridlinesY: any = undefined;
	let labelX: any = undefined;
	let labelY: any = undefined;
	let line: any = undefined;
</script>

<body>
	<svg {width} {height}>
		<g bind:this={gridlinesY} />
		<g bind:this={gridlinesX} />
		<g bind:this={axisBottom} transform="translate(0,{height - marginBottom})" />
		<g bind:this={axisLeft} transform="translate({marginLeft},0)" />
		<text bind:this={labelX} />
		<text bind:this={labelY} />
		<g bind:this={observations} />
		<path stroke="black" stroke-width="2" d={line} />
	</svg>
</body>

<style>
	:global(.axis-grid line) {
		stroke: #ddd;
	}
</style>
