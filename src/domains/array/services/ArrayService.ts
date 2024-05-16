import { ArrayService, ArrayItem } from "../domains/Array";

const arrayService: ArrayService = {
    arr: [1, "2", 3],

    getAll() {
        return this.arr;
    },

    getByIndex(index: number) {
        return this.arr[index] ?? null;
    },

    addItem(value: ArrayItem) {
        this.arr.push(value);
        return this.arr;
    },

    updateItem(index: number, value: ArrayItem) {
        if (this.arr[index] !== undefined) {
            this.arr[index] = value;
            return this.arr;
        } else {
            throw new Error('Index out of bounds');
        }
    },

    deleteLast() {
        this.arr.pop();
        return this.arr;
    },

    deleteByIndex(index: number) {
        if (this.arr[index] !== undefined) {
            this.arr[index] = 0;
            return this.arr;
        } else {
            throw new Error('Index out of bounds');
        }
    }
};

export default arrayService;
