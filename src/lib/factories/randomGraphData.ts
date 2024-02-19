export const random2DGraphData = (
    axisX: string = "X",
    axisY: string = "Y",
    scale: number = 300,
    points: number = 200,
    error: number = 50,
    slope: number = 0.9,
    yIntercept: number = 2
): Record<string, number>[] => {
    return Array.from({ length: points }, (_, i) =>
        [scale / points * i, slope * (Math.random() * error + i) + yIntercept]
    ).sort((a, b) => (a[0] - b[0]))
        .reduce((acc: Record<string, number>[], ar) => {
            acc.push({ [axisX]: ar[0], [axisY]: ar[1] });
            return acc;
        }, [])
}
