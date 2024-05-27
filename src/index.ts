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
app.use(koaJwt({
    secret: process.env.JWT_SECRET as string,
    passthrough: true,
}));

const routes = [userRouter, arrayRouter, UIRouter]

routes.forEach(router => {
    app.use(router.routes()).use(router.allowedMethods());
});

app.use(methodChecker)

app.listen(process.env.PORT).on('listening', () => console.log(`Listening on port ${process.env.PORT}`));
