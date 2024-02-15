export const random2DGraphData = (
    scale: number = 300,
    points: number = 30,
    axisX: string = "X",
    axisY: string = "Y"
): Record<string, number>[] => {
    return Array.from({ length: points }, (_, i) =>
        Array.from({ length: 2 }, () =>
            Math.round(Math.random() * i + (i * (scale / points))
            ))
    )
        .reduce((acc: Record<string, number>[], ar) => {
            acc.push({ [axisX]: ar[0], [axisY]: ar[1] });
            return acc;
        }, [])
}
