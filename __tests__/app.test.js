import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  beforeAll(() => {
    execSync('npm run setup-db');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedSauces = [
    {
      id: expect.any(Number),
      name: 'Aardvark',
      location: 'Oregon',
      scoville: '5,000',
      img: 'sauces/aardvark.jpg'
    },
    {
      id: expect.any(Number),
      name: 'Apocalypse',
      location: 'Pennsylvania',
      scoville: '500,000',
      img: 'sauces/zombie.jpg'
    },
    {
      id: expect.any(Number),
      name: 'Yellow Bird',
      location: 'Texas',
      scoville: '16,000',
      img: 'sauces/yellowbird.jpg'
    },
    {
      id: expect.any(Number),
      name: 'Yucateco',
      location: 'Mexico',
      scoville: '11,600',
      img: 'sauces/yucateco.jpg'
    },
    {
      id: expect.any(Number),
      name: 'Mad Dog 357',
      location: 'Massachusetts',
      scoville: '357,000',
      img: 'sauces/maddog.jpg'
    },
  ];

  // If a GET request is made to /api/sauces, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  test('GET /api/sauces', async () => {
    // act - make the request
    const response = await request.get('/api/sauces');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedSauces);

  });

  // If a GET request is made to /api/sauces/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test('GET /api/sauces/:id', async () => {
    const response = await request.get('/api/sauces/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedSauces[1]);
  });
});