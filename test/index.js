
var Router = require('..');
var assert = require('better-assert');

describe('Router#get(path)', function(){
  it('should return a route', function(){
    var router = new Router;
    var route = router.get('/something');
    assert('Route' == route.constructor.name);
  })
})

describe('Router#dispatch(path)', function(){
  it('should invoke all matching routes', function(done){
    var router = new Router;

    router.get('/user', function(){
      assert(false && 'should not be invoked');
    });

    router.get('/user/:id/:page', function(id, page){
      assert('5' == id);
      assert('posts' == page);
    });

    router.get('/user/:id/:page', function(id, page){
      assert('5' == id);
      assert('posts' == page);
      done()
    });

    router.dispatch('/user/5/posts');
  });

  it('should work with search (?) ', function(done){
    var router = new Router;

    router.get('/user', function(){
      assert(false && 'should not be invoked');
    });

    router.get('/user/:id/:page', function(id, page){
      assert('5' == id);
      assert('posts' == page);
    });

    router.get('/user/:id/:page', function(id, page){
      assert('5' == id);
      assert('posts' == page);
      done()
    });

    router.dispatch('/user/5/posts?foo=bar');
  });

  it('should work with hash (#) ', function(done){
    var router = new Router;

    router.get('/user', function(){
      assert(false && 'should not be invoked');
    });

    router.get('/user/:id/:page', function(id, page){
      assert('5' == id);
      assert('posts' == page);
    });

    router.get('/user/:id/:page', function(id, page){
      assert('5' == id);
      assert('posts' == page);
      done()
    });

    router.dispatch('/user/5/posts#foo=bar');
  });
  it('should work with search (?) and hash (#) ', function(done){
    var router = new Router;

    router.get('/user', function(){
      assert(false && 'should not be invoked');
    });

    router.get('/user/:id/:page', function(id, page){
      assert('5' == id);
      assert('posts' == page);
    });

    router.get('/user/:id/:page', function(id, page){
      assert('5' == id);
      assert('posts' == page);
      done()
    });

    router.dispatch('/user/5/posts?baz=buz#foo=bar');
  });
})
