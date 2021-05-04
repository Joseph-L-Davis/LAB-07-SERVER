/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import sauces from './sauces.js';

run();

async function run() {

  try {

    await Promise.all(
      sauces.map(sauce => {
        return client.query(`
          INSERT INTO sauces(name, location, scoville, img)
          VALUES ($1, $2, $3, $4);
        `,
        [sauce.name, sauce.location, sauce.scoville, sauce.img]);
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