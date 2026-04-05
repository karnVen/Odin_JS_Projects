export default class HashMap {
  constructor(initialCapacity = 16, loadFactor = 0.75) {
    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      // Modulo inside the loop to prevent integer overflow
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }

  set(key, value) {
    // Check if we need to grow the map
    if (this.size / this.capacity >= this.loadFactor) {
      this._grow();
    }

    const index = this.hash(key);
    const bucket = this.buckets[index];

    // Check if key exists to overwrite
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    // Otherwise add new entry
    bucket.push([key, value]);
    this.size++;
  }

  _grow() {
    const currentEntries = this.entries();
    this.capacity *= 2;
    this.size = 0; // Reset size and re-set items
    this.buckets = new Array(this.capacity).fill(null).map(() => []);

    currentEntries.forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    for (let pair of bucket) {
      if (pair[0] === key) return pair[1];
    }
    return null;
  }

  has(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    return bucket.some((pair) => pair[0] === key);
  }

  remove(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }

  length() {
    return this.size;
  }

  clear() {
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0;
  }

  keys() {
    return this.entries().map((pair) => pair[0]);
  }

  values() {
    return this.entries().map((pair) => pair[1]);
  }

  entries() {
    const allEntries = [];
    this.buckets.forEach((bucket) => {
      bucket.forEach((pair) => {
        allEntries.push(pair);
      });
    });
    return allEntries;
  }
}