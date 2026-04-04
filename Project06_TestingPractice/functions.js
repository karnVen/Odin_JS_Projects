export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const reverseString = (str) => {
  return str.split("").reverse().join("");
};

export const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  divide: (a, b) => (b === 0 ? "Error" : a / b),
  multiply: (a, b) => a * b,
};

export const caesarCipher = (str, shift) => {
  const shiftChar = (char, factor) => {
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + factor) % 26) + 65);
    }
    
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + factor) % 26) + 97);
    }

    return char;
  };

  return str
    .split("")
    .map((char) => shiftChar(char, shift))
    .join("");
};

export const analyzeArray = (arr) => {
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  const average = sum / arr.length;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const length = arr.length;

  return { average, min, max, length };
};