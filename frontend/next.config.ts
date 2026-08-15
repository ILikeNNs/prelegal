import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Without this, `next export` writes each route as a flat `<route>.html`
  // file next to a same-named directory of RSC metadata (no index.html
  // inside it) - the backend's StaticFiles(html=True) mount can serve
  // directory/index.html but never tries appending ".html" to a bare path,
  // so every route but "/" 404s in production. This makes each route export
  // as `<route>/index.html` instead, which StaticFiles resolves correctly.
  trailingSlash: true,
};

export default nextConfig;
