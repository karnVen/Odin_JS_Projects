import Tree from './tree.js';

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) return;
  prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

// 1. Create BST from random numbers
const getRandomArray = (size) => Array.from({ length: size }, () => Math.floor(Math.random() * 100));
const tree = new Tree(getRandomArray(15));

// 2. Confirm balance
console.log("Is Balanced:", tree.isBalanced());

// 3. Print traversals
const log = (val) => process.stdout.write(val + " ");

console.log("\nLevel Order:"); tree.levelOrderForEach(log);
console.log("\nPreorder:"); tree.preOrderForEach(log);
console.log("\nPostorder:"); tree.postOrderForEach(log);
console.log("\nInorder:"); tree.inOrderForEach(log);

// 4. Unbalance the tree
console.log("\n\nUnbalancing tree...");
tree.insert(105);
tree.insert(110);
tree.insert(150);
prettyPrint(tree.root);

// 5. Confirm unbalanced
console.log("\nIs Balanced:", tree.isBalanced());

// 6. Rebalance
console.log("\nRebalancing...");
tree.rebalance();

// 7. Confirm balanced
console.log("Is Balanced:", tree.isBalanced());

// 8. Print traversals again
console.log("\nInorder after rebalance:"); tree.inOrderForEach(log);
console.log("\n");
prettyPrint(tree.root);