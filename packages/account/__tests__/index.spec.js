const alpaca = require('@alpaca-firebase/alpaca');
const { getBuyingPower } = require('..');

jest.mock('@alpaca-firebase/alpaca');

describe('getBuyingPower', () => {
  it('should return the correct buying power', async () => {
    const mockAccount = {
      non_marginable_buying_power: '1000.00',
    };
    alpaca.getAccount.mockResolvedValue(mockAccount);

    const buyingPower = await getBuyingPower();
    expect(buyingPower).toBe(1000.0);
  });
});
