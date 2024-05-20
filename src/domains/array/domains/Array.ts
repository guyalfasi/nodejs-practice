import { Context } from "koa";

export type ArrayItem = string | number

export interface ArrayService {
    arr: ArrayItem[];
    getAll: () => ArrayItem[];
    getByIndex: (index: number) => ArrayItem | null;
    addItem: (value: ArrayItem) => ArrayItem[];
    updateItem: (index: number, value: ArrayItem, ctx: Context) => ArrayItem[] | void;
    deleteLast: () => ArrayItem[];
    deleteByIndex: (index: number, ctx: Context) => ArrayItem[] | void;
}

export interface ArrayEndpoint {
    value: ArrayItem;
}
