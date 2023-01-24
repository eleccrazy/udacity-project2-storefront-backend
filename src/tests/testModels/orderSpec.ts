import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { Product, ProductStore } from '../../models/product';

const store = new OrderStore();

describe('Test suite for OrderStore model', () => {
  it('getOrders method should be defined', () => {
    expect(store.getOrders).toBeDefined();
  });
  it('getSingleOrder method should be defined', () => {
    expect(store.getSingleOrder).toBeDefined();
  });
  it('deleteOrder method should be defined', () => {
    expect(store.deleteOrder).toBeDefined();
  });
  it('createOrder method should be defined', () => {
    expect(store.createOrder).toBeDefined();
  });
  it('addProducts method should be defined', () => {
    expect(store.addProducts).toBeDefined();
  });
  it('getOrderByUser method should be defined', () => {
    expect(store.getOrderByUser).toBeDefined();
  });

  it('getOrders method should retrive empty arrays of orders at the start.', async () => {
    const orders: Order[] = await store.getOrders();
    expect(orders).toEqual([]);
  });

  it('createOrder method should create a new order', async () => {
    // Creat a new user object that will be linked to the new order.
    const user: User = await new UserStore().createUser({
      username: 'test',
      firstName: 'Udacity',
      lastName: 'Alx',
      password: 'password-test'
    });

    const order: Order = {
      status: 'Active',
      user_id: 1
    };

    const newOrder: Order = await store.createOrder(order);
    expect(newOrder).toEqual({
      id: 1,
      status: 'Active',
      user_id: 1
    });
  });

  it('getSingleOrder method should get a single order from the database', async () => {
    const order: Order = await store.getSingleOrder(1);
    expect(order).toEqual({
      id: 1,
      status: 'Active',
      user_id: 1
    });
  });

  it('getOrderByUser method should get all orders made by that user.', async () => {
    const ordersByUser = await store.getOrderByUser(1);
    expect(ordersByUser).toEqual([{ id: 1, status: 'Active', user_id: 1 }]);
  });

  it('addProducts method should link a given product to the order.', async () => {
    // First create a product which will be linked to the order.
    const product: Product = {
      name: 'Samsung s12',
      price: 1100
    };
    const newProduct = await new ProductStore().createProduct(product);
    const result = await store.addProducts(7, 1, 1);
    expect(result).toEqual({
      id: 1,
      product_id: 1,
      order_id: 1,
      quantity: 7
    });
  });

  it('deleteOrder method should delete an order from the datbase', async () => {
    await store.deleteOrder(1);
    const allOrders = await store.getOrders();
    expect(allOrders.length).toEqual(0);
  });
});
