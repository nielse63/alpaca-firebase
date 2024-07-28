const alpaca = require('@alpaca-firebase/alpaca');
const { getPositionForSymbol } = require('..');

// Mock the alpaca module
jest.mock('@alpaca-firebase/alpaca');

describe('getPositionForSymbol', () => {
  it('should return position for a valid symbol', async () => {
    const mockPosition = { symbol: 'AAPL', qty: 10 };
    alpaca.getPosition.mockResolvedValue(mockPosition);

    const result = await getPositionForSymbol('AAPL');
    expect(result).toEqual(mockPosition);
  });

  it('should return null for an invalid symbol', async () => {
    alpaca.getPosition.mockRejectedValue(new Error('Invalid symbol'));

    const result = await getPositionForSymbol('INVALID');
    expect(result).toBeNull();
  });
});
