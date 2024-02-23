<script lang="ts">
	import * as config from '$lib/constants/graphConfig.constants';
	import { random2DGraphData } from '$lib/factories/randomGraphData';
	import { linearRegression, type Point } from '$lib/regression/LinearRegression';
	import type { DataService } from '$lib/services/dataService';
	import * as d3 from 'd3';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { Subject, takeUntil } from 'rxjs';

	let dataService: DataService = getContext('dataService');
	let onMounted: Subject<void> = new Subject();
	let onDestroyed: Subject<void> = new Subject();
	let dataSet$: Subject<Record<string, number>[]> = new Subject();
	let dataSet: Record<string, number>[];

	onMount(() => {
		dataService.Data$.subscribe((_data: any) => {
			dataSet$.next(_data);
		});
		onMounted.next();
	});

	onDestroy(() => {
		onDestroyed.next();
	});

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
	let labelX: any = undefined;
	let labelY: any = undefined;
	let xExtent: any = undefined;
	let yExtent: any = undefined;
	let x: any = undefined;
	let y: any = undefined;
	let lx: any = undefined;
	let ly: any = undefined;
	let line: any = undefined;

	const fittedLine: Promise<Iterable<[number, number]>> = new Promise<Iterable<[number, number]>>(
		(resolve, reject) => {
			dataSet$.pipe(takeUntil(onDestroyed)).subscribe((_dataSet) => {
				dataSet = _dataSet;
				resolve(
					linearRegression(
						_dataSet.map((d) => ({
							x: d['Weight'],
							y: d['Size']
						}))
					).line.map((p: Point) => [p.x, p.y])
				);
			});
		}
	);

	$: if (dataSet) {
		xExtent = d3.extent(dataSet, (d) => d['Weight']);
		yExtent = d3.extent(dataSet, (d) => d['Size']);
	}

	$: if (xExtent && yExtent) {
		lx = d3
			.scaleLinear()
			.domain(xExtent)
			.range([marginLeft, width - marginRight]);
		ly = d3
			.scaleLinear()
			.domain(yExtent)
			.range([height - marginBottom, marginTop]);
		x = d3
			.scaleLinear()
			.domain(xExtent)
			.range([marginLeft, width - marginRight]);
		y = d3
			.scaleLinear()
			.domain(yExtent)
			.range([height - marginBottom, marginTop]);
	}

	$: if (lx && ly) {
		line = d3
			.line()
			.x((d) => {
				const v = lx(d[0]);
				return v;
			})
			.y((d) => {
				const v = ly(d[1]);
				// console.log(d);
				return v;
			});
	}

	$: if (dataSet && x && y) {
		d3.select(gx).call(d3.axisBottom(x));
		d3.select(gy).call(d3.axisLeft(y));
		d3.select(observations)
			.selectAll('circle')
			.data(dataSet)
			.join('circle')
			.attr('cx', (d) => x(d['Weight']))
			.attr('cy', (d) => y(d['Size']))
			.attr('r', 3);

		d3.select(gridlinesY)
			.attr('class', 'y axis-grid')
			.call(
				d3
					.axisLeft(y)
					.tickSize(-innerWidth)
					.tickFormat(() => '')
			)
			.attr('transform', `translate(${marginLeft},0)`);

		d3.select(gridlinesX)
			.attr('class', 'x axis-grid')
			.call(
				d3
					.axisBottom(x)
					.tickSize(-innerHeight)
					.tickFormat(() => '')
			)
			.attr('transform', `translate(0,${innerHeight + marginTop})`);

		d3.select(labelX)
			.text('Weight')
			.attr('x', marginLeft)
			.attr('y', innerHeight + marginTop + marginBottom / 1.2);

		d3.select(labelY)
			.text('Size')
			.attr('transform', `translate(0,${innerHeight + marginTop})`);
	}
</script>

{#await fittedLine}
	Loading
{:then value}
	{#if lx && ly}
		<svg {width} {height}>
			<g bind:this={gridlinesY} />
			<g bind:this={gridlinesX} />
			<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
			<g bind:this={gy} transform="translate({marginLeft},0)" />
			<text bind:this={labelX} />
			<text bind:this={labelY} />
			<g bind:this={observations} />
			<path stroke="black" stroke-width="2" d={line(value)} />
		</svg>
	{/if}
{/await}

<style>
	:global(.axis-grid line) {
		stroke: #ddd;
	}
</style>
