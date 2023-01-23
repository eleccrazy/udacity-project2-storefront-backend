// @ts-ignore
import client from '../database';

// Custome type defination for user model.

export type User = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

// Additional string which will be added to the password for additional security.
const papper = process.env.BCRYPT_PASSWORD;

// A class that represents the users table from the datbase.

export class UserStore {
  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      //@ts-ignore
      const connection = await client.connect();
      const sql = 'SELECT * FROM USERS';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get all users. Error: ${error}`);
    }
  }

  // Get a single user by its id.

  async getSingleUser(id: number): Promise<User> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1) ';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get a user with id ${id}. Error: ${error}`);
    }
  }

  // Create a new User.
  async createUser(user: User): Promise<User> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql =
        'INSERT INTO users (username, first_name, last_name, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const result = await connection.query(sql, [
        user.username,
        user.firstName,
        user.lastName,
        user.password
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create a new user. Error: ${error}`);
    }
  }

  // Delete a user by its id.

  async deleteUser(id: number): Promise<User> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      // Get the user from the database before deleting it.
      const user = await this.getSingleUser(id);
      const sql = 'DELETE FROM users WHERE id=($1) ';
      await connection.query(sql, [id]);
      connection.release();
      return user;
    } catch (error) {
      throw new Error(`Could not delete a user with id ${id}. Error: ${error}`);
    }
  }
}
