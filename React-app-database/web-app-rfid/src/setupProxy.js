const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for backend server
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://172.20.10.2:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  );


  // Proxy for Arduino server
  app.use(
    '/arduino',
    createProxyMiddleware({
      target: 'http://172.20.10.9:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/arduino': ''
      }
    })
  );
};
