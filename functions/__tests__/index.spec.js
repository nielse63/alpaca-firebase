const { orders } = require('..');

const mockRequest = {
  method: 'POST',
  body: {
    symbol: 'AAPL',
    side: 'buy',
    test: true,
  },
};
const mockResponse = {
  status: jest.fn(() => mockResponse),
  json: jest.fn(),
};

describe('firebase-functions', () => {
  describe('orders', () => {
    it('should return status 405 if the method isnt POST', async () => {
      const statusSpy = jest.spyOn(mockResponse, 'status');
      const jsonSpy = jest.spyOn(mockResponse, 'json');

      await orders({ ...mockRequest, method: 'GET' }, mockResponse);
      expect(statusSpy).toHaveBeenCalledWith(405);
      expect(jsonSpy).toHaveBeenCalledWith({ message: 'method not allowed' });
    });
  });
});
