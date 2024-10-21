import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 3, b: 5, action: '+' });
    expect(result).toBe(8);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 3, b: 5, action: '-' });
    expect(result).toBe(-2);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 3, b: 5, action: '*' });
    expect(result).toBe(15);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 3, b: 5, action: '/' });
    expect(result).toBe(0.6);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({ a: 3, b: 5, action: '^' });
    expect(result).toBe(243);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 3, b: 5, action: '$' });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result1 = simpleCalculator({ a: 'NaN', b: 5, action: Action.Add });
    const result2 = simpleCalculator({ a: 3, b: 'NaN', action: Action.Add });
    const result3 = simpleCalculator({ a: null, b: 5, action: Action.Add });
    const result4 = simpleCalculator({
      a: 3,
      b: undefined,
      action: Action.Add,
    });
    const result5 = simpleCalculator({ a: false, b: 5, action: Action.Add });

    expect(result1).toBeNull();
    expect(result2).toBeNull();
    expect(result3).toBeNull();
    expect(result4).toBeNull();
    expect(result5).toBeNull();
  });
});
