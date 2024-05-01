import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import jwt from 'jsonwebtoken';
import koaJwt from 'koa-jwt';
import { query } from './db'; 
import cookie from 'koa-cookie';
import 'dotenv/config'

const app: Koa = new Koa();
const router: Router = new Router();

app.use(bodyParser());
app.use(cookie());

app.use(koaJwt({
    secret: process.env.JWT_SECRET as string,
    passthrough: true,
    getToken: (ctx) => {
        const token = ctx.cookies.get('auth');
        return token || null;
    }
}).unless({ path: [/^\/login/] }));


interface LoginRequestEndpoint {
    username: string;
    password: string;
}

router.post('/login', async ctx => {
    const { username } = ctx.request.body as LoginRequestEndpoint;

    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user) {
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        ctx.cookies.set('auth', token, { httpOnly: true });
        ctx.status = 200;
        ctx.body = { message: 'Login Successful', token };
    } else {
        ctx.status = 400;
        ctx.body = { message: 'User not found' };
    }
});

router.get('/', async ctx => {
    if (ctx.state.user) {
        const user = ctx.state.user;
        const currentDate = new Date().toLocaleDateString();
        ctx.body = { message: `Hello ${user.username}, today is ${currentDate}` };    
    } else {
        ctx.status = 400
        ctx.body = { message: "Unauthorized Access" }
    }
});

router.get('/echo', async ctx => {
    const message = ctx.query.msg 
    if (message) {
        ctx.body = { message: `The message is ${message}` }
    } else {
        ctx.status = 400;
        ctx.body = { message: `Message field missing` }
    }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT).on('listening', () => console.log(`Listening on port ${process.env.PORT}`))

