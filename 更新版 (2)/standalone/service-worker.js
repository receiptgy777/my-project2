const CACHE_NAME = "ledger-cache-v2";
const CORE_ASSETS = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 網頁本體改成「網路優先」：有網路時一律抓最新版本並更新快取；
// 只有離線抓不到網路時，才退回使用快取，確保部署新版後手機能立刻看到更新。
self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const isCoreAsset = CORE_ASSETS.some((asset) => url.endsWith(asset.replace("./", "")));
  if (!isCoreAsset) return; // 其他請求（CDN、API）交給瀏覽器正常處理

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
