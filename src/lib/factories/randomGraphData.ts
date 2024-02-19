export const random2DGraphData = (
    axisX: string = "X",
    axisY: string = "Y",
    scale: number = 300,
    points: number = 200
): Record<string, number>[] => {
    return Array.from({ length: points }, (_, i) =>
        [Math.round(Math.random() * i + ((scale / points) * i)), (scale / points) * i]
    ).sort((a, b) => (a[0] - b[0]))
        .reduce((acc: Record<string, number>[], ar) => {
            acc.push({ [axisX]: ar[0], [axisY]: ar[1] });
            return acc;
        }, [])
}
