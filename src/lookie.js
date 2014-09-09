var EventEmitter = require('wolfy87-eventemitter');

var Lookie = function(namespace) {
  this.namespace = namespace;

  if(Lookie.LocalStorage.enabled) {
    this.storage = new Lookie.LocalStorage(this.namespace);
  } else if(Lookie.Cookie.enabled) {
    this.storage = new Lookie.Cookie(this.namespace);
  } else {
    this.storage = new Lookie.Cookie(this.namespace);
  };

  var self = this;
  var pipeEvents = ['add', 'del', 'change'];
  var i = 0; l = pipeEvents.length;

  while(i < l) {
    (function(ev) {
      self.storage.on(ev, function(key, nv, ov) {
        self.emit(ev, key, nv, ov);
      });
    })(pipeEvents[i]);
    i++;
  };
};

Lookie.LocalStorage = require('./localStorage');
Lookie.Cookie = require('./cookie');

Lookie.prototype = new EventEmitter();

// Get the value of a key
Lookie.prototype.get = function(key) {
  return this.storage.get(key);
};

// Set the value of a key
Lookie.prototype.set = function(key, val) {
  return this.storage.set(key, val);
};

// Delete keys
Lookie.prototype.del = function() {
  return this.storage.del.apply(this.storage, arguments);
};

// Determine if a key exists
Lookie.prototype.exists = function(key) {
  var val = this.get(key);

  return !!val;
};

// Find all keys matching the given pattern
Lookie.prototype.keys = function(pattern) {
  var keys = this.storage.keys();
  var matchedKeys = [];

  if(!pattern) { pattern = '*'; };
  var matcher = new RegExp(pattern.replace(/\W/, "\\$&").replace("\\*", '.*'));

  var i = 0, l = keys.length, k;
  while(i < l) {
    k = keys[i];

    if(matcher.test(k)) {
      matchedKeys.push(k);
    };

    i++;
  };

  return matchedKeys;
};

// Remove all keys from storage
Lookie.prototype.clear = function() {
  return this.storage.clear();
};

module.exports = Lookie;

if(typeof window.define === 'function') {
  define(function() { return Lookie; });
} else {
  window.Lookie = Lookie;
};
