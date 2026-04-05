import HashMap from './hashmap.js';

const test = new HashMap();

// Populate initial nodes
test.set('apple', 'red');
test.set('banana', 'yellow');
test.set('carrot', 'orange');
test.set('dog', 'brown');
test.set('elephant', 'gray');
test.set('frog', 'green');
test.set('grape', 'purple');
test.set('hat', 'black');
test.set('ice cream', 'white');
test.set('jacket', 'blue');
test.set('kite', 'pink');
test.set('lion', 'golden');

console.log(`Current length: ${test.length()}`); // 12
console.log(`Current capacity: ${test.capacity}`); // 16

// Overwrite existing values
test.set('apple', 'bright red');
test.set('dog', 'dark brown');
console.log(`Length after overwrites (should be 12): ${test.length()}`);

// Trigger growth
test.set('moon', 'silver');
console.log(`Length after moon: ${test.length()}`); // 13
console.log(`New capacity (should be 32): ${test.capacity}`);

// Test other methods
console.log("Entries:", test.entries());
console.log("Has kite?", test.has('kite')); // true
console.log("Get carrot:", test.get('carrot')); // orange
console.log("Remove elephant:", test.remove('elephant')); // true
console.log("Final length:", test.length()); // 12