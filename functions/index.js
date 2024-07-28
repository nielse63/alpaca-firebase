require('dotenv').config();
const { onRequest } = require('firebase-functions/v2/https'); // eslint-disable-line import/no-unresolved
const logger = require('firebase-functions/logger'); // eslint-disable-line import/no-unresolved
const {
  createOrder,
  closeOrdersForSymbol,
} = require('@alpaca-firebase/orders');
const { getBuyingPower } = require('@alpaca-firebase/account');

exports.orders = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'method not allowed' });
  }
  logger.info('orders request body:', JSON.stringify(req.body));
  const { body } = req;
  if (body.test) {
    process.env.NODE_ENV = 'test';
  }
  const { symbol, side, price = null } = body;
  if (!symbol) {
    return res.status(400).json({ message: 'symbol is required' });
  }
  if (!side) {
    return res.status(400).json({ message: 'symbol is required' });
  }

  const output = {
    buying_power: null,
    cancelled_orders: [],
    order: null,
  };

  // check buying power
  try {
    const buyingPower = await getBuyingPower();
    output.buying_power = buyingPower;
    if (buyingPower <= 5) {
      return res.status(400).json({ message: 'insufficient buying power' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, block: 'getBuyingPower', error });
  }

  // cancel open buy orders
  try {
    output.cancelled_orders = await closeOrdersForSymbol(symbol, 'buy');
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, block: 'closeOrdersForSymbol', error });
  }

  // place new order
  try {
    const order = await createOrder(symbol, side, price);
    output.order = order;
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, block: 'createOrder', error });
  }

  return res.json(output);
});
