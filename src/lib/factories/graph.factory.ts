import * as config from '$lib/constants/graphConfig.constants';
import { linearRegression, type Point } from '$lib/regression/LinearRegression';
import * as d3 from 'd3';

export interface GraphNodes {
    fittedLine: any;
    observations?: any;
    line: d3.Line<[number, number]>;
    axisBottom: d3.Axis<d3.NumberValue>;
    axisLeft: d3.Axis<d3.NumberValue>;
    gridLinesX: d3.Axis<d3.NumberValue>;
    gridLinesY: d3.Axis<d3.NumberValue>;
    x: d3.ScaleLinear<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
    lx: d3.ScaleLinear<number, number, never>;
    ly: d3.ScaleLinear<number, number, never>;
}

export const linearRegressionGraph = (dataSet: Record<string, number>[]): GraphNodes => {

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

    const xExtent = d3.extent(dataSet, (d) => d['Weight']) as Iterable<d3.NumberValue>;
    const yExtent = d3.extent(dataSet, (d) => d['Size']) as Iterable<d3.NumberValue>;

    if (xExtent === undefined && yExtent === undefined) {
        throw ("No extent, aborting graph generation");
    }

    const lx = d3
        .scaleLinear()
        .domain(xExtent)
        .range([marginLeft, width - marginRight]);

    const ly = d3
        .scaleLinear()
        .domain(yExtent)
        .range([height - marginBottom, marginTop]);
    const x = d3
        .scaleLinear()
        .domain(xExtent)
        .range([marginLeft, width - marginRight]);
    const y = d3
        .scaleLinear()
        .domain(yExtent)
        .range([height - marginBottom, marginTop]);

    const gridLinesX = d3
        .axisBottom(x)
        .tickSize(-innerHeight)
        .tickFormat(() => '')

    const gridLinesY = d3
        .axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat(() => '')

    const axisBottom = d3.axisBottom(x);
    const axisLeft = d3.axisLeft(y);

    const line = d3
        .line()
        .x((d) => {
            const v = lx(d[0]);
            console.log(`X:${v}`);
            return v;
        })
        .y((d) => {
            const v = ly(d[1]);
            console.log(`Y:${v}`);
            return v;
        });

    const fittedLine: Iterable<[number, number]> = linearRegression(
        dataSet.map((d) => ({
            x: d['Weight'],
            y: d['Size']
        }))
    ).line.map((p: Point) => [p.x, p.y])

    return {
        fittedLine,
        line,
        axisBottom,
        axisLeft,
        gridLinesX,
        gridLinesY,
        x,
        y,
        lx,
        ly
    }

}