const { toDecimal } = require('@alpaca-firebase/helpers');
const axios = require('axios');

const getCryptoSnapshot = async (symbol) => {
  const url = 'https://data.alpaca.markets/v1beta3/crypto/us/snapshots';
  const {
    data: { snapshots: data },
  } = await axios({
    method: 'get',
    url,
    params: {
      symbols: symbol,
    },
  });
  return data[symbol];
};

const getMidPrice = (snapshot) => {
  const { latestQuote } = snapshot;
  const { ap: askPrice, bp: bidPrice } = latestQuote;
  return toDecimal((askPrice + bidPrice) / 2, 4);
};

module.exports = {
  getCryptoSnapshot,
  getMidPrice,
};
