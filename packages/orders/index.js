const alpaca = require('@alpaca-firebase/alpaca');
const { formatSymbol, constants } = require('@alpaca-firebase/helpers');
const { getBuyingPower } = require('@alpaca-firebase/account');
const { getPositionForSymbol } = require('@alpaca-firebase/positions');

const getOrdersForSymbol = async (symbol, config = {}) => {
  const options = {
    status: constants.OPEN,
    nested: true,
    symbols: formatSymbol(symbol),
    ...config,
  };
  const orders = await alpaca.getOrders(options);
  return orders;
};

const closeOrdersForSymbol = async (symbol) => {
  const orders = await getOrdersForSymbol(symbol);
  const orderIds = orders.map((order) => order.id);
  const promises = orderIds.map((id) => alpaca.cancelOrder(id));
  try {
    await Promise.all(promises);
    return orderIds;
  } catch (error) {
    console.error(error);
  }
  return [];
};

const createBuyOrder = async (symbol, config = {}) => {
  const maxBuyingPower = await getBuyingPower();
  const buyingPower = maxBuyingPower * 0.99;
  const options = {
    side: constants.BUY,
    symbol: formatSymbol(symbol),
    type: constants.MARKET,
    notional: parseFloat(buyingPower.toFixed(2)),
    time_in_force: constants.DAY,
    position_intent: constants.BUY_TO_OPEN,
    ...config,
  };
  // return options;
  const order = await alpaca.createOrder(options);
  return order;
};

const createSellOrder = async (symbol, config = {}) => {
  const position = await getPositionForSymbol(symbol);
  if (!position) {
    return null;
  }
  const qty = parseFloat(position.qty);
  const options = {
    side: constants.SELL,
    type: constants.MARKET,
    time_in_force: constants.DAY,
    symbol: formatSymbol(symbol),
    position_intent: constants.SELL_TO_CLOSE,
    qty,
    ...config,
  };
  // return options;
  const order = await alpaca.createOrder(options);
  return order;
};

const createOrder = async (symbol, side, config = {}) => {
  if (side === constants.BUY) {
    return createBuyOrder(formatSymbol(symbol), config);
  }
  return createSellOrder(formatSymbol(symbol), config);
};

module.exports = {
  getOrdersForSymbol,
  closeOrdersForSymbol,
  createBuyOrder,
  createSellOrder,
  createOrder,
};
