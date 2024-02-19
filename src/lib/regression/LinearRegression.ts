import { subset } from "d3";
import { matrix, identity, transpose, divide, multiply, lusolve, inv, concat } from "mathjs";

export interface Point {
	x: number,
	y: number
}

// const slope = Array.from({ length: 30 }, (_, i) =>
// 	Array.from({ length: 2 }, () => Math.random() * i)
// );
// const yIntercept = Array.f

export const fitLine = (data: Point[]) => {
	const _vectorA: number[][] = data.map((d) => [d.x, 1]);
	const _vectorB: number[] = data.map((d) => d.y)
	const _matrixA = matrix(_vectorA);
	const _transposeA = transpose(_matrixA);

	const A = multiply(_transposeA, _matrixA)
	const b = multiply(_transposeA, _vectorB)

	const C = multiply(inv(A), b)

	const slope = C.valueOf()[0] as number
	const yIntercept = C.valueOf()[1] as number

	const point1 = [0, yIntercept];
	const point2 = [data[data.length - 1].x, slope * (data[data.length - 1].x) + yIntercept];

	return [{ x: point1[0], y: point1[1] }, { x: point2[0], y: point2[1] }]

}

export const linearRegression = () => { }

// const SSE = (slope: number, yIntercept: number, line: Datum, data: Datum[]) => {
// 	data.map((_datum: Datum) => {
// 		const z = (slope * line.y + yIntercept) + _datum.y;
// 		return Math.pow(z, 2)
// 	})
// };

// export const leastSquares = (_yIntercept = yIntercept,_slope=slope) => {
//     const leastSquares = jstat.models.ols(_yIntercept,_slope);
//     console.log(leastSquares.R2,leastSquares.f.pvalue,leastSquares);
//     return leastSquares;
// }
