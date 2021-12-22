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

// for loader.io testing
app.use('/loaderio-3e06ec0bbf880911e0e77fc78bbe3073/', (req, res) => {
  res.status(200).send('loaderio-3e06ec0bbf880911e0e77fc78bbe3073');
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});