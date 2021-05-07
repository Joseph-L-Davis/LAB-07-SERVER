import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/sauces', () => {

    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'This is Name',
          email: 'email@email.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;

    });
 
    let aardvark = {
      id: expect.any(Number),
      name: 'Aardvark',
      location: 'Oregon',
      scoville: '5,000',
      img: 'sauces/aardvark.jpg'
    };

    let apocalypse = 
    {
      id: expect.any(Number),
      name: 'Apocalypse',
      location: 'Pennsylvania',
      scoville: '500,000',
      img: 'sauces/zombie.jpg'
    };

    let yellowBird = 
    {
      id: expect.any(Number),
      name: 'Yellow Bird',
      location: 'Texas',
      scoville: '16,000',
      img: 'sauces/yellowbird.jpg'
    };

    it('POST aardvark to sauces', async () => {
      aardvark.userId = user.id;
      // act - make the request
      const response = await request
        .post('/api/sauces')
        .send(aardvark);

      // was response OK (200)?
      expect(response.status).toBe(200);

      // did it return the data we expected?
      expect(response.body).toEqual(aardvark);
    
      aardvark = response.body;

    });

    it('PUT updated aardvark to sauces', async () => {

      aardvark.location = 'Not Oregon';
      aardvark.scoville = '1';
      // act - make the request
      const response = await request
        .put(`/api/sauces/${aardvark.id}`)
        .send(aardvark);

      // was response OK (200)?
      expect(response.status).toBe(200);

      // did it return the data we expected?
      expect(response.body).toEqual(aardvark);

    });

    it('GET multiple sauces from sauces', async () => {
      apocalypse.userId = user.id;
      const sauce1 = await request.post('/api/sauces').send(apocalypse);
      apocalypse = sauce1.body;

      yellowBird.userId = user.id;
      const sauce2 = await request.post('/api/sauces').send(yellowBird);
      yellowBird = sauce2.body;

      const response = await request.get('/api/sauces');

      expect(response.status).toBe(200);
      
      const expected = [aardvark, apocalypse, yellowBird].map(sauce => {
        return {
          userName: user.name,
          ...sauce
        };
      });

      expect(response.body).toEqual(expect.arrayContaining(expected));
    });

    it('DELETE yellowBird from sauces', async () => {
      const response = await request.delete(`/api/sauces/${yellowBird.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(yellowBird);

      const getResponse = await request.get('/api/sauces');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.find(sauce => sauce.id === yellowBird.id)).toBeUndefined;

    
    });

    it('GET apocalypse from sauces', async () => {
      const response = await request.get(`/api/sauces/${apocalypse.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...apocalypse, userName: user.name });
    });



    // If a GET request is made to /api/sauces, does:
    // 1) the server respond with status of 200
    // 2) the body match the expected API data?
    it.skip('GET /api/sauces', async () => {
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
    it.skip('GET /api/sauces/:id', async () => {
      const response = await request.get('/api/sauces/2');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedSauces[1]);
    });
  });
});