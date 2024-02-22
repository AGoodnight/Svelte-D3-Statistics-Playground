import { matrix, transpose, multiply, inv, Matrix } from "mathjs";

export interface Point {
	x: number,
	y: number
}

const addBiasTerm = (data: Point[]) => {
	return data.map((d) => [1, d.y]);
}

export const matrixSumOfSquares = (data: Point[]): Matrix => {
	const _vectorA: number[][] = data.map((d) => [d.x, 1]);
	const _vectorB: number[] = data.map((d) => d.y)

	const _matrixA: Matrix = matrix(_vectorA);
	const _matrixB: Matrix = matrix(_vectorB);
	const _transposeA: Matrix = transpose(_matrixA);

	const A: Matrix = multiply(_transposeA, _matrixA)
	const b: Matrix = multiply(_transposeA, _matrixB)

	// using the inverse gives the same result as Gaussian Elimnation
	// console.log(solve(A.valueOf(), b.valueOf()));
	return multiply(inv(A), b)
}

export const lineOfBestFit = (sumOfSquares: Matrix, data: Point[]) => {
	const slope = sumOfSquares.valueOf()[0] as number
	const yIntercept = sumOfSquares.valueOf()[1] as number

	const point1 = [0, yIntercept];
	const point2 = [data[data.length - 1].x, slope * (data[data.length - 1].x) + yIntercept];

	return [{ x: point1[0], y: point1[1] }, { x: point2[0], y: point2[1] }]
}

export const linearRegression = (data: Point[]): { line: Point[] } => {
	return {
		line: lineOfBestFit(matrixSumOfSquares(data), data)
	}

}
