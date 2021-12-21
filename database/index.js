const { CONFIG } = require('../config.js')
const Pool = require('pg').Pool;

const pool = new Pool(CONFIG);

module.exports = pool;