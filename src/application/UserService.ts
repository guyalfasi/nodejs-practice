import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/db';

export class UserService {
    async login(username: string, password: string) {
        const user = await db('users').where({ username }).first();
        if (!user) {
            throw new Error('User not found');
        }

        const passwordCompared = await bcrypt.compare(password, user.password);
        if (!passwordCompared) {
            throw new Error('Invalid password');
        }

        const payload = { id: user.id, username: user.username, isAdmin: user.isAdmin };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return { user, token };
    }

    async register(username: string, password: string, secretAdminPassword: string) {
        const existingUser = await db('users').where({ username }).first();
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db('users').insert({
            username,
            password: hashedPassword,
            isAdmin: secretAdminPassword === process.env.SECRET_ADMIN_PASSWORD,
        }).returning('*');

        return newUser;
    }

    async makeAdmin(username: string) {
        const user = await db('users').where({ username }).first();
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isAdmin) {
            throw new Error('User is already an admin');
        }

        const updatedUser = await db('users')
            .where({ username })
            .update({ isAdmin: true })
            .returning('*');

        return updatedUser;
    }
}
