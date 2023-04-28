import path from 'path';

console.log('../src/config/.env');


require('dotenv').config({
    path: path.resolve(__dirname, 'config', '.env')
})

import express from 'express';
const app = express()
import v1Router from './routes/api/v1';
import { log } from 'console';
require("./models/associations")

// setting the Port number
const port = process.env.PORT || 3000

// setting express middlewares
app.use(express.json()); // for parsing the incomming JSON data
app.use(express.static(path.join(__dirname, 'public')));

// setting API router
app.use('/v1', v1Router);

// setting API Live page
app.get('/', (req, res) => {
    res.send('API is Live')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

export default app;