import { Router, Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import { verifyAuthToken } from '../middlewares/verifyUser';

const store = new OrderStore();

const orderRouter = Router();

orderRouter.get('/', verifyAuthToken, async (_req: Request, res: Response) => {
  try {
    const orders = await store.getOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

orderRouter.get(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const order = await store.getSingleOrder(+req.params.id);
      if (order) {
        return res.status(200).json(order);
      }
      return res
        .status(404)
        .json({ Error: `Order with id ${+req.params.id} not found.` });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

orderRouter.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const orderData: Order = req.body;
    if (!orderData.status || !orderData.user_id) {
      return res
        .status(400)
        .json({ Error: 'status and user_id must be provided' });
    }
    const newOrder = await store.createOrder(orderData);
    return res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

orderRouter.delete(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const deletedOrder = await store.deleteOrder(+req.params.id);
      if (deletedOrder) {
        return res.status(200).json({ DeletedOrderId: deletedOrder.id });
      }
      return res
        .status(404)
        .json({ Error: `Order with id ${+req.params.id} not found.` });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

export default orderRouter;
