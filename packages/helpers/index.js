const formatSymbol = (symbol) =>
  !symbol.includes('/') ? symbol.replace(/USD$/, '/USD') : symbol;

const toDecimal = (value, points = 2) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return parseFloat(`${numericValue.toFixed(points)}`);
};

const constants = {
  BUY: 'buy',
  SELL: 'sell',
  MARKET: 'market',
  GTC: 'gtc',
  DAY: 'day',
  IOC: 'ioc',
  BUY_TO_OPEN: 'buy_to_open',
  SELL_TO_CLOSE: 'sell_to_close',
  OPEN: 'open',
};

module.exports = {
  formatSymbol,
  toDecimal,
  constants,
};
