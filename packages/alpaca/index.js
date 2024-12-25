require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api');

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_KEY,
  secretKey: process.env.ALPACA_SECRET,
  baseUrl: process.env.ALPACA_URL,
  paper: process.env.ALPACA_URL?.includes('paper'),
});

module.exports = alpaca;
