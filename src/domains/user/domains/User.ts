export interface User {
    id: string;
    username: string;
    password: string;
    isAdmin: boolean;
    secretAdminPassword?: string;
}

export interface UserService {
    login: (username: string, password: string) => Promise<{user: User; token: string;}>;
    register: (username: string, password: string, secretAdminPassword: string) => Promise<User>;
    makeAdmin: (username: string) => Promise<User>;
}

export interface SessionUser {
    id: string;
    username: string;
    isAdmin: boolean;
    iat: number;
    exp: number;
} 

export interface UserRepository {
    findByUsername: (username: string) => Promise<User | undefined>;
    create: (user: Partial<User>) => Promise<User>;
    updateToAdmin: (username: string) => Promise<User>;
}