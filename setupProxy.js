const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5001",
      changeOrigin: true,
      on: {
        error: (err, req, res) => {
          console.log("Proxy error:", err);
        },
      },
    })
  );
};