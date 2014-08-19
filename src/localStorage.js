var EventEmitter = require('wolfy87-eventemitter');

var localStorage = function(namespace){
  this.namespace = namespace;
  localStorage.instances.push(this);
};

localStorage.instances = [];
localStorage.enabled = !!window.localStorage;
localStorage.storage = window.localStorage;

module.exports = localStorage;

if(localStorage.enabled) {
  var privateBrowse = false;

  try {
    window.localStorage.setItem('checkPrivateBrowse', '');
  } catch(e) {
    privateBrowse = true;
  };

  if(privateBrowse) {
    localStorage.enabled = false;
  } else {
    window.localStorage.removeItem('checkPrivateBrowse');
  };
};

if(!localStorage.enabled) { return; };

localStorage.prototype = new EventEmitter();

localStorage.prototype.getKeyPathByKey = function(key) {
  return this.namespace + "/" + key;
};

localStorage.prototype.getKeyByKeyPath = function(keyPath) {
  var regexp = this.namespaceRegExp();

  if(regexp.test(keyPath)) {
    return keyPath.replace(regexp, '');
  };

  return false;
};

localStorage.prototype.namespaceRegExp = function() {
  var escapedNamespace = this.namespace.replace(/\W/, "\\$&");
  return new RegExp('^' + escapedNamespace + '/');
};

localStorage.prototype.set = function(key, val) {
  var old = this.get(key);
  var keyPath = this.getKeyPathByKey(key);

  localStorage.storage.setItem(keyPath, JSON.stringify(val));

  if(!old) { this.emit('add', key, val); };
  this.emit('change', key, val, old);

  return val;
};

localStorage.prototype.get = function(key) {
  key = this.getKeyPathByKey(key);

  var val = localStorage.storage.getItem(key);

  if(typeof val !== 'string') { return val };

  return JSON.parse(val);
};

localStorage.prototype.del = function() {
  var keys = arguments, len = keys.length, i = 0, key, keyPath, val;
  while(i < len) {
    key = keys[i];

    val = this.get(key);
    keyPath = this.getKeyPathByKey(key);
    localStorage.storage.removeItem(keyPath);
    this.emit('del', key);
    this.emit('change', key, null, val);

    i++;
  };
};

localStorage.prototype.keys = function() {
  var regexp = this.namespaceRegExp();

  var i = 0, len = localStorage.storage.length, keys = [], keyPath, key;

  while(i < len) {
    keyPath = localStorage.storage.key(i);

    if(key = this.getKeyByKeyPath(keyPath)) {
      keys.push(key);
    };

    i++;
  };

  return keys;
};

localStorage.prototype.clear = function() {
  this.del.call(this, this.keys());
};

var storageEventCallback = function(event) {
  console.log(event.key);
  var keyPath = event.key;
  var eventType = 'change';
  var oldVal = null, newVal = null;

  if(!event.newValue) {
    eventType = 'del';
  } else {
    newVal = JSON.parse(event.newValue)
  };

  if(!event.oldValue) {
    eventType = 'add';
  } else {
    oldVal = JSON.parse(event.oldValue)
  };

  var i = 0, l = localStorage.instances.length, instance, key;

  while(i < l) {
    instance = localStorage.instances[i];
    key = instance.getKeyByKeyPath(keyPath);

    if(key) {
      if(eventType !== 'change') {
        instance.emit(eventType, key, newVal, oldVal);
      };
      instance.emit('change', key, newVal, oldVal);
    };

    i++;
  };
};

if(window['addEventListener']) {
  window.addEventListener('storage', storageEventCallback, false);
} else {
  document.body.attachEvent('onstorage', storageEventCallback);
};
