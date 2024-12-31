const logger = require('firebase-functions/logger');
const {
  createOrder,
  closeOrdersForSymbol,
} = require('@alpaca-firebase/orders');
const { getBuyingPower } = require('@alpaca-firebase/account');
const { orders } = require('../index');

jest.mock('firebase-functions/v2/https', () => ({
  onRequest: jest.fn((handler) => handler),
}));

jest.mock('firebase-functions/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@alpaca-firebase/orders', () => ({
  createOrder: jest.fn(),
  closeOrdersForSymbol: jest.fn(),
}));

jest.mock('@alpaca-firebase/account', () => ({
  getBuyingPower: jest.fn(),
}));

describe('firebase-functions', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        symbol: 'AAPL',
        side: 'buy',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('orders', () => {
    it('should return 405 if method is not POST', async () => {
      req.method = 'GET';
      await orders(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        message: 'request method GET not allowed',
      });
    });

    it('should return 400 if symbol is missing', async () => {
      req.body = { side: 'buy' };
      await orders(req, res);
      expect(logger.error).toHaveBeenCalledWith('no symbol provided');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'symbol is required',
      });
    });

    it('should return 400 if side is missing', async () => {
      req.body = { symbol: 'AAPL' };
      await orders(req, res);
      expect(logger.error).toHaveBeenCalledWith('no side provided');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'side is required',
      });
    });

    it('should return 400 if buying power is insufficient', async () => {
      req.body = { symbol: 'AAPL', side: 'buy' };
      getBuyingPower.mockResolvedValue(5);
      await orders(req, res);
      expect(logger.warn).toHaveBeenCalledWith('insufficient buying power');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'insufficient buying power',
        value: 5,
      });
    });

    it('should handle errors in getBuyingPower', async () => {
      req.body = { symbol: 'AAPL', side: 'buy' };
      const error = new Error('getBuyingPower error');
      getBuyingPower.mockRejectedValue(error);
      await orders(req, res);
      expect(logger.error).toHaveBeenCalledWith(
        'error in getBuyingPower:',
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error.message,
        block: 'getBuyingPower',
        error,
      });
    });

    it('should handle errors in closeOrdersForSymbol', async () => {
      req.body = { symbol: 'AAPL', side: 'buy' };
      getBuyingPower.mockResolvedValue(100);
      const error = new Error('closeOrdersForSymbol error');
      closeOrdersForSymbol.mockRejectedValue(error);
      await orders(req, res);
      expect(logger.error).toHaveBeenCalledWith(
        'error in closeOrdersForSymbol:',
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error.message,
        block: 'closeOrdersForSymbol',
        error,
      });
    });

    it('should handle errors in createOrder', async () => {
      req.body = { symbol: 'AAPL', side: 'buy' };
      getBuyingPower.mockResolvedValue(100);
      closeOrdersForSymbol.mockResolvedValue([]);
      const error = new Error('createOrder error');
      createOrder.mockRejectedValue(error);
      await orders(req, res);
      expect(logger.error).toHaveBeenCalledWith('error in createOrder:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error.message,
        block: 'createOrder',
        error,
      });
    });

    it('should return successful response', async () => {
      req.body = { symbol: 'AAPL', side: 'buy' };
      getBuyingPower.mockResolvedValue(100);
      closeOrdersForSymbol.mockResolvedValue(['order1']);
      createOrder.mockResolvedValue({ id: 'order2' });
      await orders(req, res);
      expect(res.json).toHaveBeenCalledWith({
        buying_power: 100,
        cancelled_orders: ['order1'],
        order: { id: 'order2' },
      });
    });
  });
});
