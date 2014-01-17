/*
 * Heavily taken form components/router
 * removed the `break;` that enable multiple matches for routes
 * */

function pathtoRegexp(path, keys, options) {
  options = options || {};
  var sensitive = options.sensitive;
  var strict = options.strict;
  keys = keys || [];

  if (path instanceof RegExp) return path;
  if (path instanceof Array) path = '(' + path.join('|') + ')';

  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
      keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
        + (optional || '')
        + (star ? '(/*)?' : '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');

  return new RegExp('^' + path + '$', sensitive ? '' : 'i');
};


function Route(path) {
  this.path = path;
  this.keys = [];
  this.regexp = pathtoRegexp(path, this.keys);
  this._callbacks= [];
}

/**
 * Add before `fn`.
 *
 * @param {Function} fn
 * @return {Route} self
 * @api public
 */

Route.prototype.callback= function(fn){
  this._callbacks.push(fn);
  return this;
};

/**
 * Invoke callbacks for `type` with `args`.
 *
 * @param {String} type
 * @param {Array} args
 * @api public
 */

Route.prototype.call = function(args){
  args = args || [];
  var fns = this._callbacks;
  if (!fns) throw new Error('invalid type');
  for (var i = 0; i < fns.length; i++) {
    fns[i].apply(null, args);
  }
};

/**
 * Check if `path` matches this route,
 * returning `false` or an object.
 *
 * @param {String} path
 * @return {Object}
 * @api public
 */

Route.prototype.match = function(path){
  var keys = this.keys;
  var qsIndex = path.indexOf('?');
  var pathname = ~qsIndex ? path.slice(0, qsIndex) : path;
  var m = this.regexp.exec(pathname);
  var params = [];
  var args = [];

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];

    var val = 'string' == typeof m[i]
      ? decodeURIComponent(m[i])
      : m[i];

    if (key) {
      params[key.name] = undefined !== params[key.name]
        ? params[key.name]
        : val;
    } else {
      params.push(val);
    }

    args.push(val);
  }

  params.args = args;
  return params;
};


/**
 * Initialize a new Router.
 *
 * @api public
 */

function Router() {
  this.routes = [];
}

/**
 * Create route `path` with optional `before`
 * and `after` callbacks. If you omit these
 * they may be added later with the `Route` returned.
 *
 *   router.get('/user/:id', showUser, hideUser);
 *
 *   router.get('/user/:id')
 *     .before(showUser)
 *     .after(hideUser)
 *
 * @param {String} path
 * @param {Function} before
 * @param {Function} after
 * @return {Route}
 * @api public
 */

Router.prototype.get = function(path, callback){
  var route = new Route(path);
  this.routes.push(route);
  if (callback) route.callback(callback);
  return route;
};

/**
 * Dispatch the given `path`, matching routes
 * sequentially.
 *
 * @param {String} path
 * @api public
 */

Router.prototype.dispatch = function(path){
  var ret;
  for (var i = 0; i < this.routes.length; i++) {
    var route = this.routes[i];
    if (ret = route.match(path)) {
      this.route = route;
      this.args = ret.args;
      route.call(ret.args);
    }
  }
};

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
  module.exports = Router;
}

