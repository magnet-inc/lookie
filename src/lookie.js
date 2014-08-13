var Lookie = function(namespace) {
  require('event-emitter')(this);

  this.namespace = namespace;
};

// Get the value of a key
Lookie.prototype.get = function(key) {
};

// Set the value of a key
Lookie.prototype.set = function(key, val) {
};

// Delete a key
Lookie.prototype.del = function(key) {
};

// Determine if a key exists
Lookie.prototype.exists = function(key) {
};

// Find all keys matching the given pattern
Lookie.prototype.keys = function(pattern) {
};

// Remove all keys from storage
Lookie.prototype.clear = function() {
};

module.exports = Lookie;

if(typeof window.define === 'function') {
  define(function() { return Lookie; });
} else {
  window.Lookie = Lookie;
};
