import { subset } from "d3";
import solve from '$lib/forks/guassianElimination'
import { matrix, identity, transpose, divide, multiply, lusolve, inv, concat } from "mathjs";

export interface Point {
	x: number,
	y: number
}

export const fitLine = (data: Point[]) => {
	const _vectorA: number[][] = data.map((d) => [d.x, 1]);
	const _vectorB: number[] = data.map((d) => d.y)

	const _matrixA = matrix(_vectorA);
	const _matrixB = matrix(_vectorB);
	const _transposeA = transpose(_matrixA);

	const A = multiply(_transposeA, _matrixA)
	const b = multiply(_transposeA, _matrixB)

	// using the inverse gives the same result as Gaussian Elimnation
	const C = multiply(inv(A), b)
	// console.log(solve(A.valueOf(), b.valueOf()));
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
