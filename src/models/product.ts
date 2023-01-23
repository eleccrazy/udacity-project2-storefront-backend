// @ts-ignore
import client from '../database';

// Custome type defination for product model.
export type Product = {
  id?: number;
  name: string;
  price: number;
};

// A class that represents the Product table in the database.
export class ProductStore {
  // Get all products form the database.
  async getProducts(): Promise<Product[]> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = 'SELECT * FROM products;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get products. Error: ${error}`);
    }
  }

  // Get a single product from the database based on the id of the product.
  async getSingleProduct(id: number): Promise<Product> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get a product with id ${id}. Error: ${error}`);
    }
  }

  // Create a new product
  async createProduct(product: Product): Promise<Product> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql =
        'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';
      const result = await connection.query(sql, [product.name, product.price]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create a new product. Error: ${error}`);
    }
  }

  // Delete a product from the database based on the id of the product
  async deleteProduct(id: number): Promise<Product> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      // Get the product before deleting it.
      const product = await this.getSingleProduct(id);
      const sql = 'DELETE FROM products WHERE id=($1)';
      await connection.query(sql, [id]);
      connection.release();
      return product;
    } catch (error) {
      throw new Error(
        `Could not delete a product with id ${id}. Error: ${error}`
      );
    }
  }
}
