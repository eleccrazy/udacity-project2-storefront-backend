// @ts-ignore
import client from '../database';

// Define a type for the order model.
export type Order = {
  id?: number;
  status: string;
  user_id: number;
};

// Define a type for the order-product many-to-many relationship model.
export type OrderProduct = {
  id?: number;
  quantity: number;
  product_id: number;
  order_id: number;
};

export class OrderStore {
  // Get all orders.
  async getOrders(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  }

  // Get a single order based on the id of the order.
  async getSingleOrder(id: number): Promise<Order> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders where id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get an order of id ${id}. Error: ${error}`);
    }
  }
  // Create a new Order
  async createOrder(order: Order): Promise<Order> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql =
        'INSERT INTO orders(status, user_id) values($1, $2) RETURNING *';
      const result = await conn.query(sql, [order.status, order.user_id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create a new order. Error: ${error}`);
    }
  }
  // Delete a single order based on the id of the order.
  async deleteOrder(id: number): Promise<Order> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'DELETE FROM orders where id=($1)';
      // Get the order to be deleted before deleting it.
      const order = this.getSingleOrder(id);
      const result = await conn.query(sql, [id]);
      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Could not delete an order of id ${id}. ${error}`);
    }
  }

  // Link products to some orders and create some many to many relationships.

  async addProducts(
    quantity: number,
    order_id: number,
    product_id: number
  ): Promise<OrderProduct> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [quantity, order_id, product_id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not add a product to existsing order. Error: ${error}`
      );
    }
  }

  // Get current orders by users

  async getOrderByUser(userId: number): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const result = await conn.query(sql, [userId]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Could not get orders of user id${userId}. Error: ${error}`
      );
    }
  }
}
