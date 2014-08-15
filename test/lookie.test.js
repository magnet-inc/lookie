var Lookie = require('../src/lookie');
var cookies = require('cookies-js');
var ns = 'namespace';
var expect = require('expect.js');

describe('Lookie', function() {
  beforeEach(function() {
    if(!!window['localStorage']) { localStorage.clear(); }
    cookies.expire('namespace.lookie', { path: '/' });
    cookies.expire('namespace.another.lookie', { path: '/' });
  });

  describe('#set and #get', function() {
    it('should be set value', function() {
      var instance = new Lookie(ns);

      // string
      instance.set('string', 'string');
      expect(instance.get('string')).to.equal('string');
      // number
      instance.set('number', 1);
      expect(instance.get('number')).to.equal(1);
      // array
      instance.set('array', [1,2,3]);
      expect(instance.get('array')).to.be.a('array');
      expect(instance.get('array')).to.have.length(3);
      // object
      instance.set('object', {foo: 1, bar: 2});
      expect(instance.get('object')).to.have.property('foo');
      expect(instance.get('object')).to.have.property('bar');
      expect(instance.get('object').foo).to.equal(1);
      // undefined
      expect(instance.get('null')).to.eql(null);
    });

    it('should fire the add event', function(done) {
      var instance = new Lookie(ns);

      instance.once('add', function(key, val) {
        expect(key).to.equal('foo');
        expect(val).to.equal(1);
        done();
      });
      instance.set('foo', 1);
    });

    it('should fire the change event', function(done) {
      var instance = new Lookie(ns);

      instance.set('foo', 1);
      instance.once('change', function(key, val, old) {
        expect(key).to.equal('foo');
        expect(val).to.equal(2);
        expect(old).to.equal(1);
        done();
      });
      instance.set('foo', 2);
    });
  });

  describe('#del', function() {
    it('should delete keys', function() {
      var instance = new Lookie(ns);

      instance.set('foo', 1);
      instance.set('bar', 1);
      instance.del('foo', 'bar');
      expect(instance.get('foo')).to.equal(null);
      expect(instance.get('bar')).to.equal(null);
    });

    it('should fire the del event', function(done) {
      var instance = new Lookie(ns);

      instance.set('foo', 1);
      instance.once('del', function(key) {
        expect(key).to.equal('foo');
        done();
      });
      instance.del('foo');
    });
  });

  describe('#keys', function() {
    it('should return all keys', function() {
      var instance = new Lookie(ns);

      var anotherNS = new Lookie(ns + '.another');
      anotherNS.set('foo', 1);
      instance.set('bar', 2);
      instance.set('baz', 3);

      expect(instance.keys()).to.have.length(2);
    });
  });

  describe('#clear', function() {
    it('should clear storage', function() {
      var instance = new Lookie(ns);

      var anotherNS = new Lookie(ns + '.another');
      anotherNS.set('foo', 1);
      instance.set('bar', 2);
      instance.clear();

      expect(instance.keys()).to.have.length(0);
      expect(anotherNS.get('foo')).to.equal(1);
    });
  });
});

