import { capitalize, reverseString, calculator, caesarCipher, analyzeArray } from './functions';

test('capitalizes the first letter', () => {
  expect(capitalize('odin')).toBe('Odin');
});

test('reverses a string correctly', () => {
  expect(reverseString('hello')).toBe('olleh');
});

describe('calculator operations', () => {
  test('addition', () => {
    expect(calculator.add(5, 5)).toBe(10);
  });

  test('subtraction', () => {
    expect(calculator.subtract(10, 4)).toBe(6);
  });

  test('division', () => {
    expect(calculator.divide(20, 5)).toBe(4);
  });

  test('multiplication', () => {
    expect(calculator.multiply(6, 7)).toBe(42);
  });
});

describe('caesar cipher logic', () => {
  test('wraps from z to a', () => {
    expect(caesarCipher('xyz', 3)).toBe('abc');
  });

  test('maintains identical case', () => {
    expect(caesarCipher('HeLLo', 3)).toBe('KhOOr');
  });

  test('keeps punctuation and spaces', () => {
    expect(caesarCipher('Hello, World!', 3)).toBe('Khoor, Zruog!');
  });
});

test('analyzes array correctly', () => {
  const data = [1, 8, 3, 4, 2, 6];
  const result = analyzeArray(data);
  
  expect(result).toEqual({
    average: 4,
    min: 1,
    max: 8,
    length: 6,
  });
});