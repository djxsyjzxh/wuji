// 物记 Service Worker：离线可用 + 安装到桌面
var CACHE = "wuji-v12-brand-display";
var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./config.js",
  "./auth.js",
  "./libs/pinyin-pro.min.js",
  "./libs/xlsx.full.min.js",
  "./libs/zxing.min.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(function (c) {
        return c.addAll(ASSETS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.indexOf("/api/") === 0) return;
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) {
            c.put("./index.html", copy);
          });
          return res;
        })
        .catch(function () {
          return caches.match("./index.html");
        })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      var net = fetch(e.request)
        .then(function (res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) {
              c.put(e.request, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return cached;
        });
      return cached || net;
    })
  );
});
