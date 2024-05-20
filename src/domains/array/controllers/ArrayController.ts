import Router from 'koa-router';
import arrayService from '../services/ArrayService';
import { Context } from 'koa';
import { authenticate, authorizeAdmin } from '../../../application/authMiddleware';
import { ArrayEndpoint } from '../domains/Array';

const router = new Router();

router.use(authenticate);

router.get('/array', async (ctx: Context) => {
    const array = arrayService.getAll();
    ctx.status = 200;
    ctx.body = { array };
});

router.get('/array/:index', async (ctx: Context) => {
    const index = parseInt(ctx.params.index);
    if (isNaN(index)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid index' }
        return;
    }
    const item = arrayService.getByIndex(index);
    if (item) {
        ctx.body = { value: item };
    } else {
        ctx.status = 404;
        ctx.body = { error: "Index out of bounds" };
    }
});

router.post('/array', authorizeAdmin, async (ctx: Context) => {
    const { value } = ctx.request.body as ArrayEndpoint;
    if (!value) {
        ctx.status = 400;
        ctx.body = { error: 'Input missing' }
        return;
    }
    ctx.body = { array: arrayService.addItem(value) };
});

router.put('/array/:index', authorizeAdmin, async (ctx: Context) => {
    const index = parseInt(ctx.params.index);
    const { value } = ctx.request.body as ArrayEndpoint;
    if (value == null) {
        ctx.status = 400;
        ctx.body = { error: 'Input missing' }
        return;
    }

    if (isNaN(index)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid index' }
        return;
    }

    const updatedArray = arrayService.updateItem(index, value, ctx)
    if (!updatedArray) return;

    ctx.body = { message: 'Array updated', array: updatedArray};
});

router.delete('/array', authorizeAdmin, async (ctx: Context) => {
    ctx.status = 200;
    ctx.body = { array: arrayService.deleteLast() };
});

router.delete('/array/:index', authorizeAdmin, async (ctx: Context) => {
    const index = parseInt(ctx.params.index);

    if (isNaN(index)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid index' }
        return;
    }

    const updatedArray = arrayService.deleteByIndex(index, ctx);
    if (!updatedArray) return;
    ctx.body = { message: 'Array updated', array: updatedArray };
});

export default router;
