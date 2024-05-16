import db from '../../../infra/db';
import { User, UserRepository } from '../domains/User';

const userRepository: UserRepository = {
    async findByUsername(username: string): Promise<User | undefined> {
        return db('users').where({ username }).first();
    },

    async create(user: Partial<User>): Promise<User> {
        const [newUser] = await db('users').insert(user).returning('*');
        return newUser;
    },

    async updateToAdmin(username: string): Promise<User> {
        const [updatedUser] = await db('users').where({ username }).update({ isAdmin: true }).returning('*');
        return updatedUser;
    }
}

export default userRepository;