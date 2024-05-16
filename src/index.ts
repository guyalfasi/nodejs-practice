import 'dotenv/config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaJwt from 'koa-jwt';
import userRouter from './domains/user/controllers/UserController';
import arrayRouter from './domains/array/controllers/ArrayController';
import UIRouter from './domains/UI/controllers/UIController';
import { methodChecker } from './application/methodChecker';

const app: Koa = new Koa();

app.use(bodyParser());
app.use(methodChecker)
app.use(koaJwt({
    secret: process.env.JWT_SECRET as string,
    passthrough: true,
}));

app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(arrayRouter.routes()).use(arrayRouter.allowedMethods());
app.use(UIRouter.routes()).use(UIRouter.allowedMethods());

app.listen(process.env.PORT).on('listening', () => console.log(`Listening on port ${process.env.PORT}`));
