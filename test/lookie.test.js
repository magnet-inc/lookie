var Lookie = require('../src/lookie');
var cookies = require('cookies-js');
var ns = 'namespace';

var tests = function(storage) {
  return function() {
    beforeEach(function() {
      switch(storage) {
        case "localStorage":
          Lookie.LocalStorage.enabled = true;
          Lookie.Cookie.enabled = true;
          Lookie.InMemory.enabled = true;
          break;
        case "cookie":
          Lookie.LocalStorage.enabled = false;
          Lookie.Cookie.enabled = true;
          Lookie.InMemory.enabled = true;
          break;
        case "inMemory":
          Lookie.LocalStorage.enabled = false;
          Lookie.Cookie.enabled = false;
          Lookie.InMemory.enabled = true;
          break;
        default:
          Lookie.LocalStorage.enabled = true;
          Lookie.Cookie.enabled = true;
          Lookie.InMemory.enabled = true;
          break;
      }

      if(!!window['localStorage']) { localStorage.clear(); }
      cookies.expire('namespace.lookie', { path: '/' });
      cookies.expire('namespace.another.lookie', { path: '/' });
    });

    describe('#set and #get', function() {
      it('should be set value', function() {
        var instance = new Lookie(ns);

        // string
        instance.set('string', 'string');
        expect(instance.get('string')).toEqual('string');
        // number
        instance.set('number', 1);
        expect(instance.get('number')).toEqual(1);
        // array
        instance.set('array', [1,2,3]);
        expect(instance.get('array').length).toEqual(3);
        // object
        instance.set('object', {foo: 1, bar: 2});
        expect(instance.get('object').foo).toBeDefined();
        expect(instance.get('object').bar).toBeDefined();
        expect(instance.get('object').foo).toEqual(1);
        // undefined
        expect(instance.get('null')).not.toBeTruthy();
      });

      it('should fire the add event', function() {
        var done = false;
        var instance = new Lookie(ns);

        runs(function() {
          instance.once('add', function(key, val) {
            expect(key).toEqual('foo');
            expect(val).toEqual(1);
            done = true;
          });
          instance.set('foo', 1);
        });

        waitsFor(function() {
          return done;
        });
      });

      it('should fire the change event', function() {
        var done = false;
        var waitForSync = false;
        var instance = new Lookie(ns);

        runs(function() {
          instance.set('foo', 1);
          setTimeout(function() {
            waitForSync = true;
          }, 100);
        });

        waitsFor(function() {
          return waitForSync;
        });

        runs(function() {
          instance.once('change', function(key, val, old) {
            expect(key).toEqual('foo');
            expect(val).toEqual(2);
            expect(old).toEqual(1);
            done = true;
          });
          instance.set('foo', 2);
        });

        waitsFor(function() {
          return done;
        });
      });
    });

    describe('#del', function() {
      it('should delete keys', function() {
        var instance = new Lookie(ns);

        instance.set('foo', 1);
        instance.set('bar', 1);
        instance.del('foo', 'bar');
        expect(instance.get('foo')).not.toBeTruthy();
        expect(instance.get('bar')).not.toBeTruthy();
      });

      it('should fire the del event', function() {
        var done = false;
        var waitForSync = false;
        var instance = new Lookie(ns);

        runs(function() {
          instance.set('foo', 1);
          setTimeout(function() {
            waitForSync = true;
          }, 100);
        });

        waitsFor(function() {
          return waitForSync;
        });

        runs(function() {
          instance.once('del', function(key) {
            expect(key).toEqual('foo');
            done = true;
          });
          instance.del('foo');
        });

        waitsFor(function() {
          return done;
        });
      });
    });

    describe('#keys', function() {
      it('should return all keys', function() {
        var instance = new Lookie(ns);

        var anotherNS = new Lookie(ns + '.another');
        anotherNS.set('foo', 1);
        instance.set('bar', 2);
        instance.set('baz', 3);

        expect(instance.keys().length).toEqual(2);
      });
    });

    describe('#clear', function() {
      it('should clear storage', function() {
        var instance = new Lookie(ns);

        var anotherNS = new Lookie(ns + '.another');
        anotherNS.set('foo', 1);
        instance.set('bar', 2);
        instance.clear();

        expect(instance.keys().length).toEqual(0);
        expect(anotherNS.get('foo')).toEqual(1);
      });
    });
  };
};

describe('Lookie', function() {
  describe('default', tests());
  describe('LocalStorage', tests('LocalStorage'));
  describe('Cookie', tests('Cookie'));
  describe('InMemory', tests('InMemory'));
});
