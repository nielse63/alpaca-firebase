const dotenv = require('dotenv');
const Alpaca = require('@alpacahq/alpaca-trade-api');

jest.mock('dotenv');
jest.mock('@alpacahq/alpaca-trade-api');

describe('Alpaca configuration', () => {
  beforeAll(() => {
    dotenv.config.mockImplementation(() => ({
      parsed: {
        ALPACA_KEY: 'test_key',
        ALPACA_SECRET: 'test_secret',
        ALPACA_URL: 'https://paper-api.alpaca.markets',
      },
    }));
  });

  it('should create an Alpaca instance with the correct configuration', () => {
    // eslint-disable-next-line global-require
    require('..'); // This will execute the code in index.js

    expect(Alpaca).toHaveBeenCalledWith({
      keyId: 'test_key',
      secretKey: 'test_secret',
      paper: true,
    });
  });

  it('should return the same instance as a singleton', () => {
    // eslint-disable-next-line global-require
    const alpaca = require('..');
    expect(alpaca).toEqual(Alpaca.mock.instances[0]);
  });
});
