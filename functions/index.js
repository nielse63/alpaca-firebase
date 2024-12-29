require('dotenv').config();
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const {
  createOrder,
  closeOrdersForSymbol,
} = require('@alpaca-firebase/orders');
const { constants } = require('@alpaca-firebase/helpers');
const validateRequest = require('./src/validateRequest');
const checkBuyingPower = require('./src/checkBuyingPower');

exports.orders = onRequest(async (req, res) => {
  // validate request
  const isRequestValid = await validateRequest(req);
  if (isRequestValid?.status) {
    return res.status(isRequestValid.status).json({ ...isRequestValid });
  }
  const { side, symbol } = isRequestValid;

  const output = {
    buying_power: null,
    cancelled_orders: [],
    order: null,
  };

  // check buying power
  if (side === constants.BUY) {
    const buyingPower = await checkBuyingPower(req);
    if (buyingPower?.status) {
      return res.status(buyingPower.status).json({ ...buyingPower });
    }
    Object.assign(output, buyingPower);
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
