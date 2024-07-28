const formatSymbol = (symbol) =>
  !symbol.includes('/') ? symbol.replace(/USD$/, '/USD') : symbol;

const toDecimal = (value, points = 2) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return parseFloat(`${numericValue.toFixed(points)}`);
};

module.exports = {
  formatSymbol,
  toDecimal,
};
