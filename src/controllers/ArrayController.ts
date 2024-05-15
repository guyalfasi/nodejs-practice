import Router from 'koa-router';
import { ArrayService } from '../application/ArrayService';
import { Context } from 'koa';
import { authenticate } from '../controllers/middleware/authMiddleware';
import { ArrayEndpoint } from '../domains/Array';

const router = new Router();
const arrayService = new ArrayService();

router.use(authenticate);

router.get('/array', async (ctx: Context) => { 
    ctx.body = { array: arrayService.getAll() };
});

router.get('/array/:index', async (ctx: Context) => {
    const index = parseInt(ctx.params.index);
    const item = arrayService.getByIndex(index);
    if (item) {
        ctx.body = { value: item };
    } else {
        ctx.status = 404;
        ctx.body = { message: "Index out of bounds" };
    }
});

router.post('/array', async (ctx: Context) => {
    const { value } = ctx.request.body as ArrayEndpoint;
    if (ctx.state.user.isAdmin) {
        ctx.body = { array: arrayService.addItem(value) };
    } else {
        ctx.status = 403;
        ctx.body = { message: "You don't have permission to do that" };
    }
});

router.put('/array/:index', async (ctx: Context) => {
    const index = parseInt(ctx.params.index);
    const { value } = ctx.request.body as ArrayEndpoint;
    if (ctx.state.user.isAdmin) {
        try {
            ctx.body = { array: arrayService.updateItem(index, value) };
        } catch (error) {
            if (error instanceof Error) {
                ctx.status = 404;
                ctx.body = { message: error.message };    
            }
        }
    } else {
        ctx.status = 403;
        ctx.body = { message: "You don't have permission to do that" };
    }
});

router.delete('/array', async (ctx: Context) => {
    if (ctx.state.user.isAdmin) {
        ctx.body = { array: arrayService.deleteLast() };
    } else {
        ctx.status = 403;
        ctx.body = { message: "You don't have permission to do that" };
    }
});

router.delete('/array/:index', async (ctx: Context) => {
    const index = parseInt(ctx.params.index);
    if (ctx.state.user.isAdmin) {
        try {
            ctx.body = { array: arrayService.deleteByIndex(index) };
        } catch (error) {
            if (error instanceof Error) {
                ctx.status = 404;
                ctx.body = { message: error.message };
            }
        }
    } else {
        ctx.status = 403;
        ctx.body = { message: "You don't have permission to do that" };
    }
});

export default router;
