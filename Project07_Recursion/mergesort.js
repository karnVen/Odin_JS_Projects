function mergeSort(array) {
  if (array.length <= 1) return array;

  const mid = Math.floor(array.length / 2);
  const leftSide = array.slice(0, mid);
  const rightSide = array.slice(mid);

  return merge(mergeSort(leftSide), mergeSort(rightSide));
}

function merge(left, right) {
  const sorted = [];

  while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) {
      sorted.push(left.shift());
    } else {
      sorted.push(right.shift());
    }
  }

  return [...sorted, ...left, ...right];
}

// Testing
console.log(mergeSort([]));
console.log(mergeSort([73])); 
console.log(mergeSort([1, 2, 3, 4, 5])); 
console.log(mergeSort([3, 2, 1, 13, 8, 5, 0, 1])); 
console.log(mergeSort([105, 79, 100, 110]));