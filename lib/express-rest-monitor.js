/**
 * Middleware-generating function.
 *
 * @returns {expressRestMonitor}
 */
function expressRestMonitor() {
  let routeLayersCache;  /* Cache for route stack. */

  function expressRestMonitor(req, res, next) {
    const resProto = Object.getPrototypeOf(res.app.response);
    const originalJson = resProto.json;

    routeLayersCache = routeLayersCache || getRouteLayers(res.app);

    /* Handle requests s.t. corresponding route does not exists. */
    if (!routeExists(req, routeLayersCache)) {
      res.send('No such route exists!');
      return;
    }

    /* Override res.__proto__.json(). */
    resProto.json = body => {
      /* Return json with appropriate form. */
      res.format({
        json() {
          originalJson.call(res, body);
        },
        html() {
          res.end('<h1>html!</h1>');
        },
        default() {
          originalJson.call(res, body);
        },
      });

      /* Rollback res.__proto__.json() for next request. */
      resProto.json = originalJson;
    };

    next();
  }

  return expressRestMonitor;
}


/**
 * Get only Layers with Route object from app._router.stack.
 *
 * @param app
 * @returns {Array.<Layer>}
 */
function getRouteLayers(app) {
  return app._router.stack.filter(layer => layer.route);
}


/**
 * Check if Layer with matching Route exists for req.
 *
 * @param req
 * @param routeLayers
 * @returns {boolean}
 */
function routeExists(req, routeLayers) {
  return routeLayers.some(routeLayer => routeLayer.match(req.path));
}


module.exports = expressRestMonitor;
