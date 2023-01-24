import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);
const papper = process.env.BCRYPT_PASSWORD;

describe('Test suite for /api/orders endpoint', () => {
  describe('Test suite without authorization token', () => {
    it('Expect Get request to the /api/orders route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.get('/api/orders');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });

    it('Expect Post request to the /api/orders route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.post('/api/orders');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });

    it('Expect Get request to the /api/orders/1 route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.get('/api/orders/1');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });

    it('Expect Delete request to the /api/orders/1 route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.delete('/api/orders/1');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });
  });
  describe('Test suite with authorization token', () => {
    let token: string;

    // This code runs before any other ..it block specs.
    beforeAll(async () => {
      const testUser = {
        username: 'testUsername',
        firstName: 'First',
        lastName: 'Last',
        password: 'password-for-test'
      };
      const response = await request.post('/api/users').send(testUser);
      token = response.body;
    });

    it('Expect Get request to /api/orders route to retrive all orders with status code 200 ok.', async () => {
      const response = await request
        .get('/api/orders')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('Expect POST request to /api/orders route with missing params to respond with 400 bad request.', async () => {
      const response = await request
        .post('/api/orders')
        .send({ status: 'Active' })
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        Error: 'status and user_id must be provided'
      });
    });

    it('Expect POST request to /api/orders route with all params to respond with 201 created.', async () => {
      const response = await request
        .post('/api/orders')
        .send({ status: 'Active', user_id: 3 })
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(201);
      expect(response.body.id).toEqual(2);
    });

    it('Expect GET request to /api/orders/id route with unknown id to respond with 404 Not Found status code.', async () => {
      const response = await request
        .get('/api/orders/8')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ Error: 'Order with id 8 not found.' });
    });

    it('Expect GET request to /api/orders/id route to respond a single order with 200 ok status code.', async () => {
      const response = await request
        .get('/api/orders/2')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 2,
        status: 'Active',
        user_id: 3
      });
    });

    it('Expect DELETE request to /api/orders/id route with unknown id to respond with 404 Not Found status code.', async () => {
      const response = await request
        .delete('/api/orders/6')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ Error: 'Order with id 6 not found.' });
    });

    it('Expect DELETE request to /api/orders/id route to respond the deleted order id with 200 ok status code.', async () => {
      const response = await request
        .delete('/api/orders/2')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ DeletedOrderId: 2 });
    });
  });
});
