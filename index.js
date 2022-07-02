// connection to mongoDB
const connectToMongo = require('./db');
connectToMongo();

// create express server
const express = require('express');
const app = express();
const port = 5000;

// cors
var cors = require('cors');
app.use(cors());

app.use(express.json());

// endpoint (router)
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/notes'));

// app.get('/', (req, res)=>{
//     res.send('Hello world !!')
// })

// listening the request on port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
