import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 3, b: 5, action: Action.Add, expected: 8 },
  { a: 3, b: 5, action: Action.Subtract, expected: -2 },
  { a: 3, b: 5, action: Action.Multiply, expected: 15 },
  { a: 3, b: 5, action: Action.Divide, expected: 0.6 },
  { a: 3, b: 5, action: Action.Exponentiate, expected: 243 },
  { a: 3, b: 5, action: '$', expected: null },
  { a: 'NaN', b: 5, action: Action.Add, expected: null },
  { a: 3, b: 'NaN', action: Action.Add, expected: null },
  { a: null, b: 5, action: Action.Add, expected: null },
  { a: 3, b: undefined, action: Action.Add, expected: null },
  { a: false, b: 5, action: Action.Add, expected: null },
  { a: 3, b: true, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected for inputs a: $a, b: $b, action: $action',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
