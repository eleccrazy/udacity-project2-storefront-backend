import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Test suite for the /api/prducts endpoint', () => {
  describe('Test suite without authorization token', () => {
    it('Expect GET request to the /api/products route to respond with a 200 ok status code, No auth required', async () => {
      const response = await request.get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, name: 'Samsung s12', price: 1100 }
      ]);
    });

    it('Expect GET request to the /api/products/id route to respond with a 200 ok status code, No auth required', async () => {
      const response = await request.get('/api/products/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Samsung s12',
        price: 1100
      });
    });

    it('Expect Post request to the /api/products route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.post('/api/products');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });

    it('Expect Delete request to the /api/products/1 route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.delete('/api/products/1');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });
  });

  describe('Test suite with authorization token', () => {
    let token: string;

    // This code runs before any other ..it block specs.
    beforeAll(async () => {
      const testUser = {
        username: 'testUsername2',
        firstName: 'First',
        lastName: 'Last',
        password: 'password-for-test'
      };
      const response = await request.post('/api/users').send(testUser);
      token = response.body;
    });

    it('Expect Get request to /api/products route to retrive all products with status code 200 ok.', async () => {
      const response = await request
        .get('/api/products')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, name: 'Samsung s12', price: 1100 }
      ]);
    });

    it('Expect POST request to /api/products route with missing params to respond with 400 bad request.', async () => {
      const response = await request
        .post('/api/products')
        .send({ name: 'HP Omen15' })
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        Error: 'name and price must be provided.'
      });
    });

    it('Expect POST request to /api/products route with all params to respond with 201 created.', async () => {
      const response = await request
        .post('/api/products')
        .send({ name: 'HP Omen15', price: 870 })
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(201);
      expect(response.body.id).toEqual(3);
    });

    it('Expect GET request to /api/products/id route with unknown id to respond with 404 Not Found status code.', async () => {
      const response = await request
        .get('/api/products/5')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ Error: 'Product with id 5 not found.' });
    });

    it('Expect GET request to /api/products/id route to respond a single product with 200 ok status code.', async () => {
      const response = await request
        .get('/api/products/3')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 3,
        name: 'HP Omen15',
        price: 870
      });
    });

    it('Expect DELETE request to /api/products/id route with unknown id to respond with 404 Not Found status code.', async () => {
      const response = await request
        .delete('/api/products/6')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ Error: 'Product with id 6 not found.' });
    });

    it('Expect DELETE request to /api/products/id route to respond the deleted product id with 200 ok status code.', async () => {
      const response = await request
        .delete('/api/products/3')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ DeletedProductId: 3 });
    });
  });
});
