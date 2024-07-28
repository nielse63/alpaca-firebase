const alpaca = require('@alpaca-firebase/alpaca');
const { formatSymbol, toDecimal } = require('@alpaca-firebase/helpers');
const { getCryptoSnapshot, getMidPrice } = require('@alpaca-firebase/quote');
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
    if (process.env.NODE_ENV !== 'development') {
      await Promise.all(promises);
    }
    return orderIds;
  } catch (error) {
    console.error(error);
  }
  return [];
};

const createBuyOrder = async (symbol, config = {}) => {
  const maxBuyingPower = await getBuyingPower();
  const snapshot = await getCryptoSnapshot(symbol);
  const price = getMidPrice(snapshot);
  const buyingPower = maxBuyingPower * 0.99;
  const qty = toDecimal(buyingPower / price, 4);
  const options = {
    side: 'buy',
    symbol: formatSymbol(symbol),
    // type: 'market',
    // notional: buyingPower,
    type: 'limit',
    limit_price: price,
    qty,
    time_in_force: 'gtc',
    position_intent: 'buy_to_open',
    ...config,
  };
  if (process.env.NODE_ENV !== 'development') {
    const order = await alpaca.createOrder(options);
    return order;
  }
  return options;
};

const createSellOrder = async (symbol, config = {}) => {
  const position = await getPositionForSymbol(symbol);
  if (!position) {
    return null;
  }
  const snapshot = await getCryptoSnapshot(symbol);
  const price = getMidPrice(snapshot);
  const qty = parseFloat(position.qty);
  const options = {
    side: 'sell',
    type: 'limit',
    limit_price: price,
    time_in_force: 'gtc',
    symbol: formatSymbol(symbol),
    position_intent: 'sell_to_close',
    qty,
    ...config,
  };
  if (process.env.NODE_ENV !== 'development') {
    const order = await alpaca.createOrder(options);
    return order;
  }
  return options;
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
