/**
 * Middleware-generating function.
 *
 * Returned expressRestMonitor will override
 * res.__proto__.json for every requests so that
 * correct res can be bound to originalResJson
 * in every overridden res.__proto__.json.
 *
 * @returns {expressRestMonitor}
 */
function expressRestMonitor() {
  let routeLayersCache;  /* Cache for route stack. */
  let originalResJson;


  function expressRestMonitor(req, res, next) {
    const resProto = Object.getPrototypeOf(res.app.response);

    routeLayersCache = routeLayersCache || getRouteLayers(res.app);
    originalResJson = originalResJson || resProto.json;

    /* Handle requests s.t. corresponding route does not exists. */
    if (!routeExists(req, routeLayersCache)) {
      if (!acceptHTMLFirst(req)) return next();
      res.status(404).end('No such router! Possible routers list:');
      return;
    }

    /* Override res.__proto__.json(). */
    resProto.json = body => {
      /* Return json with appropriate form. */
      res.format({
        json() {
          originalResJson.call(res, body);
        },
        html() {
          res.render('rest-monitor.ejs', {
            response: JSON.stringify(body),
          });
        },
        default() {
          originalResJson.call(res, body);
        },
      });
    };

    next();
  }

  return expressRestMonitor;
}


/**
 * Check if html is the most acceptable type of response for a request.
 *
 * @param req
 * @returns {boolean}
 */
function acceptHTMLFirst(req) {
  return /.+\/html/.test(req.get('accept').split(',')[0]);
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
