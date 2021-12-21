const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routers/reviewsRouters.js');
const port = 3000;


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/reviews', router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});