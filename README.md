# Proxyman

Proxyman is an easy-to-use tool for setting up a quick reverse proxy in local deployments.

## The Problem

In many modern applications, the API server and the UI server live on separate ports. In production, they would typically run together through Nginx. If you want to run it during deployment, however, you would need to perform all sorts of CORS workarounds along with handle cross-site cookies and what not. Wouldn't it be easier to have a quick and dirty reverse proxy setup that is as easy as running one command?

## The Solution

Proxyman is just that. It allows you to define a quick development reverse proxy. Here are some examples. In all of these, the proxy server itself is running on port `5000` as the first arg passed.

**Example 1:** Map all requests to `/` to `localhost:8000` and all requests to `/ui` to `localhost:5173`.

```
proxyman 5000 /:8000 /ui:5173
```

Running them locally
