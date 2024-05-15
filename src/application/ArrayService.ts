import { arr, ArrayItem } from '../domains/Array'
export class ArrayService {
    constructor() {
        
    }
    getAll() {
        return arr;
    }

    getByIndex(index: number) {
        return arr[index] ?? null;
    }

    addItem(value: ArrayItem) {
        arr.push(value);
        return arr;
    }

    updateItem(index: number, value: ArrayItem) {
        if (arr[index]) {
            arr[index] = value;
            return arr;
        } else {
            throw new Error('Index out of bounds');
        }
    }

    deleteLast() {
        arr.pop();
        return arr;
    }

    deleteByIndex(index: number) {
        if (arr[index]) {
            arr[index] = 0;
            return arr;
        } else {
            throw new Error('Index out of bounds');
        }
    }
}
