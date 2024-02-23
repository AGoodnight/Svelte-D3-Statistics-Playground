import { random2DGraphData } from "$lib/factories/randomGraphData";

export class DataService {

    private _data;
    get Data() {
        return this._data
    }

    constructor() {
        this._data = random2DGraphData('Weight', 'Size', 200, 100);
    }
}