import { Router, Request, Response } from 'express';
import orderRouter from './ordersRoute';
import productRouter from './productsRoute';
import userRouter from './usersRoute';

const indexRouter = Router();

indexRouter.use('/products', productRouter);
indexRouter.use('/users', userRouter);
indexRouter.use('/orders', orderRouter);

indexRouter.get('/', (_req: Request, res: Response) => {
  res.send('For more info, read the README.md file.');
});

export default indexRouter;
