// src/setupProxy.js
// This file disables caching during development
module.exports = function(app) {
  app.use((req, res, next) => {
    // Disable caching and ETags
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.removeHeader('ETag');
    next();
  });
};
