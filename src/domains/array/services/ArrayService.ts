import { ArrayService } from "../domains/Array";

const arrayService: ArrayService = {
    arr: [1, "2", 3],

    getAll() {
        return this.arr;
    },

    getByIndex(index) {
        return this.arr[index] ?? null;
    },

    addItem(value) {
        this.arr.push(value);
        return this.arr;
    },

    updateItem(index, value) {
        if (this.arr[index] !== undefined) {
            this.arr[index] = value;
            return this.arr;
        }
    },

    deleteLast() {
        this.arr.pop();
        return this.arr;
    },

    deleteByIndex(index) {
        if (this.arr[index] !== undefined) {
            this.arr[index] = 0;
            return this.arr;
        } 
    }
};

export default arrayService;
