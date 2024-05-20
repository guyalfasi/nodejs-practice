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

    updateItem(index, value, ctx) {
        if (this.arr[index] !== undefined) {
            this.arr[index] = value;
            return this.arr;
        } else {
            ctx.status = 404;
            ctx.body = { message: 'Index out of bounds' };
            return;
        }
    },

    deleteLast() {
        this.arr.pop();
        return this.arr;
    },

    deleteByIndex(index, ctx) {
        if (this.arr[index] !== undefined) {
            this.arr[index] = 0;
            return this.arr;
        } else {
            ctx.status = 404;
            ctx.body = { message: 'Index out of bounds' };
            return;
        }
    }
};

export default arrayService;
