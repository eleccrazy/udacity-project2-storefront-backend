import { Router, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthToken } from '../middlewares/verifyUser';

const store = new ProductStore();

const productRouter = Router();

productRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await store.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

productRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await store.getSingleProduct(+req.params.id);
    if (product) {
      return res.status(200).json(product);
    }
    return res
      .status(404)
      .json({ Error: `Product with id ${+req.params.id} not found.` });
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

productRouter.post(
  '/',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const product: Product = req.body;
      if (!product.name || !product.price) {
        return res
          .status(400)
          .json({ Error: 'name and price must be provided.' });
      }
      const newProduct = await store.createProduct(product);
      return res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  }
);

productRouter.delete(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const deletedProduct = await store.deleteProduct(+req.params.id);
      if (deletedProduct) {
        return res.status(200).json({ DeletedProductId: deletedProduct.id });
      }
      return res
        .status(404)
        .json({ Error: `Product with id ${+req.params.id} not found.` });
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  }
);

export default productRouter;
