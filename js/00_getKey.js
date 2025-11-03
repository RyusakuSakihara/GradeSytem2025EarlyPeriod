// getApiKey を localStorage に期限付きでキャッシュする実装
// デフォルト TTL: 12時間（ミリ秒）
const __APIKEY_CACHE_KEY = "__apiKey_cache_v1";
const __APIKEY_CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12時間
const __APIKEY_URL =
  "https://script.google.com/macros/s/AKfycbzh9JF744LUsOAcBISi7a3kO_aDcsLwSGCmeXFNKHlonRwnF1ADhGt0e-sksCujE3Zy/exec";

async function getApiKey(options = {}) {
  // options.ttlMs を指定するとデフォルト TTL を上書きできます
  const ttlMs =
    typeof options.ttlMs === "number" ? options.ttlMs : __APIKEY_CACHE_TTL_MS;

  // 1) ローカルキャッシュを確認
  try {
    const raw = localStorage.getItem(__APIKEY_CACHE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          parsed.apiKey &&
          parsed.expires &&
          Date.now() < parsed.expires
        ) {
          console.log("getApiKey: from cache");
          return parsed.apiKey;
        }
      } catch (e) {
        // 解析に失敗したらキャッシュを破棄して続行
        console.warn("getApiKey: cache parse error, ignoring cache", e);
        localStorage.removeItem(__APIKEY_CACHE_KEY);
      }
    }
  } catch (e) {
    // localStorage が利用できない（プライベートモード等）の場合は無視して fetch に行く
    console.warn("getApiKey: localStorage unavailable, proceeding to fetch", e);
  }

  // 2) fetch で取得
  const response = await fetch(__APIKEY_URL);
  const data = await response.json();
  const apiKey = data.apiKey;
  console.log("getApiKey: fetched", apiKey);

  // 3) キャッシュへ保存（失敗しても無視）
  try {
    const expires = Date.now() + ttlMs;
    localStorage.setItem(
      __APIKEY_CACHE_KEY,
      JSON.stringify({ apiKey, expires })
    );
  } catch (e) {
    console.warn("getApiKey: failed to write cache", e);
  }

  return apiKey;
}

// キャッシュを明示的にクリアするユーティリティ
function clearApiKeyCache() {
  try {
    localStorage.removeItem(__APIKEY_CACHE_KEY);
    console.log("getApiKey: cache cleared");
  } catch (e) {
    console.warn("getApiKey: failed to clear cache", e);
  }
}

// グローバルに expose（既存コードが直接呼ぶ前提のため）
window.clearApiKeyCache = clearApiKeyCache;
