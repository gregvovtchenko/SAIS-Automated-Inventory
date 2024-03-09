const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for backend server
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3002',
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
      target: 'http://172.20.10.3:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/arduino': ''
      }
    })
  );

  app.use(
    '/arduino-weight',
    createProxyMiddleware({
      target: 'http://172.20.10.3:3003',
      changeOrigin: true,
      pathRewrite: {
        '^/arduino-weight': ''
      }
    })
  )
};
