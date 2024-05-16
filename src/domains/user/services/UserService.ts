import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repos/UserRepository';
import { UserService } from '../domains/User';

const userService: UserService = {
    async login(username: string, password: string) {
        const user = await userRepository.findByUsername(username);
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
    },

    async register(username: string, password: string, secretAdminPassword: string) {
        const existingUser = await userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userRepository.create({
            username,
            password: hashedPassword,
            isAdmin: secretAdminPassword === process.env.SECRET_ADMIN_PASSWORD,
        });

        return newUser;
    },

    async makeAdmin(username: string) {
        const user = await userRepository.findByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isAdmin) {
            throw new Error('User is already an admin');
        }

        const updatedUser = await userRepository.updateToAdmin(username);
        return updatedUser;
    }
}

export default userService;