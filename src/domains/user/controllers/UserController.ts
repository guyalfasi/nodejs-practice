import Router from 'koa-router';
import userService from '../services/UserService';
import { Context } from 'koa';
import { User } from '../domains/User'
import { authenticate, authorizeAdmin } from '../../../application/authMiddleware';

const router = new Router();

router.post('/login', async (ctx: Context) => {
    const { username, password } = ctx.request.body as User;

    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { message: 'One or more fields missing' };
        return;
    }

    try {
        const { token }  = await userService.login(username, password);
        ctx.cookies.set('auth', token, { httpOnly: true });
        ctx.status = 200;
        ctx.body = { message: 'Login successful', token };
    } catch (error) {
        if (error instanceof Error) {
            ctx.body = { message: error.message };
            switch (error.message) {
                case 'Invalid password':
                    ctx.status = 400;
                    break;
                case 'User not found':
                    ctx.status = 404;
                    break;
                default:
                    ctx.status = 500;
                    break;
            }
        }
    }
});

router.post('/register', async (ctx: Context) => {
    const { username, password, secretAdminPassword } = ctx.request.body as User;

    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { message: 'One or more fields missing' };
        return;
    }

    try {
        const newUser = await userService.register(username, password, secretAdminPassword ?? '');
        ctx.status = 201;
        ctx.body = { message: 'User registered successfully', user: newUser };
    } catch (error) {
        if (error instanceof Error) {
            ctx.body = { message: error.message };
            switch (error.message) {
                case 'Username already exists':
                    ctx.status = 400;
                    break;
                default:
                    ctx.status = 500;
                    break;
            }
            ctx.status = 400;
            ctx.body = { message: error.message };
        }
    }
});

router.post('/admin', authenticate, authorizeAdmin, async (ctx: Context) => {
    try {
        const { username } = ctx.request.body as User;
        const updatedUser = await userService.makeAdmin(username);
        ctx.body = { message: "Changed permissions for user", newAdmin: updatedUser };
    } catch (error) {
        if (error instanceof Error) {
            ctx.body = { message: error.message };
            switch (error.message) {
                case 'User not found':
                    ctx.status = 400;
                    break;
                case 'User is already an admin':
                    ctx.status = 200;
                    break;
                default:
                    ctx.status = 500;
                    break;
            }
        }
    }
});

router.post('/logout', authenticate, async (ctx: Context) => {
    ctx.cookies.set('auth', '', { httpOnly: true, expires: new Date(0) });
    ctx.status = 200;
    ctx.body = { message: 'Logout successful' };
});

export default router;
