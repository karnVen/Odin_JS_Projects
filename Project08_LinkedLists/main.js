import { LinkedList } from './LinkedList.js';

const list = new LinkedList();

list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.append("turtle");

console.log("Original list:");
console.log(list.toString());

// Testing extra credit
list.insertAt(1, "lion", "tiger");
console.log("\nAfter inserting lion and tiger at index 1:");
console.log(list.toString());

list.removeAt(3);
console.log("\nAfter removing index 3 (cat):");
console.log(list.toString());

console.log("\nList Size:", list.size());
console.log("Head:", list.head());
console.log("Tail:", list.tail());