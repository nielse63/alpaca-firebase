require('dotenv').config();
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const {
  createOrder,
  closeOrdersForSymbol,
} = require('@alpaca-firebase/orders');
const { constants } = require('@alpaca-firebase/helpers');
const { getBuyingPower } = require('@alpaca-firebase/account');

exports.orders = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'method not allowed',
      details: `provided method: ${req.method}`,
    });
  }
  logger.info('orders request body:', JSON.stringify(req.body));
  const { body } = req;
  const { symbol } = body;
  const side = body?.side?.toLowerCase();
  if (!symbol) {
    logger.error('no symbol provided');
    return res.status(400).json({ message: 'symbol is required' });
  }
  if (!side) {
    logger.error('no side provided');
    return res.status(400).json({ message: 'side is required' });
  }

  const output = {
    buying_power: null,
    cancelled_orders: [],
    order: null,
  };

  // check buying power
  if (side === constants.BUY) {
    try {
      logger.info('starting getBuyingPower');
      const buyingPower = await getBuyingPower();
      logger.info('available buying power:', buyingPower);
      output.buying_power = buyingPower;
      if (buyingPower <= 5) {
        logger.warn('insufficient buying power');
        return res
          .status(400)
          .json({ message: 'insufficient buying power', value: buyingPower });
      }
    } catch (error) {
      logger.error('error in getBuyingPower:', error);
      return res
        .status(500)
        .json({ message: error.message, block: 'getBuyingPower', error });
    }
  }

  // cancel open buy orders
  try {
    logger.info('starting closeOrdersForSymbol');
    output.cancelled_orders = await closeOrdersForSymbol(symbol, 'buy');
    logger.info('cancelled orders:', output.cancelled_orders);
  } catch (error) {
    logger.error('error in closeOrdersForSymbol:', error);
    return res
      .status(500)
      .json({ message: error.message, block: 'closeOrdersForSymbol', error });
  }

  // place new order
  try {
    logger.info('starting createOrder');
    const order = await createOrder(symbol, side);
    logger.info('new order:', order);
    output.order = order;
  } catch (error) {
    logger.error('error in createOrder:', error);
    return res
      .status(500)
      .json({ message: error.message, block: 'createOrder', error });
  }

  logger.info('orders response:', JSON.stringify(output));
  return res.json(output);
});
