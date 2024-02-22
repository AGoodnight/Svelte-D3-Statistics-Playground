<script lang="ts">
	import * as config from '$lib/constants/graphConfig.constants';
	import { random2DGraphData } from '$lib/factories/randomGraphData';
	import { linearRegression, type Point } from '$lib/regression/LinearRegression';
	import * as d3 from 'd3';

	const data = random2DGraphData('Weight', 'Size', 200, 100);

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

	const fittedLine = linearRegression(
		data.map((d) => ({
			x: d['Weight'],
			y: d['Size']
		}))
	).line.map((p: Point) => [p.x, p.y]);

	// console.log(JSON.stringify(data));

	const xExtent = d3.extent(data, (d) => d['Weight']);
	const yExtent = d3.extent(data, (d) => d['Size']);
	if (xExtent[0] === undefined || yExtent[0] === undefined) {
		throw Error('no extent');
	}

	$: lx = d3
		.scaleLinear()
		.domain(xExtent)
		.range([marginLeft, width - marginRight]);

	$: ly = d3
		.scaleLinear()
		.domain(yExtent)
		.range([height - marginBottom, marginTop]);

	$: line = d3
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

	$: d3.select(labelX)
		.text('Weight')
		.attr('x', marginLeft)
		.attr('y', innerHeight + marginTop + marginBottom / 1.2);

	$: d3.select(labelY)
		.text('Size')
		.attr('transform', `translate(0,${innerHeight + marginTop})`);
</script>

<svg {width} {height}>
	<g bind:this={gridlinesY} />
	<g bind:this={gridlinesX} />
	<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
	<g bind:this={gy} transform="translate({marginLeft},0)" />
	<text bind:this={labelX} />
	<text bind:this={labelY} />
	<g bind:this={observations} />
	<path stroke="black" stroke-width="2" d={line(fittedLine)} />
</svg>

<style>
	:global(.axis-grid line) {
		stroke: #ddd;
	}
</style>
