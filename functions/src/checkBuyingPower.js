const logger = require('firebase-functions/logger');
const { getBuyingPower } = require('@alpaca-firebase/account');

const checkBuyingPower = async () => {
  let buyingPower;
  try {
    logger.info('starting getBuyingPower');
    buyingPower = await getBuyingPower();
    logger.info('available buying power:', buyingPower);
    if (buyingPower <= 5) {
      logger.warn('insufficient buying power');
      return {
        status: 400,
        message: 'insufficient buying power',
        value: buyingPower,
      };
    }
  } catch (error) {
    logger.error('error in getBuyingPower:', error);
    return {
      status: 500,
      message: error.message,
      block: 'checkBuyingPower',
      error,
    };
  }

  return {
    buying_power: buyingPower,
  };
};

module.exports = checkBuyingPower;
