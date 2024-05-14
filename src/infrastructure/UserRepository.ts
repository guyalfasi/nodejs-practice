import db from '../db/db';
import { User } from '../domains/User';

export class UserRepository {
    async findByUsername(username: string): Promise<User | undefined> {
        return db('users').where({ username }).first();
    }

    async create(user: Partial<User>): Promise<User> {
        const [newUser] = await db('users').insert(user).returning('*');
        return newUser;
    }
}
