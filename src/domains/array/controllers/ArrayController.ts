import Router from 'koa-router';
import arrayService from '../services/ArrayService';
import { Context } from 'koa';
import { authenticate, authorizeAdmin } from '../../../application/authMiddleware';
import { ArrayEndpoint } from '../domains/Array';

const router = new Router();

router.use(authenticate);

router.get('/array', async (ctx: Context) => {
    try {
        const array = arrayService.getAll();
        ctx.status = 200;
        ctx.body = { array };
    } catch (error) {
        if (error instanceof Error) {
            ctx.status = 500;
            ctx.body = { message: error.message };
        }
    }
});

router.get('/array/:index', async (ctx: Context) => {
    const index = parseInt(ctx.params.index);
    if (isNaN(index)) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid index' }
        return;
    }
    const item = arrayService.getByIndex(index);
    if (item) {
        ctx.body = { value: item };
    } else {
        ctx.status = 404;
        ctx.body = { message: "Index out of bounds" };
    }
});

router.post('/array', authorizeAdmin, async (ctx: Context) => {
    const { value } = ctx.request.body as ArrayEndpoint;
    if (!value) {
        ctx.status = 400;
        ctx.body = { message: 'Input missing' }
    }
    ctx.body = { array: arrayService.addItem(value) };
});

router.put('/array/:index', authorizeAdmin, async (ctx: Context) => {
    const index = parseInt(ctx.params.index);
    const { value } = ctx.request.body as ArrayEndpoint;
    if (!value) {
        ctx.status = 400;
        ctx.body = { message: 'Input missing' }
    }

    if (isNaN(index)) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid index' }
        return;
    }

    try {
        ctx.body = { array: arrayService.updateItem(index, value) };
    } catch (error) {
        if (error instanceof Error) {
            ctx.status = 404;
            ctx.body = { message: error.message };
        }
    }
});

router.delete('/array', authorizeAdmin, async (ctx: Context) => {
    ctx.status = 200;
    ctx.body = { array: arrayService.deleteLast() };
});

router.delete('/array/:index', authorizeAdmin, async (ctx: Context) => {
    const index = parseInt(ctx.params.index);
    if (isNaN(index)) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid index' }
        return;
    }
    try {
        ctx.status = 200;
        ctx.body = { array: arrayService.deleteByIndex(index) };
    } catch (error) {
        if (error instanceof Error) {
            ctx.status = 404;
            ctx.body = { message: error.message };
        }
    }
});

export default router;
