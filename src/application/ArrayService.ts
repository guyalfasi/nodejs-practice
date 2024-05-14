let arr: (string | number)[] = [1, "2", 3];

export class ArrayService {
    getAll() {
        return arr;
    }

    getByIndex(index: number) {
        return arr[index] ?? null;
    }

    addItem(value: number | string) {
        arr.push(value);
        return arr;
    }

    updateItem(index: number, value: number | string) {
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
