/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import sauces from './sauces.js';
import users from './user.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
        [user.name, user.email, user.password_hash]);
      })
    );

    const user = data[0].rows[0];

    await Promise.all(
      sauces.map(sauce => {
        return client.query(`
          INSERT INTO sauces(name, location, scoville, img, user_id)
          VALUES ($1, $2, $3, $4, $5);
        `,
        [sauce.name, sauce.location, sauce.scoville, sauce.img, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}