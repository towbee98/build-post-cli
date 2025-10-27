
const store = new Map();

module.exports = class Conf {
  constructor() {}
  get(key) {
    if (key === 'apiKeys') {
      return store.get(key) || {};
    }
    return store.get(key);
  }
  set(key, value) {
    store.set(key, value);
  }
  clear() {
    store.clear();
  }
  get store() {
    return store;
  }
};
