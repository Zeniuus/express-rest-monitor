function expressRestMonitor(req, res, next) {
  const resProto = Object.getPrototypeOf(res.app.response);
  const originalJson = resProto.json;

  resProto.json = body => {
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

    resProto.json = originalJson;
  };

  next();
}


module.exports = expressRestMonitor;
