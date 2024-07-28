const alpaca = require('@alpaca-firebase/alpaca');
const { formatSymbol, toDecimal } = require('@alpaca-firebase/helpers');
const { getCryptoSnapshot, getMidPrice } = require('@alpaca-firebase/quote');
const { getBuyingPower } = require('@alpaca-firebase/account');
const { getPositionForSymbol } = require('@alpaca-firebase/positions');
const {
  getOrdersForSymbol,
  closeOrdersForSymbol,
  createBuyOrder,
  createSellOrder,
  createOrder,
} = require('..');

jest.mock('@alpaca-firebase/alpaca');
jest.mock('@alpaca-firebase/helpers');
jest.mock('@alpaca-firebase/quote');
jest.mock('@alpaca-firebase/account');
jest.mock('@alpaca-firebase/positions');
// jest.mock('..', () => {
//   const actual = jest.requireActual('..');
//   return {
//     ...actual,
//     createBuyOrder: jest.fn(),
//     createSellOrder: jest.fn(),
//   };
// });

describe('getOrdersForSymbol', () => {
  it('should get orders for a symbol', async () => {
    const mockOrders = [{ id: 'order1' }, { id: 'order2' }];
    alpaca.getOrders.mockResolvedValue(mockOrders);
    formatSymbol.mockReturnValue('BTC/USD');

    const orders = await getOrdersForSymbol('BTCUSD');
    expect(orders).toEqual(mockOrders);
    expect(alpaca.getOrders).toHaveBeenCalledWith({
      status: 'open',
      nested: true,
      symbols: 'BTC/USD',
    });
  });
});

describe('closeOrdersForSymbol', () => {
  it('should close orders for a symbol', async () => {
    const mockOrders = [{ id: 'order1' }, { id: 'order2' }];
    alpaca.getOrders.mockResolvedValue(mockOrders);
    alpaca.cancelOrder.mockResolvedValue({});
    formatSymbol.mockReturnValue('BTC/USD');

    const orderIds = await closeOrdersForSymbol('BTCUSD');
    expect(orderIds).toEqual(['order1', 'order2']);
    expect(alpaca.cancelOrder).toHaveBeenCalledTimes(2);
  });
});

describe('createBuyOrder', () => {
  it('should create a buy order', async () => {
    const mockBuyingPower = 1000;
    const mockSnapshot = { midPrice: 500 };
    const mockOrder = { id: 'order1' };
    formatSymbol.mockReturnValue('BTC/USD');
    getBuyingPower.mockResolvedValue(mockBuyingPower);
    getCryptoSnapshot.mockResolvedValue(mockSnapshot);
    getMidPrice.mockReturnValue(500);
    toDecimal.mockReturnValue(1.98);
    alpaca.createOrder.mockResolvedValue(mockOrder);

    const order = await createBuyOrder('BTCUSD');
    expect(order).toEqual(mockOrder);
    expect(alpaca.createOrder).toHaveBeenCalledWith({
      side: 'buy',
      symbol: 'BTC/USD',
      type: 'limit',
      limit_price: 500,
      qty: 1.98,
      time_in_force: 'gtc',
      position_intent: 'buy_to_open',
    });
  });
});

describe('createSellOrder', () => {
  it('should create a sell order', async () => {
    const mockPosition = { qty: '2' };
    const mockSnapshot = { midPrice: 500 };
    const mockOrder = { id: 'order1' };
    formatSymbol.mockReturnValue('BTC/USD');
    getPositionForSymbol.mockResolvedValueOnce(mockPosition);
    getCryptoSnapshot.mockResolvedValueOnce(mockSnapshot);
    getMidPrice.mockReturnValueOnce(500);
    alpaca.createOrder.mockResolvedValueOnce(mockOrder);

    const order = await createSellOrder('BTCUSD');
    expect(order).toEqual(mockOrder);
    expect(alpaca.createOrder).toHaveBeenCalledWith({
      side: 'sell',
      type: 'limit',
      limit_price: 500,
      time_in_force: 'gtc',
      symbol: 'BTC/USD',
      position_intent: 'sell_to_close',
      qty: 2,
    });
  });
});

describe.skip('createOrder', () => {
  it('should create a buy order when side is buy', async () => {
    const mockOrder = { id: 'order1' };
    formatSymbol.mockReturnValue('BTC/USD');
    getBuyingPower.mockResolvedValueOnce(100);
    getMidPrice.mockReturnValueOnce(10);
    toDecimal.mockReturnValueOnce(9.9);
    alpaca.createOrder.mockResolvedValueOnce(mockOrder);

    const order = await createOrder('BTCUSD', 'buy');
    expect(order).toEqual(mockOrder);
    expect(alpaca.createOrder).toHaveBeenCalledWith({
      side: 'buy',
      symbol: 'BTC/USD',
      type: 'limit',
      limit_price: 10,
      qty: 9.9,
      time_in_force: 'gtc',
      position_intent: 'buy_to_open',
    });
  });

  it('should create a sell order when side is sell', async () => {
    const mockOrder = { id: 'order1' };
    getPositionForSymbol.mockResolvedValueOnce({ qty: 2 });
    formatSymbol.mockReturnValue('BTC/USD');
    // getBuyingPower.mockResolvedValue(100);
    getMidPrice.mockReturnValueOnce(10);
    // toDecimal.mockReturnValue(9.9);
    alpaca.createOrder.mockResolvedValue(mockOrder);

    const order = await createOrder('BTCUSD', 'sell');
    expect(order).toEqual(mockOrder);
    expect(alpaca.createOrder).toHaveBeenCalledWith({
      side: 'sell',
      symbol: 'BTC/USD',
      type: 'limit',
      limit_price: 10,
      qty: 2,
      time_in_force: 'gtc',
      position_intent: 'sell_to_close',
    });
  });
});
