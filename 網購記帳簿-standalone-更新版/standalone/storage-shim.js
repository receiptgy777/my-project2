/* ------------------------------------------------------------------ */
/*  window.storage 模擬層：把 Claude 版本用的 storage API 接到          */
/*  瀏覽器的 localStorage，讓大部分程式邏輯完全不用改。                  */
/* ------------------------------------------------------------------ */
(function () {
  var PREFIX = "ledgerstore:";
  window.storage = {
    get: function (key, shared) {
      return new Promise(function (resolve, reject) {
        try {
          var raw = localStorage.getItem(PREFIX + key);
          if (raw === null) {
            reject(new Error("key not found: " + key));
            return;
          }
          resolve({ key: key, value: raw, shared: !!shared });
        } catch (e) {
          reject(e);
        }
      });
    },
    set: function (key, value, shared) {
      return new Promise(function (resolve, reject) {
        try {
          localStorage.setItem(PREFIX + key, value);
          resolve({ key: key, value: value, shared: !!shared });
        } catch (e) {
          reject(e);
        }
      });
    },
    delete: function (key, shared) {
      return new Promise(function (resolve) {
        localStorage.removeItem(PREFIX + key);
        resolve({ key: key, deleted: true, shared: !!shared });
      });
    },
    list: function (prefix, shared) {
      return new Promise(function (resolve) {
        var p = PREFIX + (prefix || "");
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(p) === 0) keys.push(k.slice(PREFIX.length));
        }
        resolve({ keys: keys, prefix: prefix, shared: !!shared });
      });
    },
  };
})();
