const alpaca = require('@alpaca-firebase/alpaca');
const { formatSymbol } = require('@alpaca-firebase/helpers');
const { getBuyingPower } = require('@alpaca-firebase/account');
const { getPositionForSymbol } = require('@alpaca-firebase/positions');

const getOrdersForSymbol = async (symbol, config = {}) => {
  const options = {
    status: 'open',
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
    side: 'buy',
    symbol: formatSymbol(symbol),
    type: 'market',
    notional: buyingPower,
    time_in_force: 'gtc',
    position_intent: 'buy_to_open',
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
    side: 'sell',
    type: 'market',
    time_in_force: 'gtc',
    symbol: formatSymbol(symbol),
    position_intent: 'sell_to_close',
    qty,
    ...config,
  };
  // return options;
  const order = await alpaca.createOrder(options);
  return order;
};

const createOrder = async (symbol, side, config = {}) => {
  if (side === 'buy') {
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
