interface Datum {
	x: number;
	y: number;
}

// const slope = Array.from({ length: 30 }, (_, i) =>
// 	Array.from({ length: 2 }, () => Math.random() * i)
// );
// const yIntercept = Array.f

export const fitLine = (data: Datum[]) => {
	// TODO, use Geometry instead and matrices.
	// const first = data[0];
	// const last = data[data.length - 1];
	// const change = (last.y - first.y) / (last.x - first.x);
};

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
