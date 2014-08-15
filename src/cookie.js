var EventEmitter = require('wolfy87-eventemitter');

var Cookie = require('cookies-js');
var expires = 10 * 365 * 24 * 60 * 60;

var diffObject = function(lhs, rhs) {
  var diffs = [], d, key;

  for(key in lhs) {
    if(JSON.stringify(rhs[key]) != JSON.stringify(lhs[key])) {
      d = {
        key: key,
        oldValue: lhs[key],
        newValue: rhs[key]
      };

      if(rhs[key]) { d.type = 'change'; } else { d.type = 'del' };

      diffs.push(d);
    }
  };

  for(key in rhs) {
    if(!lhs[key]) {
      diffs.push({
        key: key,
        oldValue: null,
        newValue: rhs[key],
        type: 'add'
      });
    };
  };

  return diffs;
};

var cookie = function(namespace) {
  this.namespace = namespace;
  this.cookieName = this.namespace + '.lookie';

  var oldStorage = this.getStorage(), me = this;
  setInterval(function() {
    var diffs = diffObject(oldStorage, me.getStorage());

    if(diffs.length > 0) {
      var i = 0, l = diffs.length, diff;

      while(i < l) {
        diff = diffs[i];

        me.emit(diff.type, diff.key, diff.newValue, diff.oldValue);
        if(diff.type !== 'change') {
          me.emit('change', diff.key, diff.newValue, diff.oldValue);
        };

        i++;
      };

      oldStorage = me.getStorage();
    };
  }, 1000 / 30);
};

cookie.enabled = Cookie.enabled;

module.exports = cookie;

if(!cookie.enabled) { return; };

cookie.prototype = new EventEmitter();

cookie.prototype.getStorage = function() {
  var storage = Cookie.get(this.cookieName);
  try { storage = JSON.parse(storage); } catch(e) { storage = {} };
  return storage;
};

cookie.prototype.saveStorage = function(storage) {
  Cookie.set(
    this.cookieName, JSON.stringify(storage),
    { path: '/', expires: expires }
  );
};

cookie.prototype.set = function(key, val) {
  var storage = this.getStorage();
  var old = storage[key];
  storage[key] = val;
  this.saveStorage(storage);
};

cookie.prototype.get = function(key) {
  var storage = this.getStorage();
  var val = storage[key];

  if(typeof val !== 'string') { return val };

  return JSON.parse(val);
};

cookie.prototype.del = function() {
  var storage = this.getStorage();
  var keys = arguments, len = keys.length, i = 0, key;
  while(i < len) {
    key = keys[i];

    delete storage[key];
    this.saveStorage(storage);

    i++;
  };
};

cookie.prototype.keys = function() {
  var storage = this.getStorage();
  var keys = [], key;

  for(key in storage) {
    keys.push(key);
  };

  return keys;
};

cookie.prototype.clear = function() {
  this.saveStorage({});
};
