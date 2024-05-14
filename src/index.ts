import 'dotenv/config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaJwt from 'koa-jwt';
import userRouter from './controllers/UserController';
import arrayRouter from './controllers/ArrayController';
import miscRouter from './controllers/MiscController';

const app: Koa = new Koa();

app.use(bodyParser());
app.use(koaJwt({
    secret: process.env.JWT_SECRET as string,
    passthrough: true,
}));

app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(arrayRouter.routes()).use(arrayRouter.allowedMethods());
app.use(miscRouter.routes()).use(miscRouter.allowedMethods());

app.listen(process.env.PORT).on('listening', () => console.log(`Listening on port ${process.env.PORT}`));
