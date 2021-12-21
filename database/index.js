// const { CONFIG } = require('../config.js')
const CONFIG = {
  user:'postgres',
  host:'catwalk-reviews.cpao02pqmy0s.us-west-1.rds.amazonaws.com',
  database:'postgres',
  password:'Rootpass',
  port:5432
}

const Pool = require('pg').Pool;

const pool = new Pool(CONFIG);

module.exports = pool;