var EventEmitter = require('wolfy87-eventemitter');

var inMemory = function(namespace) {
  this.namespace = namespace;
  this.storage = {};
};
inMemory.prototype = new EventEmitter();

inMemory.enabled = true;

module.exports = inMemory;

inMemory.prototype.set = function(key, val) {
  var old = this.storage[key];
  this.storage[key] = val;
  this.emit('add', key, val, old);
  this.emit('change', key, val, old);
};

inMemory.prototype.get = function(key) {
  return this.storage[key];
};

inMemory.prototype.del = function(key) {
  var storage = this.getStorage();
  var keys = arguments, len = keys.length, i = 0, key, old, val;
  while(i < len) {
    key = keys[i];

    old = this.storage[key];
    val = old;
    delete this.storage[key];
    this.emit('del', key, val, old);
    this.emit('change', key, val, old);

    i++;
  };
}

inMemory.prototype.keys = function() {
  var storage = this.getStorage();
  var keys = [], key;

  for(key in this.storage) {
    keys.push(key);
  };

  return keys;
};

inMemory.prototype.clear = function() {
  var oldKeys = this.keys();
  this.storage = {};
  var len = oldKeys.length, i = 0;
  while(i < len) {
    this.emit('del', oldKeys[i], null, null);
    this.emit('change', oldKeys[i], null, null);
    i++;
  }
};
