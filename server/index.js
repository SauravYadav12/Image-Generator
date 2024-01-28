const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const router = require('./routes/routes');
const { connectDB } = require('./dbConnection');
require('dotenv').config()

const app = express();
app.use(bodyParser.json({limit: '20000kb'}));
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());
app.use('/',router);
const port = 4000 || process.env.PORT

app.listen(port,()=>{
    connectDB();
    console.log(`Server running at ${port}`);
})