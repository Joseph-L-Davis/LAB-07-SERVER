/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Joe\'s Hot Sauce Shop');
});

// API routes,
// CREATE ROUTE OF CRUD
app.post('/api/sauces', async (req, res) => {
  try {
    const sauce = req.body;

    const data = await client.query(`
    INSERT INTO sauces( name, location, scoville, img)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, location, scoville, img;`,
    [sauce.name, sauce.location, sauce.scoville, sauce.img]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/sauces/:id', async (req, res) => {
  try {
    const sauce = req.body;

    const data = await client.query(`
    UPDATE sauces
    SET name = $1, location = $2, scoville = $3, img = $4
    WHERE id = $5
    RETURNING id, name, location, scoville, img;`,
    [sauce.name, sauce.location, sauce.scoville, sauce.img, req.params.id]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/sauces', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              location,
              scoville,
              img
      FROM    sauces;
    `);

    // send back the data
    res.json(data.rows); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/sauces/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              location,
              scoville,
              img
      FROM    sauces
      WHERE   id = $1
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/sauces/:name', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              location,
              scoville,
              img
      FROM    sauces
      WHERE   name = $2
    `, [req.query.name]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

export default app;