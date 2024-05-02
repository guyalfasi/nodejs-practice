import Koa, { Context, Next } from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import jwt from 'jsonwebtoken';
import koaJwt from 'koa-jwt';
import { query } from './db';
import 'dotenv/config'

const app: Koa = new Koa();
const router: Router = new Router();

app.use(bodyParser());

app.use(koaJwt({
    secret: process.env.JWT_SECRET as string,
    passthrough: true,
}));

const authenticate = async (ctx: Context, next: Next) => {
    const token = ctx.cookies.get('auth');
    if (!token) {
        ctx.status = 401;
        ctx.body = { message: 'Authentication Error: User not logged in' };
        return;
    }

    try {
        const decodedSessionUser = jwt.verify(token, process.env.JWT_SECRET as string);
        ctx.state.user = decodedSessionUser;
        await next();
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: 'Authentication Error: Invalid token' };
    }
}

let arr: (number | string)[] = [1, "2", 3]

interface LoginRequestEndpoint {
    username: string;
    password: string;
}

interface ArrayEndpoint {
    value: number;
}

router.post('/login', async ctx => {
    const { username } = ctx.request.body as LoginRequestEndpoint;

    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user) {
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        ctx.cookies.set('auth', token, { httpOnly: true });
        ctx.status = 201;
        ctx.body = { message: 'Login Successful', token };
    } else {
        ctx.status = 400;
        ctx.body = { message: 'User not found' };
    }
});

router.get('/', authenticate, async ctx => {
    const user = ctx.state.user;
    const currentDate = new Date().toLocaleDateString();
    ctx.body = { message: `Hello ${user.username}, today is ${currentDate}` };
});

router.get('/echo', authenticate, async ctx => {
    const message = ctx.query.msg
    if (message) {
        ctx.body = { message: `The message is ${message}` }
    } else {
        ctx.status = 401;
        ctx.body = { message: `Message field missing` }
    }
})

router.get('/array', authenticate, async ctx => {
    ctx.body = { array: arr }
})

router.get('/array/:index', authenticate, async (ctx) => {
    const index = parseInt(ctx.params.index);
    if (arr[index]) {
        ctx.body = { value: arr[index] };
    } else {
        ctx.status = 404;
        ctx.body = { message: "Index out of bounds" };
    }
})

router.post('/array', authenticate, async (ctx) => {
    const { value } = ctx.request.body as ArrayEndpoint;
    if (ctx.state.user.username.startsWith('admin')) {
        arr = [...arr, value]
        ctx.body = { message: "Array updated", array: arr }
    } else {
        ctx.status = 403
        ctx.body = { message: "You don't have permission to do that" }
    }
})

router.put("/array/:index", authenticate, async (ctx) => {
    const { value } = ctx.request.body as ArrayEndpoint;
    const index = parseInt(ctx.params.index);
    if (ctx.state.user.username.startsWith("admin")) {
            if (arr[index]) {
                arr[index] = value;
                ctx.body = { message: "Array updated", array: arr };
            } else {
                ctx.status = 404;
                ctx.body = { message: "Index out of bounds" };
            }
    } else {
        ctx.status = 403;
        ctx.body = { message: "You don't have permission to do that" };
    }
});

router.delete('/array', authenticate, async (ctx) => {
    if (ctx.state.user.username.startsWith("admin")) {
        if (arr) {
            arr.pop();
            ctx.body = { message: "Array updated", array: arr }    
        } else {
            ctx.status = 400;
            ctx.body = { message: "Array is empty" }
        }
    } else {
        ctx.status = 403;
        ctx.body = { message: "You don't have permission to do that" };
    }
})

router.delete('/array/:index', authenticate, async (ctx) => {
    const index = parseInt(ctx.params.index);
    if (ctx.state.user.username.startsWith("admin")) {
        if (arr) {
            arr[index] = 0;
            ctx.body = { message: "Array updated", array: arr }    
        } else {
            ctx.status = 400;
            ctx.body = { message: "Array is empty" }
        }
    } else {
        ctx.status = 403;
        ctx.body = { message: "You don't have permission to do that" };
    }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT).on('listening', () => console.log(`Listening on port ${process.env.PORT}`))
