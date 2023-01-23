import { Product, ProductStore } from '../../models/product';

const productStore = new ProductStore();

describe('Test for ProductStore model', () => {
  it('getProducts method should be defined', () => {
    expect(productStore.getProducts).toBeDefined();
  });
  it('getSingleProduct method should be defined', () => {
    expect(productStore.getSingleProduct).toBeDefined();
  });
  it('deleteProduct method should be defined', () => {
    expect(productStore.deleteProduct).toBeDefined();
  });
  it('createProduct method should be defined', () => {
    expect(productStore.createProduct).toBeDefined();
  });
  it('getProducts method should get all products from the database', async () => {
    const products: Product[] = await productStore.getProducts();
    expect(products.length).toEqual(0);
  });
  it('createProduct method should create a new product', async () => {
    const product: Product = {
      name: 'iPhone 8',
      price: 700
    };
    const newProduct: Product = await productStore.createProduct(product);
    expect(newProduct).toEqual({
      id: 2,
      name: 'iPhone 8',
      price: 700
    });
  });

  it('getSingleProduct method should get a single product from the database based on its id', async () => {
    const product: Product = await productStore.getSingleProduct(2);
    expect(product).toEqual({
      id: 2,
      name: 'iPhone 8',
      price: 700
    });
  });

  it('deleteProduct method should delete a single product from the datbase based on its id', async () => {
    await productStore.deleteProduct(2);
    const allProducts = await productStore.getProducts();
    expect(allProducts.length).toEqual(0);
  });
});
