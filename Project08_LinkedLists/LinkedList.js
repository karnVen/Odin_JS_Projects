import { Node } from './Node.js';

export class LinkedList {
  constructor() {
    this.listHead = null;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.listHead) {
      this.listHead = newNode;
      return;
    }
    let tmp = this.listHead;
    while (tmp.nextNode !== null) tmp = tmp.nextNode;
    tmp.nextNode = newNode;
  }

  prepend(value) {
    this.listHead = new Node(value, this.listHead);
  }

  size() {
    let count = 0;
    let tmp = this.listHead;
    while (tmp !== null) {
      count++;
      tmp = tmp.nextNode;
    }
    return count;
  }

  head() {
    return this.listHead?.value;
  }

  tail() {
    if (!this.listHead) return undefined;
    let tmp = this.listHead;
    while (tmp.nextNode !== null) tmp = tmp.nextNode;
    return tmp.value;
  }

  at(index) {
    if (index < 0) return undefined;
    let tmp = this.listHead;
    for (let i = 0; i < index; i++) {
      if (!tmp) return undefined;
      tmp = tmp.nextNode;
    }
    return tmp ? tmp.value : undefined;
  }

  pop() {
    if (!this.listHead) return undefined;
    const val = this.listHead.value;
    this.listHead = this.listHead.nextNode;
    return val;
  }

  contains(value) {
    let tmp = this.listHead;
    while (tmp !== null) {
      if (tmp.value === value) return true;
      tmp = tmp.nextNode;
    }
    return false;
  }

  findIndex(value) {
    let index = 0;
    let tmp = this.listHead;
    while (tmp !== null) {
      if (tmp.value === value) return index;
      tmp = tmp.nextNode;
      index++;
    }
    return -1;
  }

  toString() {
    if (!this.listHead) return "";
    let result = "";
    let tmp = this.listHead;
    while (tmp !== null) {
      result += `( ${tmp.value} ) -> `;
      tmp = tmp.nextNode;
    }
    return result + "null";
  }

  // Extra Credit: Insert at specific index
  insertAt(index, ...values) {
    const listSize = this.size();
    if (index < 0 || index > listSize) throw new RangeError("Index out of bounds");

    if (index === 0) {
      values.reverse().forEach(val => this.prepend(val));
      return;
    }

    let prev = this.listHead;
    for (let i = 0; i < index - 1; i++) {
      prev = prev.nextNode;
    }

    let rest = prev.nextNode;
    values.forEach(val => {
      const newNode = new Node(val);
      prev.nextNode = newNode;
      prev = newNode;
    });
    prev.nextNode = rest;
  }

  // Extra Credit: Remove at specific index
  removeAt(index) {
    const listSize = this.size();
    if (index < 0 || index >= listSize) throw new RangeError("Index out of bounds");

    if (index === 0) {
      this.listHead = this.listHead.nextNode;
      return;
    }

    let prev = this.listHead;
    for (let i = 0; i < index - 1; i++) {
      prev = prev.nextNode;
    }
    prev.nextNode = prev.nextNode.nextNode;
  }
}