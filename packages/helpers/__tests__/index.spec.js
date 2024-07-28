const { formatSymbol, toDecimal } = require('..');

describe('formatSymbol', () => {
  it('should format symbol by adding /USD if not present', () => {
    expect(formatSymbol('BTCUSD')).toBe('BTC/USD');
  });

  it('should not change symbol if / is already present', () => {
    expect(formatSymbol('BTC/USD')).toBe('BTC/USD');
  });

  it('should not change symbol if it does not end with USD', () => {
    expect(formatSymbol('BTC')).toBe('BTC');
  });
});

describe('toDecimal', () => {
  it('should convert string to decimal with default points', () => {
    expect(toDecimal('123.456')).toBe(123.46);
  });

  it('should convert number to decimal with default points', () => {
    expect(toDecimal(123.456)).toBe(123.46);
  });

  it('should convert string to decimal with specified points', () => {
    expect(toDecimal('123.456', 1)).toBe(123.5);
  });

  it('should convert number to decimal with specified points', () => {
    expect(toDecimal(123.456, 1)).toBe(123.5);
  });

  it('should handle integer values correctly', () => {
    expect(toDecimal(123)).toBe(123.0);
  });

  it('should handle string integer values correctly', () => {
    expect(toDecimal('123')).toBe(123.0);
  });
});
