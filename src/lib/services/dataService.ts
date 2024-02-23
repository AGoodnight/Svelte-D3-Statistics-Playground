import { random2DGraphData } from "$lib/factories/randomGraphData";
import { ReplaySubject, Subject } from "rxjs";

export class DataService {

    private _data: any = random2DGraphData('Weight', 'Size', 200, 100, Math.round(Math.random() * 400))
    private _data$: ReplaySubject<any> = new ReplaySubject(1)
    get Data() {
        return this._data
    }

    get Data$() {
        return this._data$
    }

    constructor() {
        this._data$.next(random2DGraphData('Weight', 'Size', 200, 100, Math.round(Math.random() * 400)));
        // setInterval(() => {
        //     this._data$.next(random2DGraphData('Weight', 'Size', 200, 100, Math.round(Math.random() * 400)));
        // }, 2000)
        this._data$.subscribe((_data: any) => {
            this._data = _data;
        })
    }
}