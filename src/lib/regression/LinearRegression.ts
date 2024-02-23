import { matrix, transpose, multiply, inv, Matrix, sqrt, mean, pow, number } from "mathjs";

export interface Point {
	x: number,
	y: number
}

const addBiasTerm = (data: Point[]) => {
	return data.map((d) => [1, d.y]);
}

const costFunction = () => {
	sqrt(mean())
}

const calculateVariance = (vectors: number[], mean: number) => {
	return vectors.reduce((sum: number, _x: number) => {
		sum += Math.pow(_x - mean, 2);
		return sum
	}, 0) / vectors.length - 1
}

const calculateCovariance = (vectors: { x: number[], y: number[] }, means: { x: number, y: number }) => {
	return Array.from({ length: vectors.x.length - 1 }, (_, _i) => _i).reduce((sum: number, _: number, _i: number) => {
		sum += (vectors.x[_i] - means.x) * (vectors.y[_i] - means.y)
		return sum
	}, 0) / vectors.x.length - 1
}

export const calculatePearsonCorrelation = (data: Point[]) => {
	// const _matrices = asMatrices(data);
	const vectors = data.reduce((_vectors: { x: number[], y: number[] }, _datum: Point) => {
		_vectors.x.push(_datum.x);
		_vectors.y.push(_datum.y);
		return _vectors;
	}, { x: [], y: [] });

	const means = { y: mean(vectors.y), x: mean(vectors.x) }

	const estimatedPopulationVariance: number = calculateVariance(vectors.x, means.x);
	const standardDeviation: number = sqrt(estimatedPopulationVariance) as number;
	const dependentVariance: number = calculateVariance(vectors.y, means.y);
	const covariance: number = calculateCovariance(vectors, means);

	return (covariance) / (Math.sqrt(estimatedPopulationVariance) * Math.sqrt(dependentVariance))
}


const asMatrices = (data: Point[]) => {
	const _vectorX: number[][] = data.map((d) => [d.x, 1]);
	const _vectorY: number[] = data.map((d) => d.y)

	const _matrixX: Matrix = matrix(_vectorX);
	const _matrixY: Matrix = matrix(_vectorY);
	return {
		A: _matrixX,
		b: _matrixY
	}
}

export const matrixSumOfSquares = (data: Point[]): Matrix => {

	const _matrices = asMatrices(data);
	const _transposeA: Matrix = transpose(_matrices.A);

	const A: Matrix = multiply(_transposeA, _matrices.A)
	const b: Matrix = multiply(_transposeA, _matrices.b)

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

export const linearRegression = (data: Point[]): { correlation: number, line: Point[] } => {
	return {
		line: lineOfBestFit(matrixSumOfSquares(data), data),
		correlation: calculatePearsonCorrelation(data)
	}

}
