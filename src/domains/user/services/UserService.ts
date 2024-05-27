import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repos/UserRepository';
import { UserService } from '../domains/User';

const userService: UserService = {
    async login(username, password, ctx) {
        const user = await userRepository.get(username);

        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }

        if (!await bcrypt.compare(password, user.password)) {
            ctx.status = 401;
            ctx.body = { error: 'Invalid password' };
            return;
        }

        const payload = { id: user.id, username: user.username, isAdmin: user.isAdmin };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        
        return { user, token };
    },

    async register(username, password, secretAdminPassword, ctx) {
        const existingUser = await userRepository.get(username);

        if (existingUser) {
            ctx.status = 400;
            ctx.body = { error: 'Username already exists' }
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({ username: username, password: hashedPassword, isAdmin: secretAdminPassword === process.env.SECRET_ADMIN_PASSWORD });

        return newUser;
    },

    async makeAdmin(username, ctx) {
        const user = await userRepository.get(username);

        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' }
            return;
        }

        if (user.isAdmin) {
            ctx.status = 200;
            ctx.body = { message: 'User is already an admin' }
            return;
        }

        const updatedUser = await userRepository.updateToAdmin(username);
        return updatedUser;
    }
}

export default userService;