const alpaca = require('@alpaca-firebase/alpaca');

const getPositionForSymbol = async (symbol) => {
  try {
    const position = await alpaca.getPosition(symbol.replace('/', ''));
    return position;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getPositionForSymbol,
};
