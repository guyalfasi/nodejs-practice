import Router from 'koa-router';
import { MiscService } from '../application/MiscService';
import { Context } from 'koa';
import { authenticate } from '../controllers/middleware/authMiddleware';

const router = new Router();
const miscService = new MiscService();

router.use(authenticate);

router.get('/', async (ctx: Context) => {
    const user = ctx.state.user;
    const currentDate = miscService.getCurrentDate();
    ctx.body = { message: `Hello ${user.username}, today is ${currentDate}` };
});

router.get('/echo', async (ctx: Context) => {
    const message = ctx.query.msg as string;
    if (message) {
        ctx.body = { message: miscService.echoMessage(message) };
    } else {
        ctx.status = 400;
        ctx.body = { message: `Message field missing` };
    }
});

export default router;
