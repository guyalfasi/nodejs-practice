import { Context } from "koa";

export interface User {
    id: string;
    username: string;
    password: string;
    isAdmin: boolean;
    secretAdminPassword?: string;
}

export interface UserService {
    login: (username: string, password: string, ctx: Context) => Promise<{user: User; token: string;} | void>;
    register: (username: string, password: string, secretAdminPassword: string, ctx: Context) => Promise<User | void>;
    makeAdmin: (username: string, ctx: Context) => Promise<User | void>;
}

export interface UserRepository {
    findByUsername: (username: string) => Promise<User | undefined>;
    create: (user: Partial<User>) => Promise<User>;
    updateToAdmin: (username: string) => Promise<User>;
}