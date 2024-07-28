const axios = require('axios');
const { toDecimal } = require('@alpaca-firebase/helpers');
const { getCryptoSnapshot, getMidPrice } = require('..');

// Mock the axios module
jest.mock('axios');
jest.mock('@alpaca-firebase/helpers');

describe('getCryptoSnapshot', () => {
  it('should return snapshot for a valid symbol', async () => {
    const mockSnapshot = {
      symbol: 'BTCUSD',
      latestQuote: { ap: 50000, bp: 49900 },
    };
    axios.mockResolvedValue({
      data: {
        snapshots: {
          BTCUSD: mockSnapshot,
        },
      },
    });

    const result = await getCryptoSnapshot('BTCUSD');
    expect(result).toEqual(mockSnapshot);
  });

  it('should return undefined for an invalid symbol', async () => {
    axios.mockResolvedValue({
      data: {
        snapshots: {},
      },
    });

    const result = await getCryptoSnapshot('INVALID');
    expect(result).toBeUndefined();
  });
});

describe('getMidPrice', () => {
  it('should return the mid price for a valid snapshot', () => {
    const mockSnapshot = { latestQuote: { ap: 50000, bp: 49900 } };
    toDecimal.mockImplementation((value, decimals) =>
      Number(value.toFixed(decimals))
    );

    const result = getMidPrice(mockSnapshot);
    expect(result).toBe(49950.0);
    expect(toDecimal).toHaveBeenCalledWith(49950, 4);
  });
});
