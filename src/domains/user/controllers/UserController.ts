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
        ctx.body = { error: 'One or more fields missing' };
        return;
    }

    const userLogin = await userService.login(username, password, ctx);

    if (!userLogin) return;

    const { user, token } = userLogin;

    ctx.cookies.set('auth', token, { httpOnly: true });
    ctx.body = { message: 'Login successful', user: user, token: token };
});

router.post('/register', async (ctx: Context) => {
    const { username, password, secretAdminPassword } = ctx.request.body as User;

    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { error: 'One or more fields missing' };
        return;
    }

    const newUser = await userService.register(username, password, secretAdminPassword ?? '', ctx);

    if (!newUser) return;

    ctx.status = 201;
    ctx.body = { message: 'User registered successfully', user: newUser };
});

router.post('/admin', authenticate, authorizeAdmin, async (ctx: Context) => {
    const { username } = ctx.request.body as User;
    const updatedUser = await userService.makeAdmin(username, ctx);

    if (!updatedUser) return;

    ctx.status = 200;
    ctx.body = { message: "Changed permissions for user", newAdmin: updatedUser };
});

router.post('/logout', authenticate, async (ctx: Context) => {
    ctx.cookies.set('auth', '', { httpOnly: true, expires: new Date(0) });
    ctx.status = 200;
    ctx.body = { message: 'Logout successful' };
});

export default router;
