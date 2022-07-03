// create express server
const express = require('express');
const app = express();

// dotenc config
require('dotenv').config({path: './config.env'});

// connection to mongoDB
require('./database/db');

// cors
var cors = require('cors');
app.use(cors());

app.use(express.json());

// endpoint (router)
app.use(require('./routes/auth'));
app.use(require('./routes/notes'));

// app.get('/', (req, res)=>{
//     res.send('Hello world !!')
// })

// listening the request on port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
