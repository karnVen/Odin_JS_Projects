import Node from './node.js';

export default class Tree {
  constructor(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(sortedArray);
  }

  buildTree(array) {
    if (array.length === 0) return null;

    const mid = Math.floor(array.length / 2);
    const node = new Node(array[mid]);

    node.left = this.buildTree(array.slice(0, mid));
    node.right = this.buildTree(array.slice(mid + 1));

    return node;
  }

  insert(value, root = this.root) {
    if (root === null) return new Node(value);
    if (value === root.data) return root;

    if (value < root.data) {
      root.left = this.insert(value, root.left);
    } else {
      root.right = this.insert(value, root.right);
    }
    return root;
  }

  deleteItem(value, root = this.root) {
    if (root === null) return root;

    if (value < root.data) {
      root.left = this.deleteItem(value, root.left);
    } else if (value > root.data) {
      root.right = this.deleteItem(value, root.right);
    } else {
      // Case 1 & 2: Leaf or one child
      if (root.left === null) return root.right;
      if (root.right === null) return root.left;

      // Case 3: Two children
      const minRight = this.getMin(root.right);
      root.data = minRight.data;
      root.right = this.deleteItem(minRight.data, root.right);
    }
    return root;
  }

  getMin(node) {
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
  }

  includes(value, root = this.root) {
    if (root === null) return false;
    if (root.data === value) return true;

    return value < root.data
      ? this.includes(value, root.left)
      : this.includes(value, root.right);
  }

  // Breadth-First Search
  levelOrderForEach(callback) {
    if (!callback) throw new Error("Callback is required");
    const queue = [this.root];
    while (queue.length > 0) {
      const current = queue.shift();
      callback(current.data);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  // Depth-First Search (Inorder, Preorder, Postorder)
  inOrderForEach(callback, node = this.root) {
    if (!callback) throw new Error("Callback is required");
    if (node === null) return;
    this.inOrderForEach(callback, node.left);
    callback(node.data);
    this.inOrderForEach(callback, node.right);
  }

  preOrderForEach(callback, node = this.root) {
    if (!callback) throw new Error("Callback is required");
    if (node === null) return;
    callback(node.data);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);
  }

  postOrderForEach(callback, node = this.root) {
    if (!callback) throw new Error("Callback is required");
    if (node === null) return;
    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node.data);
  }

  height(value) {
    const node = this.find(value);
    if (!node) return undefined;

    const getHeight = (n) => {
      if (n === null) return -1;
      return Math.max(getHeight(n.left), getHeight(n.right)) + 1;
    };
    return getHeight(node);
  }

  depth(value) {
    let count = 0;
    let current = this.root;
    while (current !== null) {
      if (current.data === value) return count;
      current = value < current.data ? current.left : current.right;
      count++;
    }
    return undefined;
  }

  find(value, node = this.root) {
    if (node === null || node.data === value) return node;
    return value < node.data ? this.find(value, node.left) : this.find(value, node.right);
  }

  isBalanced(node = this.root) {
    if (node === null) return true;
    const diff = Math.abs(this.getHeight(node.left) - this.getHeight(node.right));
    return diff <= 1 && this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  getHeight(node) {
    if (node === null) return -1;
    return Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  rebalance() {
    const nodes = [];
    this.inOrderForEach((data) => nodes.push(data));
    this.root = this.buildTree(nodes);
  }
}