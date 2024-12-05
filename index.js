#!/usr/bin/env node

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const args = process.argv.slice(2);
const [host, port] = args[0].split(":");

// Function to configure proxy middleware
function configureProxy(target, fallbackUrls) {
  const nextTarget = fallbackUrls.length >= 1 ? fallbackUrls.shift() : null;
  const nextProxy = nextTarget
    ? configureProxy(nextTarget, fallbackUrls)
    : null;

  return createProxyMiddleware({
    target: target,
    changeOrigin: false,
    logLevel: "debug",
    onProxyRes: function (proxyRes, req, res) {
      let body = [];
      proxyRes.on("data", function (chunk) {
        body.push(chunk);
      });
      proxyRes.on("end", function () {
        body = Buffer.concat(body);
        if (proxyRes.statusCode === 404 && nextProxy) {
          console.log("Falling back to " + nextTarget);
          nextProxy(req, res);
        } else {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          res.end(body);
        }
      });
    },
    selfHandleResponse: true,
  });
}

// Parse and configure routes
args.slice(1).forEach((arg) => {
  const [route, ...ports] = arg.split(":");
  const urls = ports.map((port) => `http://${host}:${port}`);
  const proxyMiddleware = configureProxy(urls[0], urls.slice(1));
  app.use(route, proxyMiddleware);
});

// Start the server
app.listen(port, () => {
  console.log(`Reverse proxy started on port ${port}`);
});
