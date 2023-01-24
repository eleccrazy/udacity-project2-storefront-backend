import { response } from 'express';
import supertest from 'supertest';

import app from '../server';

const request = supertest(app);

describe('Test suite for the home and /api route', () => {
  it('Expect the / endpoint to redirect its traffic to the endpoint /api with 302.', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(302);
  });

  it('Expect the /api endpoint to respond with a 200 ok status code.', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
    expect(response.text).toEqual('For more info, read the README.md file.');
  });
});
