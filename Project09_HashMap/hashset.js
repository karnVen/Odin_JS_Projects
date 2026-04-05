import HashMap from './hashmap.js';

export class HashSet extends HashMap {
  set(key) {
    // HashSet doesn't need values, we just use the key
    super.set(key, null); 
  }
  
  // Overriding to return just keys for entries
  entries() {
    return this.keys();
  }
}