const logger = require('firebase-functions/logger');

const validateRequest = async (req) => {
  if (req.method !== 'POST') {
    return {
      status: 405,
      message: `request method ${req.method} not allowed`,
    };
  }
  logger.info('orders request body:', JSON.stringify(req.body));
  const { body } = req;
  const { symbol, side: direction } = body;
  const side = direction?.toLowerCase();
  if (!symbol) {
    logger.error('no symbol provided');
    return {
      status: 400,
      message: 'symbol is required',
    };
  }
  if (!side) {
    logger.error('no side provided');
    return {
      status: 400,
      message: 'side is required',
    };
  }
  return { symbol, side };
};

module.exports = validateRequest;
