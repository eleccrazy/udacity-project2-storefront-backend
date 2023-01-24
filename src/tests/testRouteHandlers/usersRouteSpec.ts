import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Test suite for the /api/users endpoint', () => {
  describe('Test suite without authorization token', () => {
    it('Expect Get request to the /api/users route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.get('/api/users');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });

    it('Expect Get request to the /api/users/1 route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.get('/api/users/1');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });

    it('Expect Delete request to the /api/users/1 route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.delete('/api/users/1');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });

    it('Expect Get request to the /api/users/2/orders route to respond with a 401 Unauthorized error.', async () => {
      const response = await request.get('/api/users/2/orders');
      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized Access');
    });
  });

  describe('Test suite with authorization token', () => {
    let token: string;

    it('Expect POST request to /api/users route with missing params to respond with 400 bad request. Actually, No auth required for creating the user', async () => {
      const response = await request.post('/api/users').send({
        firstName: 'Bayness',
        lastName: 'Gizachew',
        username: 'kingsofking'
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        Error: 'username, firstName, and password must be provided'
      });
    });

    it('Expect POST request to /api/users route with all params to respond with 201 created.', async () => {
      const response = await request.post('/api/users').send({
        firstName: 'Bayness',
        lastName: 'Gizachew',
        username: 'kingsofking',
        password: 'test-password'
      });
      expect(response.status).toBe(201);
      token = response.body;
    });

    it('Expect POST request to /api/users route with existing username to respond with 400 bad request.', async () => {
      const response = await request.post('/api/users').send({
        firstName: 'Udacity',
        lastName: 'Backend',
        username: 'kingsofking',
        password: 'funny'
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        Message: 'Username already taken, try another username'
      });
    });

    it('Expect Get request to /api/users route to retrive all users with status code 200 ok.', async () => {
      const response = await request
        .get('/api/users')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(4);
    });

    it('Expect GET request to /api/users/id route with unknown id to respond with 404 Not Found status code.', async () => {
      const response = await request
        .get('/api/users/9')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ Error: 'User with id 9 not found.' });
    });

    it('Expect GET request to /api/users/id route to respond a single user with 200 ok status code.', async () => {
      const response = await request
        .get('/api/users/5')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body.username).toEqual('kingsofking');
      expect(response.body.id).toBe(5);
    });

    it('Expect DELETE request to /api/users/id route with unknown id to respond with 404 Not Found status code.', async () => {
      const response = await request
        .delete('/api/users/6')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ Error: 'User with id 6 not found.' });
    });

    it('Expect DELETE request to /api/users/id route to respond the deleted user id with 200 ok status code.', async () => {
      const response = await request
        .delete('/api/users/4')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ DeletedUserId: 4 });
    });

    it('Expect GET request to /api/users/id/orders route to respond all orders by the user with 200 ok status code.', async () => {
      // First create orders which will be linked to the user.
      const order1 = await request
        .post('/api/orders')
        .send({ status: 'Active', user_id: 5 })
        .set('Authorization', 'bearer ' + token);
      expect(order1.status).toBe(201);

      const order2 = await request
        .post('/api/orders')
        .send({ status: 'Active', user_id: 5 })
        .set('Authorization', 'bearer ' + token);
      expect(order2.status).toBe(201);

      const response = await request
        .get('/api/users/5/orders')
        .set('Authorization', 'bearer ' + token);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });
});
