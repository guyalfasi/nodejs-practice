export type ArrayItem = string | number

export interface ArrayService {
    arr: ArrayItem[];
    getAll: () => ArrayItem[];
    getByIndex: (index: number) => ArrayItem | null;
    addItem: (value: ArrayItem) => ArrayItem[];
    updateItem: (index: number, value: ArrayItem) => ArrayItem[] | void;
    deleteLast: () => ArrayItem[];
    deleteByIndex: (index: number) => ArrayItem[] | void;
}

export interface ArrayEndpoint {
    value: ArrayItem;
}
