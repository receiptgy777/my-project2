

/* ------------------------------------------------------------------ */
/*  網購記帳簿 — 現代圓潤風格，支援主題／字型自訂與匯入匯出、資料備份       */
/* ------------------------------------------------------------------ */

const DEFAULT_PLATFORMS = ["蝦皮", "MOMO", "PChome", "淘寶"];
const DEFAULT_CATEGORIES = ["服飾", "美妝", "3C", "居家", "飲食", "娛樂", "通訊", "交通", "日用品", "寵物", "運動", "其他"];
const DEFAULT_SHIPPING_METHODS = ["超商取貨", "宅配到府", "黑貓宅急便", "郵局"];
const DEFAULT_CARD_NAMES = [];
const REWARD_TYPES = ["信用卡", "蝦幣", "MO幣", "自訂"];
const PAYMENT_METHODS = ["信用卡", "現金", "其他"];
const DEFAULT_BANKS = [
  "國泰世華", "台北富邦", "玉山銀行", "中國信託", "台新銀行", "花旗銀行", "彰化銀行",
  "第一銀行", "合作金庫", "永豐銀行", "華南銀行", "上海商業儲蓄銀行", "王道銀行", "LINE Bank", "樂天銀行",
];
const DEFAULT_PLATFORM_COLORS = {
  蝦皮: "#EE4D2D",
  MOMO: "#D6006C",
  PChome: "#E4002B",
  淘寶: "#FF6A00",
};
const CATEGORY_PALETTE = [
  "#FF8A65", "#4FC3A1", "#5C9EF5", "#B983E0", "#F2C94C", "#66BB6A",
  "#EF6C9A", "#7986CB", "#A1887F", "#4DD0E1", "#FFB86B", "#90A4AE",
];
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < (s || "").length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
  return h;
}
function colorForPlatform(name, platformColors) {
  if (platformColors && platformColors[name]) return platformColors[name];
  if (DEFAULT_PLATFORM_COLORS[name]) return DEFAULT_PLATFORM_COLORS[name];
  return CATEGORY_PALETTE[hashStr(name) % CATEGORY_PALETTE.length];
}
const DANGER = "#E14F4F";
const MAX_IMAGES = 4;

const BASE_LIGHT = { bg: "#F5F6F8", card: "#FFFFFF", headerBg: "#FFFFFF", text: "#1B1D21", textSoft: "#868D99", border: "#ECEDF1", secondary: "#4FC3A1" };
const BASE_DARK = { bg: "#18191C", card: "#232428", headerBg: "#232428", text: "#F2F1ED", textSoft: "#9A9CA3", border: "#34353B", secondary: "#5FD9B4" };

const DEFAULT_THEMES = [
  { id: "peach", name: "蜜桃橘", colors: { primary: "#F2793A", ...BASE_LIGHT, secondary: "#4FB3C0" } },
  { id: "line-green", name: "經典綠", colors: { primary: "#06C755", ...BASE_LIGHT, secondary: "#F2A93C" } },
  { id: "sky", name: "晴空藍", colors: { primary: "#3E8EF7", ...BASE_LIGHT, secondary: "#F26B9C" } },
  { id: "grape", name: "葡萄紫", colors: { primary: "#8B5CF6", ...BASE_LIGHT, secondary: "#F2C94C" } },
  { id: "charcoal", name: "質感黑（深色）", colors: { primary: "#FFB86B", ...BASE_DARK } },
];

const COLOR_FIELDS = [
  { key: "primary", label: "主色（按鈕／強調）" },
  { key: "secondary", label: "次要色（省下金額標籤等）" },
  { key: "bg", label: "背景色" },
  { key: "card", label: "卡片底色" },
  { key: "headerBg", label: "頂部標題列底色" },
  { key: "text", label: "主要文字" },
  { key: "textSoft", label: "次要文字" },
  { key: "border", label: "邊框線" },
];

const EMOJI_CHOICES = [
  "", "🛍️", "🛒", "🧾", "💰", "💳", "🏷️", "📦", "✨", "⭐", "🌟", "❤️",
  "🍑", "🍊", "🍋", "🍀", "🌈", "☁️", "🔥", "📊", "📈", "🗓️", "⚙️", "🎁",
];

const TAB_KEYS = ["list", "form", "stats", "search", "settings"];
const TAB_DEFAULT_LABELS = { list: "訂單", form: "新增", stats: "統計", search: "搜尋", settings: "設定" };
const DEFAULT_EMOJI_SETTINGS = {
  titleEmoji: "",
  tabEmojis: { list: "", form: "", stats: "", search: "", settings: "" },
};
const TEXT_ALIGN_OPTIONS = [
  { id: "left", name: "靠左" },
  { id: "center", name: "置中" },
];
const HEADING_WEIGHT_OPTIONS = [
  { id: "normal", name: "一般粗細", value: 700 },
  { id: "bold", name: "加粗（預設）", value: 800 },
  { id: "black", name: "特粗" , value: 900 },
];

const FONT_PRESETS = [
  { id: "sans", name: "現代黑體（預設）", family: "'Noto Sans TC', sans-serif" },
  { id: "serif", name: "襯線明體", family: "'Noto Serif TC', serif" },
  { id: "rounded", name: "圓潤圓體", family: "'M PLUS Rounded 1c', 'Noto Sans TC', sans-serif", googleFont: "M+PLUS+Rounded+1c:wght@400;500;700" },
  { id: "system", name: "系統預設字型", family: "-apple-system, BlinkMacSystemFont, 'PingFang TC', 'Microsoft JhengHei', sans-serif" },
];

const FONT_SIZE_PRESETS = [
  { id: "sm", name: "小", scale: 0.9 },
  { id: "md", name: "中（預設）", scale: 1 },
  { id: "lg", name: "大", scale: 1.15 },
  { id: "xl", name: "特大", scale: 1.3 },
];

const STORAGE_KEY = "ledger-data";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function todayStr() {
  // 用瀏覽器「本地時區」的年月日組字串，不要用 toISOString()（那個是 UTC，
  // 台灣是 UTC+8，晚上 8 點後用 toISOString() 會抓到隔天的日期，是錯的）。
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fmt(n) {
  const v = Math.round(Number(n) || 0);
  return "NT$" + v.toLocaleString("zh-TW");
}

/* ---- 色彩工具 ---- */
function hexToRgb(hex) {
  const h = (hex || "#999999").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16) || 0x999999;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}
function mix(hexA, hexB, ratio) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return rgbToHex(a.r + (b.r - a.r) * ratio, a.g + (b.g - a.g) * ratio, a.b + (b.b - a.b) * ratio);
}
function darken(hex, ratio) { return mix(hex, "#000000", ratio); }

function normalizeColors(colors) {
  return { ...BASE_LIGHT, ...(colors || {}) };
}
function normalizeTheme(t) {
  if (!t) return null;
  if (t.colors) return { id: t.id || uid(), name: t.name || "自訂主題", colors: normalizeColors(t.colors) };
  // 相容舊版只有 primary 的主題資料
  return { id: t.id || uid(), name: t.name || "自訂主題", colors: normalizeColors({ primary: t.primary }) };
}

function downloadJSON(obj, filename) {
  try {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("下載失敗", e);
  }
}
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
function resizeImageFile(file, maxDim = 1000, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function resizeDataUrl(dataUrl, maxDim = 200, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
function cropImageElement(imgEl, rectDisplayed, maxOutWidth = 640, quality = 0.85) {
  const scaleX = imgEl.naturalWidth / imgEl.clientWidth;
  const scaleY = imgEl.naturalHeight / imgEl.clientHeight;
  const sx = Math.max(0, rectDisplayed.x * scaleX);
  const sy = Math.max(0, rectDisplayed.y * scaleY);
  const sw = Math.max(1, rectDisplayed.w * scaleX);
  const sh = Math.max(1, rectDisplayed.h * scaleY);
  const outW = Math.min(maxOutWidth, sw);
  const outH = sh * (outW / sw);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(outW);
  canvas.height = Math.round(outH);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}
function extractJSONObject(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw e;
  }
}

function normalizeParsedResult(parsed) {
  return {
    name: typeof parsed.name === "string" ? parsed.name.trim() : "",
    spec: typeof parsed.spec === "string" ? parsed.spec.trim() : "",
    quantity: Number(parsed.quantity) > 0 ? Number(parsed.quantity) : 1,
    price: Number(parsed.price) >= 0 ? Number(parsed.price) : 0,
  };
}

const RECOGNITION_PROMPT =
  "這是一張網購訂單截圖裡裁切出來的局部區域，通常包含一項商品的資訊：商品名稱、規格（顏色/尺寸等）、數量、單價（有時還有一個被劃掉的原價）。\n" +
  "如果這個範圍裡不小心包含了不只一項商品，請只判讀畫面中『最完整、最上面那一項』商品，忽略其他項目。\n" +
  "請只回傳一個 JSON 物件，不要有任何其他文字、說明、Markdown 符號或程式碼區塊標記。JSON 格式固定為：\n" +
  '{"name": "商品名稱字串", "spec": "規格字串", "quantity": 數量數字, "price": 單價數字}\n\n' +
  "各欄位規則：\n" +
  "- name：完整保留截圖上的原始商品名稱文字，不要翻譯、不要改寫、不要自己補字。\n" +
  "- spec：商品的規格/款式資訊，通常會另外標示「規格：」或直接列出顏色、尺寸、款式等（例如「外耳掛紫色」「白色/M」）。如果畫面上完全沒有這種規格資訊，填空字串 \"\"。\n" +
  "- quantity：商品數量，畫面上常顯示為「x6」「×1」這種格式，只取數字部分；看不出來就填 1。\n" +
  "- price：商品的實際單價。如果同時看到被劃掉的原價（例如 $50）和目前的價格（例如 $30），一定要用『目前的價格』，不要用被劃掉的原價；如果只看得到小計金額，用小計除以數量估算；都看不出來就填 0。";

/* ---- 第一層：Anthropic（你自己的 API 金鑰） ---- */
async function recognizeWithAnthropic(dataUrl, apiKey) {
  if (!apiKey) throw new Error("未設定 Anthropic API 金鑰");
  const mediaType = dataUrl.substring(5, dataUrl.indexOf(";")) || "image/jpeg";
  const base64 = dataUrl.split(",")[1];
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: RECOGNITION_PROMPT },
          ],
        },
      ],
    }),
  });
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error("Anthropic API 錯誤 " + response.status + " " + errText.slice(0, 200));
  }
  const data = await response.json();
  const textBlock = (data.content || []).find((b) => b.type === "text");
  if (!textBlock) throw new Error("Anthropic 沒有回傳文字結果");
  return normalizeParsedResult(extractJSONObject(textBlock.text));
}

/* ---- 第二層：OpenAI GPT（你自己的 API 金鑰） ---- */
async function recognizeWithOpenAI(dataUrl, apiKey, modelName) {
  if (!apiKey) throw new Error("未設定 OpenAI API 金鑰");
  const model = modelName || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: RECOGNITION_PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  });
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error("OpenAI API 錯誤 " + response.status + " " + errText.slice(0, 200));
  }
  const data = await response.json();
  const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!text) throw new Error("OpenAI 沒有回傳文字結果");
  return normalizeParsedResult(extractJSONObject(text));
}

/* ---- 第三層：Google Gemini（你自己的 API 金鑰，額度用完時的備援） ---- */
async function recognizeWithGemini(dataUrl, apiKey, modelName) {
  if (!apiKey) throw new Error("未設定 Gemini API 金鑰");
  const mediaType = dataUrl.substring(5, dataUrl.indexOf(";")) || "image/jpeg";
  const base64 = dataUrl.split(",")[1];
  const model = modelName || "gemini-2.0-flash";
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: RECOGNITION_PROMPT }, { inline_data: { mime_type: mediaType, data: base64 } }],
          },
        ],
      }),
    }
  );
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error("Gemini API 錯誤 " + response.status + " " + errText.slice(0, 200));
  }
  const data = await response.json();
  const text = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
  if (!text) throw new Error("Gemini 沒有回傳文字結果");
  return normalizeParsedResult(extractJSONObject(text));
}

/* ---- 第四層：Tesseract.js（完全免費、本機文字辨識，用規則猜欄位，準確度較低） ---- */
// 這些是常見的平台標籤/雜訊字樣，抓商品名稱時要跳過，不然容易誤判成商品名稱
const OCR_NOISE_LINE_PATTERNS = [
  /^蝦皮(優選|嚴選|直送|退換貨保障|好評)/,
  /^momo(嚴選|獨家)?$/i,
  /^規格[:：]/,
  /^已[選选]擇/,
  /^(訂單|購買|退換)證明$/,
  /^狀態[:：]/,
  /^\d+\s*(則評價|已售)/,
];

function guessFieldsFromOcrText(text) {
  const clean = (text || "").replace(/\r/g, "");
  const rawLines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  // 規格：優先找明確標示「規格：」的那一行，直接取冒號後面的內容，準確度最高
  let spec = "";
  const specLine = rawLines.find((l) => /^規格[:：]/.test(l));
  if (specLine) spec = specLine.replace(/^規格[:：]\s*/, "").trim();

  // 過濾掉常見的標籤/雜訊行，剩下的才拿來猜名稱
  const lines = rawLines.filter((l) => !OCR_NOISE_LINE_PATTERNS.some((re) => re.test(l)));

  let quantity = 1;
  const qtyMatch = clean.match(/[xX×]\s?(\d{1,4})/);
  if (qtyMatch) quantity = Math.max(1, parseInt(qtyMatch[1], 10));

  let price = 0;
  const priceMatches = Array.from(clean.matchAll(/\$\s?(\d{1,3}(?:,\d{3})*|\d+)/g)).map((m) => Number(m[1].replace(/,/g, "")));
  if (priceMatches.length) {
    // 同一段文字裡如果出現「被劃掉的原價」跟「現在的價格」兩個 $ 數字，現價通常比較小、且排在後面，取最後一個更接近實際情況
    price = priceMatches[priceMatches.length - 1];
  } else {
    // 完全沒抓到 $ 符號時才用這個備援：只挑「單獨成行、沒有夾雜其他文字」的數字，
    // 避免誤抓到像「80%棉襪」裡的 80、或商品編號裡的數字
    const isolatedNumberLines = rawLines
      .filter((l) => /^\d{1,3}(,\d{3})*$|^\d{2,}$/.test(l.replace(/[,\s]/g, "")))
      .map((l) => Number(l.replace(/[,\s]/g, "")));
    if (isolatedNumberLines.length) price = Math.max(...isolatedNumberLines);
  }

  // 名稱：在過濾雜訊後的候選行裡，挑「字數最多」的一行（商品名稱通常是整段裡最長的文字），
  // 而不是「第一行看起來像文字的」，避免抓到標籤或副標
  let name = "";
  let bestScore = 0;
  const candidateScores = lines.map((line) => {
    const lettersOnly = line.replace(/[\d$xX×,.\s%]/g, "");
    return { line, score: lettersOnly.length };
  });
  for (const c of candidateScores) {
    if (c.score >= 2 && c.score > bestScore) {
      name = c.line;
      bestScore = c.score;
    }
  }

  // 沒有明確「規格：」標籤時就留空，不硬猜——猜錯的資料比空白更麻煩，讓使用者自己填比較安全

  return { name, spec, quantity, price };
}
async function recognizeWithTesseract(dataUrl) {
  if (!window.Tesseract) throw new Error("本機文字辨識套件尚未載入");
  const worker = await window.Tesseract.createWorker("chi_tra+eng");
  try {
    // PSM 11 = 「零散文字」模式：專門找散落在畫面各處的文字片段，不要求它們排成完整段落，
    // 比預設的「自動版面判斷」更適合這種縮圖/名稱/規格/價格分散各角落的截圖版面。
    await worker.setParameters({ tessedit_pageseg_mode: "11" });
    const result = await worker.recognize(dataUrl);
    const text = result && result.data && result.data.text;
    if (!text || !text.trim()) throw new Error("本機文字辨識沒有讀到任何文字");
    return { ...guessFieldsFromOcrText(text), rawOcrText: text.trim() };
  } finally {
    await worker.terminate();
  }
}

/* ---- 四層辨識：Anthropic → GPT → Gemini → Tesseract.js，逐層自動 fallback ---- */
// ocrDataUrl 是給 Tesseract 用的高解析度版本（OCR 對小字比較吃力，解析度太低容易整段誤判）
async function recognizeItemFromImage(dataUrl, onStatus, ocrDataUrl) {
  const anthropicKey = localStorage.getItem("ledger-key-anthropic") || "";
  const openaiKey = localStorage.getItem("ledger-key-openai") || "";
  const openaiModel = localStorage.getItem("ledger-openai-model") || "";
  const geminiKey = localStorage.getItem("ledger-key-gemini") || "";
  const geminiModel = localStorage.getItem("ledger-gemini-model") || "";

  const tiers = [];
  if (anthropicKey) tiers.push({ label: "Anthropic", run: () => recognizeWithAnthropic(dataUrl, anthropicKey) });
  if (openaiKey) tiers.push({ label: "GPT", run: () => recognizeWithOpenAI(dataUrl, openaiKey, openaiModel) });
  if (geminiKey) tiers.push({ label: "Gemini", run: () => recognizeWithGemini(dataUrl, geminiKey, geminiModel) });
  tiers.push({ label: "本機文字辨識（Tesseract）", run: () => recognizeWithTesseract(ocrDataUrl || dataUrl) });

  let lastErr = null;
  for (const tier of tiers) {
    try {
      if (onStatus) onStatus("使用「" + tier.label + "」辨識中…");
      const result = await tier.run();
      return { ...result, source: tier.label };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("四種辨識方式都失敗了");
}

function blankItem() {
  return { id: uid(), name: "", spec: "", price: "", qty: 1, category: "", link: "", image: "" };
}
function blankCoupon() {
  return { enabled: false, type: "fixed", value: "", cap: "", label: "" };
}
function blankReward() {
  return { id: uid(), type: "信用卡", label: "", mode: "percent", percent: "", fixedAmount: "" };
}
function blankTokenDiscount() {
  return { enabled: false, label: "", value: "" };
}
function blankOrder() {
  return {
    id: uid(),
    platform: DEFAULT_PLATFORMS[0],
    date: todayStr(),
    orderNumber: "",
    note: "",
    images: [],
    items: [blankItem()],
    shopCoupon: blankCoupon(),
    platformCoupon: blankCoupon(),
    tokenDiscount: blankTokenDiscount(),
    shipping: "",
    shippingMethod: "",
    payment: { method: "信用卡", bank: "", cardName: "", installment: { enabled: false, periods: "" }, otherLabel: "" },
    rewards: [],
  };
}

function applyCap(amount, cap) {
  const c = Number(cap);
  if (!cap || isNaN(c) || c <= 0) return amount;
  return Math.min(amount, c);
}

function calcOrder(order) {
  const subtotal = (order.items || []).reduce(
    (s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0),
    0
  );
  let running = subtotal;
  let shopDiscount = 0;
  let platformDiscount = 0;

  const sc = order.shopCoupon || blankCoupon();
  if (sc.enabled && sc.type !== "token") {
    if (sc.type === "fixed") {
      shopDiscount = Math.min(Number(sc.value) || 0, running);
    } else {
      const pct = Number(sc.value);
      const fraction = isNaN(pct) ? 0 : 1 - pct / 100;
      shopDiscount = running * fraction;
      shopDiscount = applyCap(shopDiscount, sc.cap);
    }
    running -= shopDiscount;
  }

  const pc = order.platformCoupon || blankCoupon();
  if (pc.enabled && pc.type !== "token") {
    if (pc.type === "fixed") {
      platformDiscount = Math.min(Number(pc.value) || 0, running);
    } else {
      const pct = Number(pc.value);
      const fraction = isNaN(pct) ? 0 : 1 - pct / 100;
      platformDiscount = running * fraction;
      platformDiscount = applyCap(platformDiscount, pc.cap);
    }
    running -= platformDiscount;
  }

  // 平台代幣折抵：拿手上已經有的代幣直接折抵這筆訂單要付的錢，屬於付款方式的一種，會減少實付金額
  let tokenDiscountAmount = 0;
  const td = order.tokenDiscount || blankTokenDiscount();
  if (td.enabled) {
    tokenDiscountAmount = Math.min(Number(td.value) || 0, running);
    running -= tokenDiscountAmount;
  }

  const shipping = Number(order.shipping) || 0;
  const finalPaid = running + shipping;

  // 回饋代幣（賣場券/平台券裡的模式）：這筆訂單額外賺到的代幣，可以留著花在其他訂單，不影響這筆的實付金額，只反映在實際成本
  function couponTokenAmount(coupon) {
    if (!coupon || !coupon.enabled || coupon.type !== "token") return 0;
    const amount = (finalPaid * (Number(coupon.value) || 0)) / 100;
    return applyCap(amount, coupon.cap);
  }
  const shopTokenAmount = couponTokenAmount(sc);
  const platformTokenAmount = couponTokenAmount(pc);
  const couponRewardTokenAmount = shopTokenAmount + platformTokenAmount;

  const rewards = (order.rewards || []).map((r) => ({
    ...r,
    amount: r.mode === "fixed" ? (Number(r.fixedAmount) || 0) : (finalPaid * (Number(r.percent) || 0)) / 100,
  }));
  const totalReward = rewards.reduce((s, r) => s + r.amount, 0);
  const actualCost = finalPaid - totalReward - couponRewardTokenAmount;

  return {
    subtotal, shopDiscount, platformDiscount, tokenDiscountAmount,
    couponRewardTokenAmount, shopTokenAmount, platformTokenAmount,
    totalDiscount: shopDiscount + platformDiscount + tokenDiscountAmount,
    shipping, finalPaid, rewards, totalReward, actualCost,
  };
}

// 信用卡分期：把訂單的實付金額拆成每期要記到哪個月份、金額多少。
// 沒有開分期的訂單，回傳單一筆（就是原本那個月、全額），行為完全跟以前一樣。
// 有分期的話，從訂單當月開始連續 N 個月各記一部分，除不盡的餘數會加到第一期，
// 這樣加總起來還是等於訂單的完整實付金額，不會多也不會少。
function installmentSchedule(order, calc) {
  if (!order.date) return [];
  const inst = order.payment && order.payment.installment;
  const periods = inst && inst.enabled ? Math.max(2, parseInt(inst.periods, 10) || 0) : 0;
  if (!periods || periods < 2) {
    return [{ monthKey: order.date.slice(0, 7), amount: calc.finalPaid }];
  }
  const [yStr, mStr] = order.date.split("-");
  const y = Number(yStr);
  const mIdx = Number(mStr) - 1;
  const total = Math.round(calc.finalPaid);
  const base = Math.floor(total / periods);
  const remainder = total - base * periods;
  const schedule = [];
  for (let i = 0; i < periods; i++) {
    const mm = mIdx + i;
    const yy = y + Math.floor(mm / 12);
    const normalizedMonth = ((mm % 12) + 12) % 12;
    const monthKey = `${yy}-${String(normalizedMonth + 1).padStart(2, "0")}`;
    schedule.push({ monthKey, amount: base + (i === 0 ? remainder : 0) });
  }
  return schedule;
}


/* ------------------------------------------------------------------ */

function App() {
  const [loaded, setLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [shippingMethods, setShippingMethods] = useState(DEFAULT_SHIPPING_METHODS);
  const [banks, setBanks] = useState(DEFAULT_BANKS);
  const [cardNames, setCardNames] = useState(DEFAULT_CARD_NAMES);
  const [platformColors, setPlatformColors] = useState(DEFAULT_PLATFORM_COLORS);
  const [themeId, setThemeId] = useState(DEFAULT_THEMES[0].id);
  const [customThemes, setCustomThemes] = useState([]);
  const [fontId, setFontId] = useState(FONT_PRESETS[0].id);
  const [customFontName, setCustomFontName] = useState("");
  const [fontScale, setFontScale] = useState(FONT_SIZE_PRESETS[1].scale);
  const [emojiSettings, setEmojiSettings] = useState(DEFAULT_EMOJI_SETTINGS);
  const [titleAlign, setTitleAlign] = useState("left");
  const [headingWeight, setHeadingWeight] = useState("bold");

  const [view, setView] = useState("list");
  const [draft, setDraft] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [statsMode, setStatsMode] = useState("month");
  const [refDate, setRefDate] = useState(new Date());

  const loadedFontImports = useRef(new Set());

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          const data = JSON.parse(res.value);
          setOrders((data.orders || []).map((o) => ({ images: [], ...o })));
          setPlatforms(data.platforms && data.platforms.length ? data.platforms : DEFAULT_PLATFORMS);
          setCategories(data.categories && data.categories.length ? data.categories : DEFAULT_CATEGORIES);
          setShippingMethods(data.shippingMethods && data.shippingMethods.length ? data.shippingMethods : DEFAULT_SHIPPING_METHODS);
          setBanks(data.banks && data.banks.length ? data.banks : DEFAULT_BANKS);
          setCardNames(data.cardNames || DEFAULT_CARD_NAMES);
          setPlatformColors(data.platformColors && Object.keys(data.platformColors).length ? data.platformColors : DEFAULT_PLATFORM_COLORS);
          if (data.themeId) setThemeId(data.themeId);
          if (data.customThemes) setCustomThemes(data.customThemes.map(normalizeTheme).filter(Boolean));
          if (data.fontId) setFontId(data.fontId);
          if (data.customFontName) setCustomFontName(data.customFontName);
          if (data.fontScale) setFontScale(data.fontScale);
          if (data.emojiSettings) setEmojiSettings({ ...DEFAULT_EMOJI_SETTINGS, ...data.emojiSettings, tabEmojis: { ...DEFAULT_EMOJI_SETTINGS.tabEmojis, ...(data.emojiSettings.tabEmojis || {}) } });
          if (data.titleAlign) setTitleAlign(data.titleAlign);
          if (data.headingWeight) setHeadingWeight(data.headingWeight);
        }
      } catch (e) {
        // 尚無資料，從空白帳本開始
      }
      setLoaded(true);
    })();
  }, []);

  async function persist(next) {
    const payload = {
      orders: next.orders !== undefined ? next.orders : orders,
      platforms: next.platforms !== undefined ? next.platforms : platforms,
      categories: next.categories !== undefined ? next.categories : categories,
      shippingMethods: next.shippingMethods !== undefined ? next.shippingMethods : shippingMethods,
      banks: next.banks !== undefined ? next.banks : banks,
      cardNames: next.cardNames !== undefined ? next.cardNames : cardNames,
      platformColors: next.platformColors !== undefined ? next.platformColors : platformColors,
      themeId: next.themeId !== undefined ? next.themeId : themeId,
      customThemes: next.customThemes !== undefined ? next.customThemes : customThemes,
      fontId: next.fontId !== undefined ? next.fontId : fontId,
      customFontName: next.customFontName !== undefined ? next.customFontName : customFontName,
      fontScale: next.fontScale !== undefined ? next.fontScale : fontScale,
      emojiSettings: next.emojiSettings !== undefined ? next.emojiSettings : emojiSettings,
      titleAlign: next.titleAlign !== undefined ? next.titleAlign : titleAlign,
      headingWeight: next.headingWeight !== undefined ? next.headingWeight : headingWeight,
    };
    if (next.orders !== undefined) setOrders(next.orders);
    if (next.platforms !== undefined) setPlatforms(next.platforms);
    if (next.categories !== undefined) setCategories(next.categories);
    if (next.shippingMethods !== undefined) setShippingMethods(next.shippingMethods);
    if (next.banks !== undefined) setBanks(next.banks);
    if (next.cardNames !== undefined) setCardNames(next.cardNames);
    if (next.platformColors !== undefined) setPlatformColors(next.platformColors);
    if (next.themeId !== undefined) setThemeId(next.themeId);
    if (next.customThemes !== undefined) setCustomThemes(next.customThemes);
    if (next.fontId !== undefined) setFontId(next.fontId);
    if (next.customFontName !== undefined) setCustomFontName(next.customFontName);
    if (next.fontScale !== undefined) setFontScale(next.fontScale);
    if (next.emojiSettings !== undefined) setEmojiSettings(next.emojiSettings);
    if (next.titleAlign !== undefined) setTitleAlign(next.titleAlign);
    if (next.headingWeight !== undefined) setHeadingWeight(next.headingWeight);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(payload), false);
    } catch (e) {
      console.error("儲存失敗", e);
      const isQuota = e && (e.name === "QuotaExceededError" || /quota/i.test(e.message || ""));
      window.alert(
        isQuota
          ? "儲存失敗：瀏覽器本機空間不夠了（通常是圖片存太多）。剛剛的修改可能沒有真的存進去，建議刪掉幾張附加圖片或降低圖片數量後再試一次，並記得到「設定」匯出備份檔避免資料遺失。"
          : "儲存失敗，剛剛的修改可能沒有真的存進去。請重新整理頁面確認一下，如果資料不見了，麻煩告訴我當時做了什麼操作。"
      );
    }
  }

  const allThemes = [...DEFAULT_THEMES, ...customThemes];
  const activeTheme = allThemes.find((t) => t.id === themeId) || DEFAULT_THEMES[0];

  const activeFontPreset = FONT_PRESETS.find((f) => f.id === fontId) || FONT_PRESETS[0];
  const activeFontFamily =
    fontId === "custom" && customFontName.trim()
      ? `'${customFontName.trim()}', 'Noto Sans TC', sans-serif`
      : activeFontPreset.family;

  // 動態載入非預設字型（Google Fonts）
  useEffect(() => {
    let query = null;
    if (fontId === "custom" && customFontName.trim()) {
      query = customFontName.trim().replace(/\s+/g, "+") + ":wght@400;500;700";
    } else if (activeFontPreset.googleFont) {
      query = activeFontPreset.googleFont;
    }
    if (query && !loadedFontImports.current.has(query)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
      document.head.appendChild(link);
      loadedFontImports.current.add(query);
    }
  }, [fontId, customFontName]);

  const themeVars = useMemo(() => {
    const c = activeTheme.colors;
    const headingWeightValue = (HEADING_WEIGHT_OPTIONS.find((w) => w.id === headingWeight) || HEADING_WEIGHT_OPTIONS[1]).value;
    return {
      "--primary": c.primary,
      "--primary-dark": mix(c.primary, "#000000", 0.16),
      "--primary-soft": mix(c.primary, c.card, 0.82),
      "--primary-soft-2": mix(c.primary, c.card, 0.92),
      "--secondary": c.secondary,
      "--secondary-dark": mix(c.secondary, "#000000", 0.16),
      "--secondary-soft": mix(c.secondary, c.card, 0.82),
      "--bg": c.bg,
      "--card": c.card,
      "--header-bg": c.headerBg,
      "--text": c.text,
      "--text-soft": c.textSoft,
      "--border": c.border,
      "--font-body": activeFontFamily,
      "--font-scale": fontScale,
      "--heading-weight": headingWeightValue,
      "--title-align": titleAlign === "center" ? "center" : "left",
    };
  }, [activeTheme, activeFontFamily, fontScale, headingWeight, titleAlign]);

  function changeFontScale(scale) {
    persist({ fontScale: scale });
  }
  function changeTitleEmoji(emoji) {
    persist({ emojiSettings: { ...emojiSettings, titleEmoji: emoji } });
  }
  function changeTabEmoji(tabKey, emoji) {
    persist({ emojiSettings: { ...emojiSettings, tabEmojis: { ...emojiSettings.tabEmojis, [tabKey]: emoji } } });
  }
  function changeTitleAlign(align) {
    persist({ titleAlign: align });
  }
  function changeHeadingWeight(weightId) {
    persist({ headingWeight: weightId });
  }

  function startNew() {
    setDraft(blankOrder());
    setView("form");
  }
  function startEdit(order) {
    setDraft(JSON.parse(JSON.stringify({
      images: [], ...order,
      payment: {
        method: "信用卡", bank: "", cardName: "", otherLabel: "",
        ...order.payment,
        installment: { enabled: false, periods: "", ...(order.payment && order.payment.installment) },
      },
      shopCoupon: { ...blankCoupon(), ...order.shopCoupon },
      platformCoupon: { ...blankCoupon(), ...order.platformCoupon },
      tokenDiscount: { ...blankTokenDiscount(), ...order.tokenDiscount },
    })));
    setView("form");
  }
  function cancelForm() {
    setDraft(null);
    setView("list");
  }
  function saveDraft() {
    if (!draft) return;
    const cleanItems = draft.items.filter((i) => i.name.trim() !== "");
    const cleaned = { ...draft, items: cleanItems.length ? cleanItems : draft.items };
    const exists = orders.some((o) => o.id === cleaned.id);
    const nextOrders = exists
      ? orders.map((o) => (o.id === cleaned.id ? cleaned : o))
      : [cleaned, ...orders];

    let nextPlatforms = platforms;
    if (cleaned.platform && !platforms.includes(cleaned.platform)) {
      nextPlatforms = [...platforms, cleaned.platform];
    }
    let nextCategories = categories;
    const usedCats = cleaned.items.map((i) => i.category).filter(Boolean);
    const newCats = usedCats.filter((c) => !nextCategories.includes(c));
    if (newCats.length) nextCategories = [...nextCategories, ...Array.from(new Set(newCats))];

    let nextShippingMethods = shippingMethods;
    if (cleaned.shippingMethod && !shippingMethods.includes(cleaned.shippingMethod)) {
      nextShippingMethods = [...shippingMethods, cleaned.shippingMethod];
    }
    let nextBanks = banks;
    const bankVal = cleaned.payment && cleaned.payment.bank && cleaned.payment.bank.trim();
    if (bankVal && !banks.includes(bankVal)) {
      nextBanks = [...banks, bankVal];
    }
    let nextCardNames = cardNames;
    const cardNameVal = cleaned.payment && cleaned.payment.cardName && cleaned.payment.cardName.trim();
    if (cardNameVal && !cardNames.includes(cardNameVal)) {
      nextCardNames = [...cardNames, cardNameVal];
    }

    persist({
      orders: nextOrders,
      platforms: nextPlatforms,
      categories: nextCategories,
      shippingMethods: nextShippingMethods,
      banks: nextBanks,
      cardNames: nextCardNames,
    });
    setDraft(null);
    setView("list");
  }
  function deleteOrder(id) {
    persist({ orders: orders.filter((o) => o.id !== id) });
    setConfirmDeleteId(null);
    if (expandedId === id) setExpandedId(null);
  }

  function selectTheme(id) {
    persist({ themeId: id });
  }
  function saveCustomTheme(name, colors) {
    const t = { id: uid(), name: name.trim() || "自訂主題", colors: normalizeColors(colors) };
    persist({ customThemes: [...customThemes, t], themeId: t.id });
  }
  function deleteCustomTheme(id) {
    const next = customThemes.filter((t) => t.id !== id);
    const nextThemeId = themeId === id ? DEFAULT_THEMES[0].id : themeId;
    persist({ customThemes: next, themeId: nextThemeId });
  }
  function importThemeFromObject(obj) {
    if (!obj || !obj.colors || !obj.colors.primary) {
      window.alert("主題檔案格式不正確，請確認是從本 App 匯出的主題檔（需包含 colors.primary）。");
      return false;
    }
    const t = { id: uid(), name: obj.name || "匯入主題", colors: normalizeColors(obj.colors) };
    persist({ customThemes: [...customThemes, t], themeId: t.id });
    return true;
  }
  function exportTheme() {
    downloadJSON({ name: activeTheme.name, colors: activeTheme.colors }, `${activeTheme.name || "主題"}.json`);
  }
  function changeFont(id) {
    persist({ fontId: id });
  }
  function changeCustomFontName(name) {
    setCustomFontName(name);
    persist({ fontId: "custom", customFontName: name });
  }

  function exportBackup() {
    const payload = {
      orders, platforms, categories, shippingMethods, banks, cardNames, platformColors, themeId, customThemes, fontId, customFontName,
      exportedAt: new Date().toISOString(),
    };
    downloadJSON(payload, `網購記帳簿備份-${todayStr()}.json`);
  }
  function importBackupFromObject(obj) {
    if (!obj || !Array.isArray(obj.orders)) {
      window.alert("備份檔格式不正確，請確認是從本 App 匯出的備份檔。");
      return false;
    }
    const ok = window.confirm("還原備份將會取代目前帳本內的所有資料，確定要繼續嗎？");
    if (!ok) return false;
    persist({
      orders: obj.orders || [],
      platforms: obj.platforms && obj.platforms.length ? obj.platforms : DEFAULT_PLATFORMS,
      categories: obj.categories && obj.categories.length ? obj.categories : DEFAULT_CATEGORIES,
      shippingMethods: obj.shippingMethods && obj.shippingMethods.length ? obj.shippingMethods : DEFAULT_SHIPPING_METHODS,
      banks: obj.banks && obj.banks.length ? obj.banks : DEFAULT_BANKS,
      cardNames: obj.cardNames || DEFAULT_CARD_NAMES,
      platformColors: obj.platformColors && Object.keys(obj.platformColors).length ? obj.platformColors : DEFAULT_PLATFORM_COLORS,
      themeId: obj.themeId || DEFAULT_THEMES[0].id,
      customThemes: (obj.customThemes || []).map(normalizeTheme).filter(Boolean),
      fontId: obj.fontId || FONT_PRESETS[0].id,
      customFontName: obj.customFontName || "",
    });
    return true;
  }

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...orders].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (!q) return sorted;
    return sorted.filter((o) => {
      const hay = [
        o.platform, o.orderNumber, o.note, o.date,
        ...(o.items || []).map((i) => i.name),
        ...(o.items || []).map((i) => i.category),
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [orders, search]);

  const statsOrders = useMemo(() => {
    const y = refDate.getFullYear();
    const m = refDate.getMonth();
    const targetMonthKey = `${y}-${String(m + 1).padStart(2, "0")}`;
    return orders
      .map((o) => {
        const c = calcOrder(o);
        const schedule = installmentSchedule(o, c);
        let contribution = 0;
        if (statsMode === "year") {
          contribution = schedule
            .filter((s) => s.monthKey.startsWith(`${y}-`))
            .reduce((sum, s) => sum + s.amount, 0);
        } else {
          const entry = schedule.find((s) => s.monthKey === targetMonthKey);
          contribution = entry ? entry.amount : 0;
        }
        if (contribution <= 0) return null;
        const d = new Date(o.date + "T00:00:00");
        const isOriginPeriod =
          !isNaN(d) &&
          (statsMode === "year" ? d.getFullYear() === y : d.getFullYear() === y && d.getMonth() === m);
        return { order: o, calc: c, contribution, isOriginPeriod };
      })
      .filter(Boolean);
  }, [orders, statsMode, refDate]);

  const stats = useMemo(() => {
    let paidSum = 0, discountSum = 0, shippingSum = 0, rewardSum = 0, costSum = 0;
    const byPlatform = {};
    const byCategory = {};
    const byReward = {};
    const byDay = {};
    const byDayOrders = {};
    const byMonth = {};
    const byPayment = {};

    statsOrders.forEach(({ order: o, calc: c, contribution, isOriginPeriod }) => {
      // ratio：這筆訂單這個月份要算的錢，佔它完整實付金額的比例。
      // 沒有分期的訂單 ratio 永遠是 1，行為完全不變；有分期的訂單，非整筆金額的部分（折扣/回饋/運費等）
      // 都跟著這個比例等比例分攤，這樣加總起來才會兜得起來。
      const ratio = c.finalPaid > 0 ? contribution / c.finalPaid : 0;
      paidSum += contribution;
      discountSum += c.totalDiscount * ratio;
      shippingSum += c.shipping * ratio;
      rewardSum += (c.totalReward + c.couponRewardTokenAmount) * ratio;
      costSum += c.actualCost * ratio;
      byPlatform[o.platform] = (byPlatform[o.platform] || 0) + contribution;
      (o.items || []).forEach((i) => {
        const key = i.category || "其他";
        byCategory[key] = (byCategory[key] || 0) + (Number(i.price) || 0) * (Number(i.qty) || 0) * ratio;
      });
      c.rewards.forEach((r) => {
        const key = r.type === "自訂" ? r.label || "自訂回饋" : r.type;
        byReward[key] = (byReward[key] || 0) + r.amount * ratio;
      });
      if (c.shopTokenAmount > 0) {
        const key = (o.shopCoupon && o.shopCoupon.label) || "賣場回饋代幣";
        byReward[key] = (byReward[key] || 0) + c.shopTokenAmount * ratio;
      }
      if (c.platformTokenAmount > 0) {
        const key = (o.platformCoupon && o.platformCoupon.label) || "平台回饋代幣";
        byReward[key] = (byReward[key] || 0) + c.platformTokenAmount * ratio;
      }
      // 行事曆／依日期圖表只在訂單「原本那個月」顯示，永遠用完整原始金額，不受分期影響
      if (o.date && isOriginPeriod) {
        byDay[o.date] = (byDay[o.date] || 0) + c.finalPaid;
        const items = o.items || [];
        const firstName = (items[0] && items[0].name) || "（未命名商品）";
        const label = items.length > 1 ? `${firstName} 等${items.length}項` : firstName;
        if (!byDayOrders[o.date]) byDayOrders[o.date] = [];
        byDayOrders[o.date].push({
          orderId: o.id,
          label,
          platform: o.platform,
          amount: c.finalPaid,
          itemNames: items.map((i) => i.name || "（未命名商品）"),
        });
      }
      const method = (o.payment && o.payment.method) || "其他";
      if (!byPayment[method]) byPayment[method] = { total: 0, banks: {} };
      byPayment[method].total += contribution;
      if (method === "信用卡") {
        const bank = (o.payment && o.payment.bank && o.payment.bank.trim()) || "未填寫銀行";
        if (!byPayment[method].banks[bank]) byPayment[method].banks[bank] = { total: 0, cards: {} };
        byPayment[method].banks[bank].total += contribution;
        const cardName = (o.payment && o.payment.cardName && o.payment.cardName.trim()) || "未填寫卡片";
        byPayment[method].banks[bank].cards[cardName] = (byPayment[method].banks[bank].cards[cardName] || 0) + contribution;
      }
    });

    // 年檢視的「依月份」長條圖：每一筆訂單（不管起始月份是不是在這一年）都攤開它的分期排程，
    // 落在這個年份的每一期各自記到對應月份，這樣分期跨年也不會漏記或算錯月份。
    if (statsMode === "year") {
      const y = refDate.getFullYear();
      orders.forEach((o) => {
        const c = calcOrder(o);
        const schedule = installmentSchedule(o, c);
        schedule.forEach((s) => {
          if (s.monthKey.startsWith(`${y}-`)) {
            byMonth[s.monthKey] = (byMonth[s.monthKey] || 0) + s.amount;
          }
        });
      });
    }

    return { count: statsOrders.filter((e) => e.isOriginPeriod).length, paidSum, discountSum, shippingSum, rewardSum, costSum, byPlatform, byCategory, byReward, byDay, byDayOrders, byMonth, byPayment };
  }, [statsOrders, statsMode, refDate, orders]);

  function shiftRef(delta) {
    const d = new Date(refDate);
    if (statsMode === "year") d.setFullYear(d.getFullYear() + delta);
    else d.setMonth(d.getMonth() + delta);
    setRefDate(d);
  }

  const periodLabel =
    statsMode === "year" ? `${refDate.getFullYear()} 年` : `${refDate.getFullYear()} 年 ${refDate.getMonth() + 1} 月`;

  return (
    <div className="ledger-app" style={themeVars}>
      <style>{CSS}</style>

      <header className="app-header">
        <div className="app-title">
          <span className="app-title-eyebrow">MY SHOPPING LEDGER</span>
          <h1>{emojiSettings.titleEmoji ? `${emojiSettings.titleEmoji} ` : ""}網購記帳簿</h1>
        </div>

        <nav className="tabs">
          <button className={`tab ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>
            {emojiSettings.tabEmojis.list ? <span>{emojiSettings.tabEmojis.list}</span> : <ShoppingBag size={14} strokeWidth={2.4} />} 訂單
          </button>
          <button className={`tab ${view === "form" ? "active" : ""}`} onClick={startNew}>
            {emojiSettings.tabEmojis.form ? <span>{emojiSettings.tabEmojis.form}</span> : <Plus size={14} strokeWidth={2.6} />} 新增
          </button>
          <button className={`tab ${view === "stats" ? "active" : ""}`} onClick={() => setView("stats")}>
            {emojiSettings.tabEmojis.stats ? <span>{emojiSettings.tabEmojis.stats}</span> : <BarChart3 size={14} strokeWidth={2.4} />} 統計
          </button>
          <button className={`tab ${view === "search" ? "active" : ""}`} onClick={() => setView("search")}>
            {emojiSettings.tabEmojis.search ? <span>{emojiSettings.tabEmojis.search}</span> : <Search size={14} strokeWidth={2.4} />} 搜尋
          </button>
          <button className={`tab ${view === "settings" ? "active" : ""}`} onClick={() => setView("settings")}>
            {emojiSettings.tabEmojis.settings ? <span>{emojiSettings.tabEmojis.settings}</span> : <Settings size={14} strokeWidth={2.4} />} 設定
          </button>
        </nav>
      </header>

      <main className="app-main">
        {!loaded ? (
          <div className="empty-state"><p>載入中…</p></div>
        ) : view === "list" ? (
          <ListView
            orders={filteredOrders}
            search={search}
            setSearch={setSearch}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onEdit={startEdit}
            onDelete={setConfirmDeleteId}
            onNew={startNew}
            hasAny={orders.length > 0}
            platformColors={platformColors}
          />
        ) : view === "form" ? (
          <FormView
            draft={draft}
            setDraft={setDraft}
            platforms={platforms}
            categories={categories}
            shippingMethods={shippingMethods}
            banks={banks}
            cardNames={cardNames}
            onCancel={cancelForm}
            onSave={saveDraft}
            isEditing={orders.some((o) => draft && o.id === draft.id)}
          />
        ) : view === "stats" ? (
          <StatsView
            stats={stats}
            statsMode={statsMode}
            setStatsMode={setStatsMode}
            periodLabel={periodLabel}
            shiftRef={shiftRef}
            refDate={refDate}
            platformColors={platformColors}
          />
        ) : view === "search" ? (
          <SearchView
            orders={orders}
            platformColors={platformColors}
            onOpenOrder={(id) => { setExpandedId(id); setView("list"); }}
          />
        ) : (
          <SettingsView
            allThemes={allThemes}
            themeId={themeId}
            activeTheme={activeTheme}
            onSelectTheme={selectTheme}
            onSaveCustomTheme={saveCustomTheme}
            onDeleteCustomTheme={deleteCustomTheme}
            onImportTheme={importThemeFromObject}
            onExportTheme={exportTheme}
            fontId={fontId}
            customFontName={customFontName}
            onChangeFont={changeFont}
            onChangeCustomFontName={changeCustomFontName}
            fontScale={fontScale}
            onChangeFontScale={changeFontScale}
            emojiSettings={emojiSettings}
            onChangeTitleEmoji={changeTitleEmoji}
            onChangeTabEmoji={changeTabEmoji}
            titleAlign={titleAlign}
            onChangeTitleAlign={changeTitleAlign}
            headingWeight={headingWeight}
            onChangeHeadingWeight={changeHeadingWeight}
            onExportBackup={exportBackup}
            onImportBackup={importBackupFromObject}
            platforms={platforms}
            categories={categories}
            shippingMethods={shippingMethods}
            banks={banks}
            cardNames={cardNames}
            platformColors={platformColors}
            onChangePlatforms={(v) => persist({ platforms: v })}
            onChangeCategories={(v) => persist({ categories: v })}
            onChangeShippingMethods={(v) => persist({ shippingMethods: v })}
            onChangeBanks={(v) => persist({ banks: v })}
            onChangeCardNames={(v) => persist({ cardNames: v })}
            onChangePlatformColors={(v) => persist({ platformColors: v })}
          />
        )}
      </main>

      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>確定要刪除這筆訂單嗎？此動作無法復原。</p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setConfirmDeleteId(null)}>取消</button>
              <button className="btn danger" onClick={() => deleteOrder(confirmDeleteId)}>刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  訂單列表                                                            */
/* ------------------------------------------------------------------ */

function ListView({ orders, search, setSearch, expandedId, setExpandedId, onEdit, onDelete, onNew, hasAny, platformColors }) {
  const [lightboxSrc, setLightboxSrc] = useState(null);
  return (
    <div className="list-view">
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button type="button" className="lightbox-close" onClick={() => setLightboxSrc(null)}>
            <X size={22} strokeWidth={2.4} />
          </button>
          <img className="lightbox-img" src={lightboxSrc} alt="附加圖片放大" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <div className="search-row">
        <Search className="search-icon" size={16} strokeWidth={2.2} />
        <input
          className="search-input"
          placeholder="搜尋商品／平台／分類／訂單編號／備註／日期"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          {hasAny ? (
            <>
              <p className="empty-title">查無符合的訂單</p>
              <p className="empty-sub">換個關鍵字再試試看。</p>
            </>
          ) : (
            <>
              <p className="empty-title">帳本還是空的</p>
              <p className="empty-sub">記下第一筆網購訂單，開始追蹤花費與回饋。</p>
              <button className="btn primary" onClick={onNew}><Plus size={14} strokeWidth={2.6} />新增第一筆訂單</button>
            </>
          )}
        </div>
      ) : (
        <ul className="order-list">
          {orders.map((o) => {
            const c = calcOrder(o);
            const isOpen = expandedId === o.id;
            const color = colorForPlatform(o.platform, platformColors);
            const itemsTitle = o.items.map((i) => i.name || "未命名商品").join("、");
            return (
              <li key={o.id} className={`order-card ${isOpen ? "open" : ""}`}>
                <button className="order-row-head" onClick={() => setExpandedId(isOpen ? null : o.id)}>
                  <div className="order-row-main">
                    <p className="order-items-title">{itemsTitle || "（未命名商品）"}</p>
                    <p className="order-row-sub">
                      <span className="sub-chip"><Store size={12} strokeWidth={2.2} style={{ color }} />{o.platform}</span>
                      <span className="sub-chip"><Calendar size={12} strokeWidth={2.2} />{o.date}</span>
                      {c.totalDiscount > 0 && <span className="save-tag">省 {fmt(c.totalDiscount)}</span>}
                    </p>
                  </div>
                  <div className="order-row-trailing">
                    <span className="order-paid mono">{fmt(c.finalPaid)}</span>
                    <ChevronDown size={17} className={`chevron ${isOpen ? "open" : ""}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="order-detail">
                    <div className="detail-head">
                      <span className="detail-head-title">訂單明細</span>
                      <div className="detail-head-actions">
                        <button className="icon-btn-ghost" title="編輯" onClick={() => onEdit(o)}>
                          <Pencil size={15} strokeWidth={2.2} />
                        </button>
                        <button className="icon-btn-ghost danger" title="刪除" onClick={() => onDelete(o.id)}>
                          <Trash2 size={15} strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>

                    <div className="meta-card">
                      <span className="meta-row"><Calendar size={14} strokeWidth={2.2} />{o.date}</span>
                      <span className="meta-row"><Store size={14} strokeWidth={2.2} />{o.platform}{o.orderNumber ? ` · ${o.orderNumber}` : ""}</span>
                      <span className="meta-row">
                        <CreditCard size={14} strokeWidth={2.2} />
                        {(o.payment && o.payment.method) || "—"}
                        {o.payment && o.payment.method === "信用卡" && o.payment.bank ? ` · ${o.payment.bank}` : ""}
                        {o.payment && o.payment.method === "信用卡" && o.payment.cardName ? ` · ${o.payment.cardName}` : ""}
                        {o.payment && o.payment.method === "信用卡" && o.payment.installment && o.payment.installment.enabled && o.payment.installment.periods
                          ? ` · 分${o.payment.installment.periods}期`
                          : ""}
                        {o.payment && o.payment.method === "其他" && o.payment.otherLabel ? ` · ${o.payment.otherLabel}` : ""}
                      </span>
                    </div>

                    <div className="items-card">
                      <p className="items-card-title"><ShoppingBag size={14} strokeWidth={2.2} />貨品明細</p>
                      {o.items.map((i) => (
                        <div className="item-row" key={i.id}>
                          {i.image ? (
                            <SafeImg className="item-row-thumb" src={i.image} alt={i.name || "商品縮圖"} />
                          ) : (
                            <div className="item-row-thumb placeholder"><ShoppingBag size={14} strokeWidth={1.8} /></div>
                          )}
                          <div className="item-row-main">
                            <p className="item-row-name">
                              {i.link ? (
                                <a href={i.link} target="_blank" rel="noopener noreferrer">{i.name || "（未命名商品）"} ↗</a>
                              ) : (i.name || "（未命名商品）")}
                            </p>
                            <p className="item-row-sub">
                              {i.spec ? <>{i.spec} · </> : ""}
                              數量: {i.qty || 0} · 單價: {fmt(i.price)} · <span className="cat-chip">{i.category}</span>
                            </p>
                          </div>
                          <span className="item-row-amount mono">{fmt((Number(i.price) || 0) * (Number(i.qty) || 0))}</span>
                        </div>
                      ))}
                      <div className="item-row total-row">
                        <span className="item-row-name">商品小計</span>
                        <span className="item-row-amount mono strong">{fmt(c.subtotal)}</span>
                      </div>
                    </div>

                    <div className="items-card">
                      <p className="items-card-title"><Tag size={14} strokeWidth={2.2} />折抵與回饋</p>
                      <div className="ledger-lines">
                        {c.shopDiscount > 0 && <LedgerLine label="賣場券折抵" value={-c.shopDiscount} />}
                        {c.platformDiscount > 0 && <LedgerLine label="平台券折抵" value={-c.platformDiscount} />}
                        {c.tokenDiscountAmount > 0 && <LedgerLine label={`${(o.tokenDiscount && o.tokenDiscount.label) || "平台代幣"}折抵`} value={-c.tokenDiscountAmount} />}
                        <LedgerLine label={`運費${o.shippingMethod ? "（" + o.shippingMethod + "）" : ""}`} value={c.shipping} />
                        <LedgerLine label="實付金額" value={c.finalPaid} strong />
                        {c.shopTokenAmount > 0 && (
                          <LedgerLine
                            label={`回饋・${(o.shopCoupon && o.shopCoupon.label) || "賣場回饋代幣"}（${o.shopCoupon && o.shopCoupon.value ? `${o.shopCoupon.value}%` : ""}）`}
                            value={-c.shopTokenAmount}
                            muted
                          />
                        )}
                        {c.platformTokenAmount > 0 && (
                          <LedgerLine
                            label={`回饋・${(o.platformCoupon && o.platformCoupon.label) || "平台回饋代幣"}（${o.platformCoupon && o.platformCoupon.value ? `${o.platformCoupon.value}%` : ""}）`}
                            value={-c.platformTokenAmount}
                            muted
                          />
                        )}
                        {c.rewards.map((r, idx) => (
                          <LedgerLine key={idx} label={`回饋・${r.type === "自訂" ? r.label || "自訂" : r.type}（${r.mode === "fixed" ? "固定" : `${r.percent || 0}%`}）`} value={-r.amount} muted />
                        ))}
                        <LedgerLine label="實際成本" value={c.actualCost} highlight />
                      </div>
                    </div>

                    {(o.note || (o.images && o.images.length > 0)) && (
                      <div className="items-card">
                        <p className="items-card-title"><Pencil size={14} strokeWidth={2.2} />備註</p>
                        {o.note && <p className="order-note">{o.note}</p>}
                        {o.images && o.images.length > 0 && (
                          <div className="image-grid view-only">
                            {o.images.map((img) => (
                              <button
                                key={img.id}
                                type="button"
                                className="image-thumb view-only"
                                onClick={() => setLightboxSrc(img.dataUrl)}
                              >
                                <SafeImg src={img.dataUrl} alt="附加圖片" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SafeImg({ src, alt, className }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`img-fallback ${className || ""}`} title="圖片無法顯示">
        <ImagePlus size={15} strokeWidth={1.8} />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setBroken(true)} />;
}

function LedgerLine({ label, value, strong, muted, highlight }) {
  return (
    <div className={`ledger-line ${strong ? "strong" : ""} ${muted ? "muted" : ""}`}>
      <span>{label}</span>
      <span className={`mono ${highlight ? "highlight-text" : ""}`}>{fmt(value)}</span>
    </div>
  );
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 從系統剪貼簿讀取一張已複製的圖片（例如截圖、從其他 App 複製的優惠券圖），
// 回傳 Blob；讀不到圖片或瀏覽器不支援時回傳 null 並顯示提示。
async function pasteImageFromClipboard() {
  if (!navigator.clipboard || !navigator.clipboard.read) {
    window.alert("這個瀏覽器不支援直接貼上圖片，請改用「選擇圖片」或「拍照」。");
    return null;
  }
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const imageType = item.types.find((t) => t.startsWith("image/"));
      if (imageType) return await item.getType(imageType);
    }
    window.alert("剪貼簿裡沒有偵測到圖片，請先複製一張圖片再試一次。");
    return null;
  } catch (err) {
    window.alert("讀取剪貼簿失敗，可能是瀏覽器權限問題，請改用「選擇圖片」或「拍照」。");
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  裁切彈窗：上傳圖片後可以框選要保留的範圍，不選就用整張圖              */
/* ------------------------------------------------------------------ */
function CropModal({ imageSrc, onConfirm, onCancel, maxDim, quality }) {
  const [selection, setSelection] = useState(null);
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const startPoint = useRef(null);

  function pointFromEvent(e) {
    const rect = wrapRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.min(Math.max(clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(clientY - rect.top, 0), rect.height),
    };
  }
  function onPointerDown(e) {
    if (!imgRef.current) return;
    const p = pointFromEvent(e);
    startPoint.current = p;
    setSelection({ x: p.x, y: p.y, w: 0, h: 0 });
    setDragging(true);
  }
  function onPointerMove(e) {
    if (!dragging || !startPoint.current) return;
    const p = pointFromEvent(e);
    const x = Math.min(p.x, startPoint.current.x);
    const y = Math.min(p.y, startPoint.current.y);
    const w = Math.abs(p.x - startPoint.current.x);
    const h = Math.abs(p.y - startPoint.current.y);
    setSelection({ x, y, w, h });
  }
  function onPointerUp() {
    setDragging(false);
  }
  function handleReset() {
    setSelection(null);
  }
  async function handleConfirm() {
    if (!imgRef.current) return;
    let rect = selection;
    if (!rect || rect.w < 10 || rect.h < 10) {
      const el = imgRef.current;
      rect = { x: 0, y: 0, w: el.clientWidth, h: el.clientHeight };
    }
    try {
      const cropped = cropImageElement(imgRef.current, rect, 640, 0.82);
      const finalUrl = await resizeDataUrl(cropped, maxDim || 480, quality || 0.7);
      onConfirm(finalUrl);
    } catch (err) {
      window.alert("裁切失敗，請再試一次。");
    }
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal crop-modal" onClick={(e) => e.stopPropagation()}>
        <p className="crop-modal-title">框選要保留的範圍（不選就直接用整張圖）</p>
        <div
          className="scanner-canvas"
          ref={wrapRef}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        >
          <img ref={imgRef} src={imageSrc} alt="待裁切圖片" draggable={false} />
          {selection && (
            <div className="scanner-selection" style={{ left: selection.x, top: selection.y, width: selection.w, height: selection.h }} />
          )}
        </div>
        <div className="modal-actions">
          <button className="btn ghost small" onClick={handleReset}>清除框選</button>
          <button className="btn ghost" onClick={onCancel}>取消</button>
          <button className="btn primary" onClick={handleConfirm}>確認使用</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  新增／編輯表單                                                       */
/* ------------------------------------------------------------------ */

function FormView({ draft, setDraft, platforms, categories, shippingMethods, banks, cardNames, onCancel, onSave, isEditing }) {
  const [uploading, setUploading] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [thumbTargetId, setThumbTargetId] = useState(null);
  const [cropTarget, setCropTarget] = useState(null); // { type: "order" } | { type: "item", itemId }
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [showCoupons, setShowCoupons] = useState(
    () => !!(draft && ((draft.shopCoupon && draft.shopCoupon.enabled) || (draft.platformCoupon && draft.platformCoupon.enabled) || (draft.tokenDiscount && draft.tokenDiscount.enabled)))
  );
  const orderImagesInputRef = useRef(null);
  const itemThumbInputRef = useRef(null);
  if (!draft) return null;

  function update(patch) { setDraft({ ...draft, ...patch }); }
  function updateItem(id, patch) { setDraft({ ...draft, items: draft.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }); }
  function addItem() { setDraft({ ...draft, items: [...draft.items, blankItem()] }); }
  function removeItem(id) { setDraft({ ...draft, items: draft.items.filter((i) => i.id !== id) }); }
  function updateCoupon(key, patch) { setDraft({ ...draft, [key]: { ...draft[key], ...patch } }); }
  function addReward() { setDraft({ ...draft, rewards: [...draft.rewards, blankReward()] }); }
  function updateReward(id, patch) { setDraft({ ...draft, rewards: draft.rewards.map((r) => (r.id === id ? { ...r, ...patch } : r)) }); }
  function removeReward(id) { setDraft({ ...draft, rewards: draft.rewards.filter((r) => r.id !== id) }); }
  function removeImage(id) { setDraft({ ...draft, images: (draft.images || []).filter((img) => img.id !== id) }); }

  function openOrderImagePicker() {
    orderImagesInputRef.current && orderImagesInputRef.current.click();
  }
  function openItemThumbPicker(itemId) {
    setThumbTargetId(itemId);
    itemThumbInputRef.current && itemThumbInputRef.current.click();
  }

  async function handleImageInput(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if ((draft.images || []).length >= MAX_IMAGES) {
      window.alert(`最多只能加 ${MAX_IMAGES} 張附加圖片。`);
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      setCropImageSrc(dataUrl);
      setCropTarget({ type: "order" });
    } catch (err) {
      window.alert("圖片讀取失敗，請換一張試試看，或改用「拍照」選項。");
    }
  }

  async function handleItemThumbInput(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file || !thumbTargetId) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setCropImageSrc(dataUrl);
      setCropTarget({ type: "item", itemId: thumbTargetId });
    } catch (err) {
      window.alert("圖片讀取失敗，請換一張試試看，或改用「拍照」選項。");
    }
  }

  async function handlePasteOrderImage() {
    if ((draft.images || []).length >= MAX_IMAGES) {
      window.alert(`最多只能加 ${MAX_IMAGES} 張附加圖片。`);
      return;
    }
    const blob = await pasteImageFromClipboard();
    if (!blob) return;
    try {
      const dataUrl = await readFileAsDataURL(blob);
      setCropImageSrc(dataUrl);
      setCropTarget({ type: "order" });
    } catch (err) {
      window.alert("圖片讀取失敗，請改用「選擇圖片」試試看。");
    }
  }

  async function handlePasteItemThumb(itemId) {
    setThumbTargetId(itemId);
    const blob = await pasteImageFromClipboard();
    if (!blob) return;
    try {
      const dataUrl = await readFileAsDataURL(blob);
      setCropImageSrc(dataUrl);
      setCropTarget({ type: "item", itemId });
    } catch (err) {
      window.alert("圖片讀取失敗，請改用「選擇圖片」試試看。");
    }
  }

  function handleCropConfirm(finalUrl) {
    if (cropTarget && cropTarget.type === "order") {
      setDraft((d) => ({ ...d, images: [...(d.images || []), { id: uid(), dataUrl: finalUrl }] }));
    } else if (cropTarget && cropTarget.type === "item") {
      updateItem(cropTarget.itemId, { image: finalUrl });
    }
    setCropTarget(null);
    setCropImageSrc("");
  }
  function handleCropCancel() {
    setCropTarget(null);
    setCropImageSrc("");
  }

  function addItemFromScan({ name, spec, quantity, price }) {
    setDraft((d) => {
      const firstEmpty = d.items.find((i) => !i.name.trim());
      if (firstEmpty) {
        return {
          ...d,
          items: d.items.map((i) => (i.id === firstEmpty.id ? { ...i, name, spec: spec || "", qty: quantity, price } : i)),
        };
      }
      return { ...d, items: [...d.items, { ...blankItem(), name, spec: spec || "", qty: quantity, price }] };
    });
  }

  const preview = calcOrder(draft);

  return (
    <div className="form-view">
      {cropTarget && (
        <CropModal
          imageSrc={cropImageSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
          maxDim={cropTarget.type === "item" ? 120 : 480}
          quality={cropTarget.type === "item" ? 0.6 : 0.7}
        />
      )}
      <section className="form-section">
        <h2>訂單資訊</h2>
        <div className="field-grid">
          <label className="field">
            <span>平台</span>
            <input list="platform-options" value={draft.platform} onChange={(e) => update({ platform: e.target.value })} placeholder="蝦皮 / MOMO / PChome / 淘寶 / 自行輸入" />
            <datalist id="platform-options">{platforms.map((p) => <option key={p} value={p} />)}</datalist>
          </label>
          <label className="field">
            <span>訂單日期</span>
            <input type="date" value={draft.date} onChange={(e) => update({ date: e.target.value })} />
          </label>
          <label className="field">
            <span>訂單編號</span>
            <input value={draft.orderNumber} onChange={(e) => update({ orderNumber: e.target.value })} placeholder="選填" />
          </label>
        </div>

        <label className="field wide note-field">
          <span>訂單備註</span>
          <textarea rows={2} value={draft.note} onChange={(e) => update({ note: e.target.value })} placeholder="選填，例如客服回覆、退換貨紀錄…" />
        </label>

        <div className="image-upload-block">
          <div className="image-upload-head">
            <span><ImagePlus size={14} strokeWidth={2.2} /> 附加圖片（收據、商品照片等，最多 {MAX_IMAGES} 張）</span>
          </div>
          <div className="image-grid">
            {(draft.images || []).map((img) => (
              <div className="image-thumb" key={img.id}>
                <SafeImg src={img.dataUrl} alt="附加圖片" />
                <button className="image-remove" onClick={() => removeImage(img.id)} title="移除圖片"><X size={12} strokeWidth={2.6} /></button>
              </div>
            ))}
            {(draft.images || []).length < MAX_IMAGES && (
              <button type="button" className="image-add-btn" onClick={openOrderImagePicker} disabled={uploading}>
                <ImagePlus size={18} strokeWidth={2} />
                <span>{uploading ? "處理中…" : "新增圖片"}</span>
              </button>
            )}
            {(draft.images || []).length < MAX_IMAGES && (
              <button type="button" className="image-add-btn image-paste-btn" onClick={handlePasteOrderImage} disabled={uploading}>
                <Clipboard size={18} strokeWidth={2} />
                <span>貼上圖片</span>
              </button>
            )}
          </div>
          <input ref={orderImagesInputRef} type="file" accept="image/*" hidden onChange={handleImageInput} />
          <p className="hint">圖片會自動壓縮後以檔案形式存在你目前的帳本資料中，節省空間。若手機上點了沒反應，可以試試看重新整理頁面後再試一次。「貼上圖片」需要先在別的地方複製一張圖片（例如截圖後直接複製），電腦上支援度較好，手機依瀏覽器而定。</p>
        </div>
      </section>

      <section className="form-section">
        <div className="section-head-row">
          <h2><ShoppingBag size={16} strokeWidth={2.2} />商品細項</h2>
          <div className="section-head-actions">
            <button className="btn ghost small" onClick={() => setScanOpen((v) => !v)}>
              <ScanLine size={13} strokeWidth={2.4} />{scanOpen ? "關閉截圖辨識" : "從截圖辨識"}
            </button>
            <button className="btn ghost small" onClick={addItem}><Plus size={13} strokeWidth={2.6} />新增商品</button>
          </div>
        </div>

        {scanOpen && <ScreenshotScanner onRecognized={addItemFromScan} />}

        <div className="item-form-list">
          {draft.items.map((item, idx) => (
            <div className="item-form-row" key={item.id}>
              <span className="item-index mono">{idx + 1}</span>
              <button type="button" className="item-thumb-btn" onClick={() => openItemThumbPicker(item.id)}>
                {item.image ? <SafeImg src={item.image} alt="商品縮圖" /> : <ImagePlus size={15} strokeWidth={2} />}
              </button>
              <button type="button" className="icon-btn tiny" title="貼上剪貼簿圖片" onClick={() => handlePasteItemThumb(item.id)}>
                <Clipboard size={12} strokeWidth={2.4} />
              </button>
              {item.image && (
                <button className="icon-btn tiny" title="移除縮圖" onClick={() => updateItem(item.id, { image: "" })}>
                  <X size={11} strokeWidth={2.6} />
                </button>
              )}
              <input className="item-name" placeholder="商品名稱" value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
              <input className="item-spec" placeholder="規格（選填，例如：白色/M）" value={item.spec || ""} onChange={(e) => updateItem(item.id, { spec: e.target.value })} />
              <input className="item-num" type="number" min="0" placeholder="單價" value={item.price} onChange={(e) => updateItem(item.id, { price: e.target.value })} />
              <input className="item-num" type="number" min="0" placeholder="數量" value={item.qty} onChange={(e) => updateItem(item.id, { qty: e.target.value })} />
              <input list="category-options" className="item-cat" placeholder="分類" value={item.category} onChange={(e) => updateItem(item.id, { category: e.target.value })} />
              <input className="item-link" placeholder="商品連結（選填）" value={item.link} onChange={(e) => updateItem(item.id, { link: e.target.value })} />
              <button className="icon-btn" title="刪除此商品" onClick={() => removeItem(item.id)} disabled={draft.items.length === 1}><X size={14} strokeWidth={2.4} /></button>
            </div>
          ))}
          <datalist id="category-options">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <input ref={itemThumbInputRef} type="file" accept="image/*" hidden onChange={handleItemThumbInput} />
        <p className="hint">分類清單裡沒有想要的選項嗎？直接在分類欄位輸入新的名稱，儲存後就會自動加入清單。商品縮圖不用太清楚，能辨認出來就好，系統會自動壓縮。</p>
      </section>

      <section className="form-section">
        <h2><Truck size={16} strokeWidth={2.2} />運費與折價券</h2>
        <div className="field-grid">
          <label className="field">
            <span>運費</span>
            <input type="number" min="0" placeholder="0" value={draft.shipping} onChange={(e) => update({ shipping: e.target.value })} />
          </label>
          <label className="field">
            <span>配送方式</span>
            <input list="shipping-options" value={draft.shippingMethod} onChange={(e) => update({ shippingMethod: e.target.value })} placeholder="例如：超商取貨、宅配" />
            <datalist id="shipping-options">{shippingMethods.map((s) => <option key={s} value={s} />)}</datalist>
          </label>
        </div>
        <label className="toggle-row">
          <input type="checkbox" checked={showCoupons} onChange={(e) => setShowCoupons(e.target.checked)} />
          <span>這筆訂單有使用折價券／回饋代幣</span>
        </label>
        {showCoupons && (
          <>
            <div className="coupon-grid">
              <CouponEditor title="賣場券" coupon={draft.shopCoupon} onChange={(p) => updateCoupon("shopCoupon", p)} />
              <CouponEditor title="平台券" coupon={draft.platformCoupon} onChange={(p) => updateCoupon("platformCoupon", p)} />
              <TokenDiscountEditor tokenDiscount={draft.tokenDiscount} onChange={(p) => updateCoupon("tokenDiscount", p)} />
            </div>
            <p className="hint">固定金額／折數／平台代幣折抵，都會直接折抵「實付金額」；賣場券、平台券裡的「回饋代幣」模式則不同，它是這筆訂單額外賺到、可以留著花在未來訂單的代幣，不會折抵這筆的實付金額，只會反映在下方的「實際成本」。</p>
          </>
        )}
      </section>

      <section className="form-section">
        <h2><CreditCard size={16} strokeWidth={2.2} />付款方式</h2>
        <div className="field-grid">
          <label className="field">
            <span>付款方式</span>
            <select value={draft.payment.method} onChange={(e) => update({ payment: { ...draft.payment, method: e.target.value } })}>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          {draft.payment.method === "信用卡" && (
            <>
              <label className="field">
                <span>發卡銀行</span>
                <input
                  list="bank-options"
                  value={draft.payment.bank}
                  onChange={(e) => update({ payment: { ...draft.payment, bank: e.target.value } })}
                  placeholder="例如：國泰世華"
                />
                <datalist id="bank-options">{banks.map((b) => <option key={b} value={b} />)}</datalist>
              </label>
              <label className="field">
                <span>卡片名稱</span>
                <input
                  list="card-name-options"
                  value={draft.payment.cardName || ""}
                  onChange={(e) => update({ payment: { ...draft.payment, cardName: e.target.value } })}
                  placeholder="例如：現金回饋卡"
                />
                <datalist id="card-name-options">{cardNames.map((c) => <option key={c} value={c} />)}</datalist>
              </label>
            </>
          )}
          {draft.payment.method === "其他" && (
            <label className="field">
              <span>付款方式說明</span>
              <input value={draft.payment.otherLabel} onChange={(e) => update({ payment: { ...draft.payment, otherLabel: e.target.value } })} placeholder="例如：LINE Pay" />
            </label>
          )}
        </div>
        {draft.payment.method === "信用卡" && (
          <>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={!!draft.payment.installment.enabled}
                onChange={(e) => update({ payment: { ...draft.payment, installment: { ...draft.payment.installment, enabled: e.target.checked } } })}
              />
              <span>是否分期</span>
            </label>
            {draft.payment.installment.enabled && (
              <div className="field-grid">
                <label className="field">
                  <span>分幾期</span>
                  <input
                    type="number"
                    min="2"
                    placeholder="例如：3"
                    value={draft.payment.installment.periods}
                    onChange={(e) => update({ payment: { ...draft.payment, installment: { ...draft.payment.installment, periods: e.target.value } } })}
                  />
                </label>
              </div>
            )}
            {draft.payment.installment.enabled && (
              <p className="hint">訂單本身的金額不會變，統計頁的「每月支出」會把這筆金額拆成每期分攤到對應月份（除不盡的零頭算在第一期）。</p>
            )}
          </>
        )}
      </section>

      <section className="form-section">
        <div className="section-head-row">
          <h2><Gift size={16} strokeWidth={2.2} />回饋</h2>
          <button className="btn ghost small" onClick={addReward}><Plus size={13} strokeWidth={2.6} />新增回饋</button>
        </div>
        {draft.rewards.length === 0 && <p className="hint">這筆訂單目前沒有設定任何回饋。</p>}
        <div className="reward-list">
          {draft.rewards.map((r) => (
            <div className="reward-row" key={r.id}>
              <select value={r.type} onChange={(e) => updateReward(r.id, { type: e.target.value })}>
                {REWARD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {r.type === "自訂" && <input placeholder="回饋名稱" value={r.label} onChange={(e) => updateReward(r.id, { label: e.target.value })} />}
              <div className="reward-mode-switch">
                <button type="button" className={(r.mode || "percent") === "percent" ? "active" : ""} onClick={() => updateReward(r.id, { mode: "percent" })}>%</button>
                <button type="button" className={r.mode === "fixed" ? "active" : ""} onClick={() => updateReward(r.id, { mode: "fixed" })}>$</button>
              </div>
              {r.mode === "fixed" ? (
                <input type="number" min="0" step="1" className="item-num" placeholder="回饋金額" value={r.fixedAmount} onChange={(e) => updateReward(r.id, { fixedAmount: e.target.value })} />
              ) : (
                <>
                  <input type="number" min="0" step="0.1" className="item-num" placeholder="百分比" value={r.percent} onChange={(e) => updateReward(r.id, { percent: e.target.value })} />
                  <span className="pct-sign">%</span>
                </>
              )}
              <button className="icon-btn" title="刪除此回饋" onClick={() => removeReward(r.id)}><X size={14} strokeWidth={2.4} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="form-section preview-section">
        <h2><CreditCard size={16} strokeWidth={2.2} />試算結果</h2>
        <div className="ledger-lines">
          <LedgerLine label="商品小計" value={preview.subtotal} />
          {preview.shopDiscount > 0 && <LedgerLine label="賣場券折抵" value={-preview.shopDiscount} />}
          {preview.platformDiscount > 0 && <LedgerLine label="平台券折抵" value={-preview.platformDiscount} />}
          {preview.tokenDiscountAmount > 0 && <LedgerLine label={`${(draft.tokenDiscount && draft.tokenDiscount.label) || "平台代幣"}折抵`} value={-preview.tokenDiscountAmount} />}
          <LedgerLine label="運費" value={preview.shipping} />
          <LedgerLine label="實付金額" value={preview.finalPaid} strong />
          {preview.shopTokenAmount > 0 && (
            <LedgerLine
              label={`回饋・${(draft.shopCoupon && draft.shopCoupon.label) || "賣場回饋代幣"}`}
              value={-preview.shopTokenAmount}
              muted
            />
          )}
          {preview.platformTokenAmount > 0 && (
            <LedgerLine
              label={`回饋・${(draft.platformCoupon && draft.platformCoupon.label) || "平台回饋代幣"}`}
              value={-preview.platformTokenAmount}
              muted
            />
          )}
          {preview.rewards.map((r, idx) => (
            <LedgerLine key={idx} label={`回饋・${r.type === "自訂" ? r.label || "自訂" : r.type}`} value={-r.amount} muted />
          ))}
          <LedgerLine label="實際成本" value={preview.actualCost} highlight />
        </div>
      </section>

      <div className="form-footer">
        <button className="btn ghost" onClick={onCancel}>取消</button>
        <button className="btn primary" onClick={onSave}>{isEditing ? "儲存變更" : "存入帳本"}</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  截圖辨識：框選訂單截圖範圍，自動判讀商品名稱／數量／單價              */
/* ------------------------------------------------------------------ */

function ScreenshotScanner({ onRecognized }) {
  const [imageSrc, setImageSrc] = useState("");
  const [selection, setSelection] = useState(null); // {x,y,w,h} in displayed px
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [rawOcrText, setRawOcrText] = useState("");
  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const startPoint = useRef(null);
  const uploadInputRef = useRef(null);

  function handleUpload(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target.result);
      setSelection(null);
      setMessage("");
    };
    reader.readAsDataURL(file);
  }

  async function handlePasteScreenshot() {
    const blob = await pasteImageFromClipboard();
    if (!blob) return;
    try {
      const dataUrl = await readFileAsDataURL(blob);
      setImageSrc(dataUrl);
      setSelection(null);
      setMessage("");
    } catch (err) {
      window.alert("圖片讀取失敗，請改用「上傳訂單截圖」試試看。");
    }
  }

  function pointFromEvent(e) {
    const rect = wrapRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.min(Math.max(clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(clientY - rect.top, 0), rect.height),
    };
  }

  function onPointerDown(e) {
    if (!imgRef.current) return;
    const p = pointFromEvent(e);
    startPoint.current = p;
    setSelection({ x: p.x, y: p.y, w: 0, h: 0 });
    setDragging(true);
  }
  function onPointerMove(e) {
    if (!dragging || !startPoint.current) return;
    const p = pointFromEvent(e);
    const x = Math.min(p.x, startPoint.current.x);
    const y = Math.min(p.y, startPoint.current.y);
    const w = Math.abs(p.x - startPoint.current.x);
    const h = Math.abs(p.y - startPoint.current.y);
    setSelection({ x, y, w, h });
  }
  function onPointerUp() {
    setDragging(false);
  }

  async function handleRecognize() {
    if (!imgRef.current || !selection || selection.w < 12 || selection.h < 12) {
      setMessage("請先在截圖上拖曳框選一項商品的範圍（框大一點，包含縮圖、名稱、數量、價格）。");
      return;
    }
    setScanning(true);
    setMessage("辨識中…");
    setRawOcrText("");
    try {
      const cropDataUrl = cropImageElement(imgRef.current, selection, 640, 0.85);
      const ocrDataUrl = cropImageElement(imgRef.current, selection, 1400, 0.92);
      const result = await recognizeItemFromImage(cropDataUrl, (statusText) => setMessage(statusText), ocrDataUrl);
      onRecognized({ name: result.name, spec: result.spec, quantity: result.quantity, price: result.price });
      const sourceNote = result.source ? `（來源：${result.source}）` : "";
      const specNote = result.spec ? `，規格：${result.spec}` : "";
      setMessage(`已加入：${result.name || "（未辨識出名稱）"} × ${result.quantity}，單價 ${fmt(result.price)}${specNote}${sourceNote}，請確認欄位是否正確；商品縮圖請自己另外上傳。`);
      if (result.rawOcrText) setRawOcrText(result.rawOcrText);
      setSelection(null);
    } catch (err) {
      setMessage("三種辨識方式都失敗了，請確認框選範圍是否包含清楚的文字，或改為手動輸入。你也可以到「設定」檢查 API 金鑰是否正確。");
    }
    setScanning(false);
  }

  return (
    <div className="scanner-block">
      <input ref={uploadInputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
      {!imageSrc ? (
        <div className="scanner-upload-row">
          <button type="button" className="scanner-upload" onClick={() => uploadInputRef.current && uploadInputRef.current.click()}>
            <ScanLine size={20} strokeWidth={1.8} />
            <span>上傳訂單截圖</span>
          </button>
          <button type="button" className="scanner-upload" onClick={handlePasteScreenshot}>
            <Clipboard size={20} strokeWidth={1.8} />
            <span>貼上截圖</span>
          </button>
        </div>
      ) : (
        <>
          <p className="hint">在截圖上拖曳框選「一項商品」的範圍（名稱、規格、數量、價格框進去即可，不用框縮圖），再按下方按鈕辨識；如果一張截圖有好幾項商品，請一次只框一項，完成後可以再框選下一項繼續新增。商品縮圖辨識準確度較低，已經拿掉，請用商品列表旁的「選擇圖片／拍照／貼上」自己加。</p>
          <div
            className="scanner-canvas"
            ref={wrapRef}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          >
            <img ref={imgRef} src={imageSrc} alt="訂單截圖" draggable={false} />
            {selection && (
              <div
                className="scanner-selection"
                style={{ left: selection.x, top: selection.y, width: selection.w, height: selection.h }}
              />
            )}
          </div>
          <div className="settings-actions-row">
            <button className="btn primary small" onClick={handleRecognize} disabled={scanning}>
              {scanning ? <Loader2 size={13} strokeWidth={2.4} className="spin" /> : <Crop size={13} strokeWidth={2.4} />}
              {scanning ? "辨識中…" : "辨識選取範圍並加入商品"}
            </button>
            <button className="btn ghost small" onClick={() => { setImageSrc(""); setSelection(null); setMessage(""); }}>
              換一張截圖
            </button>
          </div>
          {message && <p className="hint scanner-message">{message}</p>}
          {rawOcrText && (
            <details className="ocr-raw-text">
              <summary>查看本機文字辨識的原始結果（除錯用，如果猜的欄位不準，把這段截圖給開發者參考）</summary>
              <pre>{rawOcrText}</pre>
            </details>
          )}
        </>
      )}
    </div>
  );
}

function CouponEditor({ title, coupon, onChange }) {
  return (
    <div className={`coupon-card ${coupon.enabled ? "on" : ""}`}>
      <label className="coupon-toggle">
        <input type="checkbox" checked={coupon.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} />
        <span>{title}</span>
      </label>
      {coupon.enabled && (
        <div className="coupon-body">
          <div className="coupon-type-switch">
            <button className={coupon.type === "fixed" ? "active" : ""} onClick={() => onChange({ type: "fixed" })} type="button">固定金額</button>
            <button className={coupon.type === "percent" ? "active" : ""} onClick={() => onChange({ type: "percent" })} type="button">折數</button>
            <button className={coupon.type === "token" ? "active" : ""} onClick={() => onChange({ type: "token" })} type="button">回饋代幣</button>
          </div>

          {coupon.type === "fixed" && (
            <label className="field">
              <span>折抵金額</span>
              <input type="number" min="0" value={coupon.value} onChange={(e) => onChange({ value: e.target.value })} placeholder="200" />
            </label>
          )}

          {coupon.type === "percent" && (
            <>
              <label className="field">
                <span>折數（例：92 代表 92 折）</span>
                <input type="number" min="0" value={coupon.value} onChange={(e) => onChange({ value: e.target.value })} placeholder="92" />
              </label>
              <label className="field">
                <span>折抵上限（選填）</span>
                <input type="number" min="0" value={coupon.cap} onChange={(e) => onChange({ cap: e.target.value })} placeholder="例如：最高折200" />
              </label>
            </>
          )}

          {coupon.type === "token" && (
            <>
              <label className="field">
                <span>代幣名稱</span>
                <input value={coupon.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="例如：蝦幣、MO幣、LINE POINTS" />
              </label>
              <label className="field">
                <span>回饋比例（例：3 代表 3%）</span>
                <input type="number" min="0" value={coupon.value} onChange={(e) => onChange({ value: e.target.value })} placeholder="3" />
              </label>
              <label className="field">
                <span>回饋上限（選填）</span>
                <input type="number" min="0" value={coupon.cap} onChange={(e) => onChange({ cap: e.target.value })} placeholder="例如：最高回饋100蝦幣" />
              </label>
              <p className="hint">回饋代幣不會影響實付金額，只會反映在實際成本上（就像蝦皮回饋蝦幣、MOMO回饋MO幣一樣，錢一樣要先付，代幣是之後才能折抵下一筆的回饋）。</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TokenDiscountEditor({ tokenDiscount, onChange }) {
  const td = tokenDiscount || blankTokenDiscount();
  return (
    <div className={`coupon-card ${td.enabled ? "on" : ""}`}>
      <label className="coupon-toggle">
        <input type="checkbox" checked={td.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} />
        <span>平台代幣折抵</span>
      </label>
      {td.enabled && (
        <div className="coupon-body">
          <label className="field">
            <span>代幣名稱</span>
            <input value={td.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="例如：蝦幣、MO幣、LINE POINTS" />
          </label>
          <label className="field">
            <span>折抵金額</span>
            <input type="number" min="0" value={td.value} onChange={(e) => onChange({ value: e.target.value })} placeholder="例如：50" />
          </label>
          <p className="hint">這是拿你手上已經有的代幣直接折抵這筆訂單，會減少「實付金額」（跟賣場券/平台券裡的「回饋代幣」不同，那個是賺新代幣，這個是花舊代幣）。</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  統計                                                                */
/* ------------------------------------------------------------------ */

function SearchView({ orders, platformColors, onOpenOrder }) {
  const [mode, setMode] = useState("name"); // "name" | "amount"
  const [nameQuery, setNameQuery] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const results = useMemo(() => {
    if (mode === "name") {
      const q = nameQuery.trim().toLowerCase();
      if (!q) return [];
      return orders
        .map((o) => {
          const matchedItems = (o.items || []).filter(
            (i) => (i.name || "").toLowerCase().includes(q) || (i.spec || "").toLowerCase().includes(q)
          );
          if (matchedItems.length === 0) return null;
          return { order: o, matchedItems, calc: calcOrder(o) };
        })
        .filter(Boolean)
        .sort((a, b) => (b.order.date || "").localeCompare(a.order.date || ""));
    }
    const min = minAmount === "" ? -Infinity : Number(minAmount);
    const max = maxAmount === "" ? Infinity : Number(maxAmount);
    if (minAmount === "" && maxAmount === "") return [];
    return orders
      .map((o) => ({ order: o, matchedItems: o.items || [], calc: calcOrder(o) }))
      .filter(({ calc }) => calc.finalPaid >= min && calc.finalPaid <= max)
      .sort((a, b) => b.calc.finalPaid - a.calc.finalPaid);
  }, [orders, mode, nameQuery, minAmount, maxAmount]);

  return (
    <div className="search-view">
      <div className="mode-switch">
        <button className={mode === "name" ? "active" : ""} onClick={() => setMode("name")}>依商品名稱</button>
        <button className={mode === "amount" ? "active" : ""} onClick={() => setMode("amount")}>依金額範圍</button>
      </div>

      {mode === "name" ? (
        <div className="search-input-row">
          <Search size={16} strokeWidth={2.2} />
          <input value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} placeholder="輸入商品名稱或規格關鍵字，例如：乳液" />
        </div>
      ) : (
        <div className="search-amount-row">
          <input type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="最低金額（選填）" />
          <span>～</span>
          <input type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="最高金額（選填）" />
        </div>
      )}
      {mode === "amount" && (
        <p className="hint search-hint">例如只填最低金額 10000、最高留空，代表搜尋「1萬元以上」；兩個都填代表區間，例如 2000～7000。</p>
      )}

      {results.length === 0 ? (
        <p className="hint search-empty-hint">
          {mode === "name"
            ? (nameQuery ? "沒有找到符合的商品。" : "輸入商品名稱開始搜尋。")
            : ((minAmount || maxAmount) ? "沒有符合金額範圍的訂單。" : "設定金額範圍開始搜尋。")}
        </p>
      ) : (
        <ul className="search-result-list">
          {results.map(({ order, matchedItems, calc }) => (
            <li key={order.id} className="search-result-item" onClick={() => onOpenOrder(order.id)}>
              <span className="search-result-color" style={{ background: colorForPlatform(order.platform, platformColors) }} />
              <div className="search-result-main">
                <div className="search-result-top">
                  <span className="search-result-platform">{order.platform}</span>
                  <span className="search-result-date">{order.date}</span>
                </div>
                <p className="search-result-name">
                  {(mode === "name" ? matchedItems : order.items || []).map((i) => i.name || "（未命名商品）").join("、")}
                </p>
              </div>
              <span className="mono search-result-amount">{fmt(calc.finalPaid)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatsView({ stats, statsMode, setStatsMode, periodLabel, shiftRef, refDate, platformColors }) {
  const [chartMode, setChartMode] = useState("date");
  const [expandedPayments, setExpandedPayments] = useState([]);
  const [openTag, setOpenTag] = useState(null); // { date, index } 目前被點開顯示金額提示的標籤
  const [calendarScale, setCalendarScale] = useState(1);
  const MAX_VISIBLE_TAGS = 2;

  const platformEntries = Object.entries(stats.byPlatform).sort((a, b) => b[1] - a[1]);
  const categoryEntries = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  const rewardEntries = Object.entries(stats.byReward).sort((a, b) => b[1] - a[1]);
  const paymentEntries = Object.entries(stats.byPayment || {}).sort((a, b) => b[1].total - a[1].total);
  const maxPlatform = Math.max(1, ...platformEntries.map((e) => e[1]));
  const maxCategory = Math.max(1, ...categoryEntries.map((e) => e[1]));

  const dateLabel = statsMode === "month" ? "依日期" : "依月份";

  const dateEntries = useMemo(() => {
    if (statsMode === "month") {
      return Object.entries(stats.byDay || {})
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([key, val]) => [`${parseInt(key.slice(8, 10), 10)}日`, val]);
    }
    return Object.entries(stats.byMonth || {})
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([key, val]) => [`${parseInt(key.slice(5, 7), 10)}月`, val]);
  }, [stats, statsMode]);

  function togglePayment(method) {
    setExpandedPayments((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]));
  }

  // 依日期／依分類 走長條圖
  const barData = useMemo(() => {
    const entries = chartMode === "category" ? categoryEntries : dateEntries;
    return entries.filter(([, v]) => v > 0).map(([name, size]) => ({ name, size: Math.round(size) }));
  }, [chartMode, stats, dateEntries]);

  const barColors = useMemo(
    () => (chartMode === "category" ? barData.map((_, i) => CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]) : barData.map(() => "var(--primary)")),
    [barData, chartMode]
  );

  // 依平台走圓餅圖，看各平台佔比
  const platformPieData = useMemo(
    () => platformEntries.filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })),
    [platformEntries]
  );

  // 月曆檢視：把當月每一天需要的格子（含前後補位的空白格）跟當天訂單標籤排好
  const calendarCells = useMemo(() => {
    if (statsMode !== "month") return [];
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = firstDay.getDay(); // 0=週日
    const cells = [];
    for (let i = 0; i < leadingBlanks; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ dateKey, dayNum: d, entries: (stats.byDayOrders && stats.byDayOrders[dateKey]) || [] });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [stats, statsMode, refDate]);

  useEffect(() => {
    if (statsMode === "year" && chartMode === "calendar") setChartMode("date");
  }, [statsMode, chartMode]);

  useEffect(() => {
    setOpenTag(null);
  }, [refDate, statsMode]);

  return (
    <div className="stats-view">
      <div className="stats-toolbar">
        <div className="mode-switch">
          <button className={statsMode === "month" ? "active" : ""} onClick={() => setStatsMode("month")}>月統計</button>
          <button className={statsMode === "year" ? "active" : ""} onClick={() => setStatsMode("year")}>年統計</button>
        </div>
        <div className="period-nav">
          <button className="icon-btn" onClick={() => shiftRef(-1)}><ChevronLeft size={16} strokeWidth={2.4} /></button>
          <span className="period-label mono">{periodLabel}</span>
          <button className="icon-btn" onClick={() => shiftRef(1)}><ChevronRight size={16} strokeWidth={2.4} /></button>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard label="總訂單數" value={stats.count} isCount />
        <SummaryCard label="總實付" value={fmt(stats.paidSum)} />
        <SummaryCard label="折價券省下" value={fmt(stats.discountSum)} accent />
        <SummaryCard label="運費支出" value={fmt(stats.shippingSum)} />
        <SummaryCard label="回饋總額" value={fmt(stats.rewardSum)} accent />
        <SummaryCard label="實際成本" value={fmt(stats.costSum)} highlight />
      </div>

      <div className="breakdown-grid">
        <div className="breakdown-card">
          <h3>各平台花費</h3>
          {platformEntries.length === 0 ? <p className="hint">這段期間沒有資料。</p> : (
            <ul className="bar-list">
              {platformEntries.map(([name, val]) => (
                <li key={name}>
                  <span className="bar-label">{name}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${(val / maxPlatform) * 100}%`, background: colorForPlatform(name, platformColors) }} /></div>
                  <span className="bar-value mono">{fmt(val)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="breakdown-card">
          <h3>各分類花費</h3>
          {categoryEntries.length === 0 ? <p className="hint">這段期間沒有資料。</p> : (
            <ul className="bar-list">
              {categoryEntries.map(([name, val], i) => (
                <li key={name}>
                  <span className="bar-label">{name}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${(val / maxCategory) * 100}%`, background: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length] }} /></div>
                  <span className="bar-value mono">{fmt(val)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="breakdown-card">
          <h3>各種回饋金額</h3>
          {rewardEntries.length === 0 ? <p className="hint">這段期間沒有回饋紀錄。</p> : (
            <ul className="reward-summary-list">
              {rewardEntries.map(([name, val]) => (
                <li key={name}><span>{name}</span><span className="mono">{fmt(val)}</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className="breakdown-card">
          <h3>各付款方式</h3>
          {paymentEntries.length === 0 ? <p className="hint">這段期間沒有資料。</p> : (
            <ul className="payment-list">
              {paymentEntries.map(([method, info]) => {
                const bankEntries = Object.entries(info.banks || {}).sort((a, b) => b[1].total - a[1].total);
                const hasBanks = method === "信用卡" && bankEntries.length > 0;
                const isOpen = expandedPayments.includes(method);
                return (
                  <li key={method} className="payment-item">
                    <button
                      className={`payment-row-head ${hasBanks ? "clickable" : ""}`}
                      onClick={() => hasBanks && togglePayment(method)}
                    >
                      <span className="payment-method-name">{method}</span>
                      <span className="payment-row-trailing">
                        <span className="mono">{fmt(info.total)}</span>
                        {hasBanks && <ChevronDown size={15} className={`chevron ${isOpen ? "open" : ""}`} />}
                      </span>
                    </button>
                    {hasBanks && isOpen && (
                      <ul className="payment-sub-list">
                        {bankEntries.map(([bank, bankInfo]) => {
                          const cardEntries = Object.entries(bankInfo.cards || {}).sort((a, b) => b[1] - a[1]);
                          const hasCards = cardEntries.length > 0 && !(cardEntries.length === 1 && cardEntries[0][0] === "未填寫卡片");
                          const bankKey = `${method}::${bank}`;
                          const bankOpen = expandedPayments.includes(bankKey);
                          return (
                            <li key={bank} className="payment-sub-item">
                              <button
                                className={`payment-sub-row-head ${hasCards ? "clickable" : ""}`}
                                onClick={() => hasCards && togglePayment(bankKey)}
                              >
                                <span>{bank}</span>
                                <span className="payment-row-trailing">
                                  <span className="mono">{fmt(bankInfo.total)}</span>
                                  {hasCards && <ChevronDown size={13} className={`chevron ${bankOpen ? "open" : ""}`} />}
                                </span>
                              </button>
                              {hasCards && bankOpen && (
                                <ul className="payment-sub-sub-list">
                                  {cardEntries.map(([card, val]) => (
                                    <li key={card}><span>{card}</span><span className="mono">{fmt(val)}</span></li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="breakdown-card treemap-card">
          <div className="section-head-row">
            <h3>花費統計圖</h3>
            <div className="mode-switch small">
              <button className={chartMode === "date" ? "active" : ""} onClick={() => setChartMode("date")}>{dateLabel}</button>
              <button className={chartMode === "platform" ? "active" : ""} onClick={() => setChartMode("platform")}>依平台</button>
              <button className={chartMode === "category" ? "active" : ""} onClick={() => setChartMode("category")}>依分類</button>
              {statsMode === "month" && (
                <button className={chartMode === "calendar" ? "active" : ""} onClick={() => setChartMode("calendar")}>月曆</button>
              )}
            </div>
          </div>

          {chartMode === "calendar" ? (
            <div className="calendar-wrap" onClick={() => setOpenTag(null)}>
              <div className="calendar-size-control" onClick={(e) => e.stopPropagation()}>
                <span>月曆大小</span>
                <button type="button" className="icon-btn-ghost" disabled={calendarScale <= 0.7} onClick={() => setCalendarScale((s) => Math.max(0.7, +(s - 0.1).toFixed(1)))}>−</button>
                <button type="button" className="icon-btn-ghost" disabled={calendarScale >= 1.6} onClick={() => setCalendarScale((s) => Math.min(1.6, +(s + 0.1).toFixed(1)))}>＋</button>
              </div>
              <div className="calendar-scale-inner" style={{ maxWidth: `${560 * calendarScale}px`, fontSize: `${calendarScale}em` }}>
                <div className="calendar-weekday-row">
                  {["日", "一", "二", "三", "四", "五", "六"].map((w) => <span key={w}>{w}</span>)}
                </div>
                <div className="calendar-grid">
                  {calendarCells.map((cell, idx) => {
                    const visibleEntries = cell ? cell.entries.slice(0, MAX_VISIBLE_TAGS) : [];
                    const overflowEntries = cell ? cell.entries.slice(MAX_VISIBLE_TAGS) : [];
                    const overflowKey = cell ? `${cell.dateKey}-more` : null;
                    const overflowOpen = openTag === overflowKey;
                    return (
                      <div key={idx} className={`calendar-cell ${cell ? "" : "empty"}`}>
                        {cell && (
                          <>
                            <span className="calendar-daynum">{cell.dayNum}</span>
                            <div className="calendar-tags">
                              {visibleEntries.map((entry, i) => {
                                const tagKey = `${cell.dateKey}-${i}`;
                                const isOpen = openTag === tagKey;
                                return (
                                  <div key={tagKey} className="calendar-tag-wrap">
                                    <button
                                      type="button"
                                      className="calendar-tag"
                                      style={{ background: colorForPlatform(entry.platform, platformColors) }}
                                      onClick={(e) => { e.stopPropagation(); setOpenTag(isOpen ? null : tagKey); }}
                                    >
                                      {entry.label}
                                    </button>
                                    {isOpen && (
                                      <div className="calendar-tooltip" onClick={(e) => e.stopPropagation()}>
                                        <b>{cell.dayNum}日</b>
                                        <span>{entry.itemNames.join("、")}</span>
                                        <span className="mono">{fmt(entry.amount)}</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {overflowEntries.length > 0 && (
                                <div className="calendar-tag-wrap">
                                  <button
                                    type="button"
                                    className="calendar-tag calendar-tag-more"
                                    onClick={(e) => { e.stopPropagation(); setOpenTag(overflowOpen ? null : overflowKey); }}
                                  >
                                    +{overflowEntries.length}
                                  </button>
                                  {overflowOpen && (
                                    <div className="calendar-tooltip" onClick={(e) => e.stopPropagation()}>
                                      <b>{cell.dayNum}日 其餘 {overflowEntries.length} 筆</b>
                                      {overflowEntries.map((entry, i) => (
                                        <span key={i}>{entry.label}：{fmt(entry.amount)}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : chartMode === "platform" ? (
            platformPieData.length === 0 ? (
              <p className="hint">這段期間沒有資料。</p>
            ) : (
              <div className="treemap-wrap">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={96}
                      paddingAngle={0}
                      startAngle={90}
                      endAngle={-270}
                      label={PieSliceLabel}
                      labelLine={{ stroke: "var(--border)" }}
                      animationDuration={300}
                    >
                      {platformPieData.map((entry, i) => (
                        <Cell key={entry.name} fill={colorForPlatform(entry.name, platformColors)} stroke="var(--card)" strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => fmt(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )
          ) : barData.length === 0 ? (
            <p className="hint">這段期間沒有資料。</p>
          ) : (
            <div className="treemap-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 10, right: 12, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} interval={0} angle={barData.length > 12 ? -45 : 0} textAnchor={barData.length > 12 ? "end" : "middle"} height={barData.length > 12 ? 46 : 24} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-soft)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} width={54} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
                  <Tooltip formatter={(value) => fmt(value)} cursor={{ fill: "var(--bg)" }} />
                  <Bar dataKey="size" radius={[6, 6, 0, 0]} maxBarSize={44} animationDuration={300}>
                    {barData.map((entry, i) => (
                      <Cell key={entry.name} style={{ fill: barColors[i] }} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PIE_RADIAN = Math.PI / 180;
function PieSliceLabel({ cx, cy, midAngle, outerRadius, percent, name }) {
  if (percent < 0.03) return null;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * PIE_RADIAN);
  const y = cy + radius * Math.sin(-midAngle * PIE_RADIAN);
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fill: "var(--text-soft)", fontSize: 11, fontFamily: "'Noto Sans TC', sans-serif" }}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function SummaryCard({ label, value, accent, highlight, isCount }) {
  return (
    <div className={`summary-card ${highlight ? "highlight-card" : ""}`}>
      <span className="summary-label">{label}</span>
      <span className={`summary-value ${isCount ? "" : "mono"} ${accent ? "accent" : ""}`}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  設定：主題（顏色＋字型）與資料備份                                    */
/* ------------------------------------------------------------------ */

function EmojiGrid({ current, onPick }) {
  return (
    <div className="emoji-grid">
      {EMOJI_CHOICES.map((e, i) => (
        <button
          key={i}
          className={`emoji-swatch ${current === e ? "active" : ""}`}
          onClick={() => onPick(e)}
          title={e || "無"}
        >
          {e || "—"}
        </button>
      ))}
    </div>
  );
}

function OptionListManager({ title, options, onChange, placeholder }) {
  const [newVal, setNewVal] = useState("");

  function addOption() {
    const v = newVal.trim();
    if (!v || options.includes(v)) { setNewVal(""); return; }
    onChange([...options, v]);
    setNewVal("");
  }
  function removeOption(idx) {
    onChange(options.filter((_, i) => i !== idx));
  }
  function moveOption(idx, dir) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= options.length) return;
    const next = [...options];
    const tmp = next[idx];
    next[idx] = next[newIdx];
    next[newIdx] = tmp;
    onChange(next);
  }

  return (
    <div className="option-manager">
      <p className="option-manager-title">{title}</p>
      {options.length === 0 ? (
        <p className="hint">目前沒有任何選項，之後在表單裡填新的值、儲存後會自動加進來，也可以直接在下面手動新增。</p>
      ) : (
        <ul className="option-manager-list">
          {options.map((opt, idx) => (
            <li key={opt}>
              <span className="option-manager-name">{opt}</span>
              <div className="option-manager-actions">
                <button type="button" className="icon-btn tiny" disabled={idx === 0} onClick={() => moveOption(idx, -1)} title="往前移">
                  <ChevronUp size={13} strokeWidth={2.4} />
                </button>
                <button type="button" className="icon-btn tiny" disabled={idx === options.length - 1} onClick={() => moveOption(idx, 1)} title="往後移">
                  <ChevronDown size={13} strokeWidth={2.4} />
                </button>
                <button type="button" className="icon-btn tiny" onClick={() => removeOption(idx)} title="移除">
                  <X size={13} strokeWidth={2.6} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="option-manager-add">
        <input
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          placeholder={placeholder || "新增選項"}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOption(); } }}
        />
        <button type="button" className="btn ghost small" onClick={addOption}>新增</button>
      </div>
    </div>
  );
}

function SettingsView({
  allThemes, themeId, activeTheme, onSelectTheme, onSaveCustomTheme, onDeleteCustomTheme,
  onImportTheme, onExportTheme, fontId, customFontName, onChangeFont, onChangeCustomFontName,
  fontScale, onChangeFontScale,
  emojiSettings, onChangeTitleEmoji, onChangeTabEmoji, titleAlign, onChangeTitleAlign, headingWeight, onChangeHeadingWeight,
  onExportBackup, onImportBackup,
  platforms, categories, shippingMethods, banks, cardNames,
  onChangePlatforms, onChangeCategories, onChangeShippingMethods, onChangeBanks, onChangeCardNames,
  platformColors, onChangePlatformColors,
}) {
  const [draftColors, setDraftColors] = useState(activeTheme.colors);
  const [draftName, setDraftName] = useState("");
  const [importText, setImportText] = useState("");
  const themeFileRef = useRef(null);
  const backupFileRef = useRef(null);
  const [localFontName, setLocalFontName] = useState(customFontName);
  const [emojiPickerFor, setEmojiPickerFor] = useState(null); // "title" | "tab:list" | "tab:form" | ...
  const [anthropicKey, setAnthropicKey] = useState(() => localStorage.getItem("ledger-key-anthropic") || "");
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem("ledger-key-openai") || "");
  const [openaiModel, setOpenaiModel] = useState(() => localStorage.getItem("ledger-openai-model") || "gpt-4o-mini");
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("ledger-key-gemini") || "");
  const [geminiModel, setGeminiModel] = useState(() => localStorage.getItem("ledger-gemini-model") || "gemini-2.0-flash");
  const [keySaved, setKeySaved] = useState(false);

  function saveApiKeys() {
    localStorage.setItem("ledger-key-anthropic", anthropicKey.trim());
    localStorage.setItem("ledger-key-openai", openaiKey.trim());
    localStorage.setItem("ledger-openai-model", openaiModel.trim() || "gpt-4o-mini");
    localStorage.setItem("ledger-key-gemini", geminiKey.trim());
    localStorage.setItem("ledger-gemini-model", geminiModel.trim() || "gemini-2.0-flash");
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  }

  function resetDraftFromActive() {
    setDraftColors(activeTheme.colors);
  }

  async function handleThemeFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      onImportTheme(JSON.parse(text));
    } catch (err) {
      window.alert("主題檔案讀取失敗，請確認檔案格式正確。");
    }
  }
  function applyImportText() {
    try {
      onImportTheme(JSON.parse(importText));
      setImportText("");
    } catch (err) {
      window.alert("貼上的主題碼格式不正確，請確認是完整的 JSON 內容。");
    }
  }
  async function handleBackupFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      onImportBackup(JSON.parse(text));
    } catch (err) {
      window.alert("備份檔讀取失敗，請確認檔案格式正確。");
    }
  }

  return (
    <div className="settings-view">
      <section className="form-section">
        <h2><Palette size={16} strokeWidth={2.2} />主題色彩</h2>
        <div className="theme-swatches">
          {allThemes.map((t) => (
            <div key={t.id} className="swatch-wrap">
              <button
                className={`swatch ${t.id === themeId ? "selected" : ""}`}
                style={{ background: t.colors.primary }}
                onClick={() => onSelectTheme(t.id)}
                title={t.name}
              >
                {t.id === themeId && <Check size={16} strokeWidth={3} color="#fff" />}
              </button>
              <span className="swatch-name">{t.name}</span>
              {!["peach", "line-green", "sky", "grape", "charcoal"].includes(t.id) && (
                <button className="swatch-remove" onClick={() => onDeleteCustomTheme(t.id)} title="刪除自訂主題">
                  <X size={10} strokeWidth={3} />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="hint">點選色票即可立即套用整組配色（背景、卡片、文字、強調色都會一起換）。</p>
      </section>

      <section className="form-section">
        <h2><Type size={16} strokeWidth={2.2} />自訂主題色彩</h2>
        <div className="color-field-grid">
          {COLOR_FIELDS.map((f) => (
            <label className="color-field" key={f.key}>
              <span>{f.label}</span>
              <div className="color-field-row">
                <input
                  type="color"
                  value={draftColors[f.key]}
                  onChange={(e) => setDraftColors({ ...draftColors, [f.key]: e.target.value })}
                />
                <span className="mono color-hex">{draftColors[f.key]}</span>
              </div>
            </label>
          ))}
        </div>
        <div className="theme-save-row">
          <input
            className="theme-name-input"
            placeholder="幫這個主題取個名字"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <button className="btn ghost small" onClick={resetDraftFromActive}>以目前主題為底稿</button>
          <button
            className="btn primary small"
            onClick={() => { onSaveCustomTheme(draftName || "自訂主題", draftColors); setDraftName(""); }}
          >
            另存為新主題並套用
          </button>
        </div>
        <p className="hint">調整六個色彩欄位即可預覽你自己的配色，存好之後會加入上方主題清單，之後可以隨時切換。</p>
      </section>

      <section className="form-section">
        <h2><UploadCloud size={16} strokeWidth={2.2} />主題匯入／匯出</h2>
        <p className="hint">主題就是一段 JSON 色碼設定，不管是在這個 App 做好的，還是別人在其他地方做好分享給你的主題檔，都可以匯入直接套用；你也可以把目前主題匯出，分享給別人或留作備份。</p>
        <div className="settings-actions-row">
          <button className="btn ghost small" onClick={() => themeFileRef.current && themeFileRef.current.click()}>
            <UploadCloud size={14} strokeWidth={2.2} />匯入主題檔案（.json）
          </button>
          <input ref={themeFileRef} type="file" accept="application/json,.json" hidden onChange={handleThemeFile} />
          <button className="btn ghost small" onClick={onExportTheme}>
            <DownloadCloud size={14} strokeWidth={2.2} />匯出目前主題
          </button>
        </div>
        <div className="theme-paste-row">
          <textarea
            rows={3}
            placeholder='或直接貼上主題 JSON 碼，例如 {"name":"薄荷綠","colors":{"primary":"#2FBF8F", ...}}'
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <button className="btn ghost small" onClick={applyImportText} disabled={!importText.trim()}>套用主題碼</button>
        </div>
      </section>

      <section className="form-section">
        <h2><Type size={16} strokeWidth={2.2} />字型</h2>
        <div className="font-option-list">
          {FONT_PRESETS.map((f) => (
            <button
              key={f.id}
              className={`font-option ${fontId === f.id ? "active" : ""}`}
              style={{ fontFamily: f.family }}
              onClick={() => onChangeFont(f.id)}
            >
              {f.name}
            </button>
          ))}
          <button
            className={`font-option ${fontId === "custom" ? "active" : ""}`}
            onClick={() => onChangeFont("custom")}
          >
            自訂字型…
          </button>
        </div>
        {fontId === "custom" && (
          <div className="theme-save-row">
            <input
              className="theme-name-input"
              placeholder="輸入 Google Fonts 的字型名稱，例如 Cactus Classical Serif"
              value={localFontName}
              onChange={(e) => setLocalFontName(e.target.value)}
            />
            <button className="btn primary small" onClick={() => onChangeCustomFontName(localFontName)}>套用字型</button>
          </div>
        )}
        <p className="hint">字型設定和主題色彩是分開的，之後想換字型或換色彩配色都可以各自單獨調整。自訂字型會嘗試從 Google Fonts 載入，需要該字型支援中文才看得到中文字變化。</p>
      </section>

      <section className="form-section">
        <h2><Type size={16} strokeWidth={2.2} />字體大小</h2>
        <div className="font-option-list">
          {FONT_SIZE_PRESETS.map((s) => (
            <button
              key={s.id}
              className={`font-option ${fontScale === s.scale ? "active" : ""}`}
              style={{ fontSize: `${13 * s.scale}px` }}
              onClick={() => onChangeFontScale(s.scale)}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="hint">會套用到整個 App 裡的文字大小（標題、內文、金額都會一起放大縮小），跟主題色彩、字型一樣可以隨時再調整。</p>
      </section>

      <section className="form-section">
        <h2><Type size={16} strokeWidth={2.2} />文字排版</h2>
        <div className="settings-subrow">
          <span className="settings-subrow-label">標題位置</span>
          <div className="font-option-list">
            {TEXT_ALIGN_OPTIONS.map((o) => (
              <button key={o.id} className={`font-option ${titleAlign === o.id ? "active" : ""}`} onClick={() => onChangeTitleAlign(o.id)}>
                {o.name}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-subrow">
          <span className="settings-subrow-label">標題粗細</span>
          <div className="font-option-list">
            {HEADING_WEIGHT_OPTIONS.map((o) => (
              <button key={o.id} className={`font-option ${headingWeight === o.id ? "active" : ""}`} style={{ fontWeight: o.value }} onClick={() => onChangeHeadingWeight(o.id)}>
                {o.name}
              </button>
            ))}
          </div>
        </div>
        <p className="hint">標題位置會套用到最上面「網購記帳簿」那個標題；標題粗細會套用到每個區塊的標題文字。</p>
      </section>

      <section className="form-section">
        <h2><Palette size={16} strokeWidth={2.2} />裝飾表情符號</h2>
        <p className="hint">幫標題和每個頁籤加一個表情符號裝飾，點選下方按鈕挑一個，或選最左邊的「無」清空、恢復原本的圖示。</p>

        <div className="settings-subrow">
          <span className="settings-subrow-label">標題前綴</span>
          <button className="emoji-current" onClick={() => setEmojiPickerFor(emojiPickerFor === "title" ? null : "title")}>
            {emojiSettings.titleEmoji || "無"}
          </button>
        </div>
        {emojiPickerFor === "title" && (
          <EmojiGrid current={emojiSettings.titleEmoji} onPick={(e) => { onChangeTitleEmoji(e); setEmojiPickerFor(null); }} />
        )}

        {TAB_KEYS.map((key) => (
          <div key={key}>
            <div className="settings-subrow">
              <span className="settings-subrow-label">「{TAB_DEFAULT_LABELS[key]}」頁籤圖示</span>
              <button className="emoji-current" onClick={() => setEmojiPickerFor(emojiPickerFor === `tab:${key}` ? null : `tab:${key}`)}>
                {emojiSettings.tabEmojis[key] || "無"}
              </button>
            </div>
            {emojiPickerFor === `tab:${key}` && (
              <EmojiGrid current={emojiSettings.tabEmojis[key]} onPick={(e) => { onChangeTabEmoji(key, e); setEmojiPickerFor(null); }} />
            )}
          </div>
        ))}
      </section>

      <section className="form-section">
        <h2><ScanLine size={16} strokeWidth={2.2} />截圖辨識 AI 設定</h2>
        <p className="hint">
          這個獨立版本沒有經過 Claude，所以截圖辨識功能需要你自己的 API 金鑰才能運作。系統會依序嘗試：
          <b> Anthropic → GPT → Gemini → 本機文字辨識（Tesseract，免費無上限但準確度較低）</b>，前面沒有失敗就不會用到後面那層。
          金鑰只會存在你這個瀏覽器裡，辨識時會直接從你的裝置送到對應官方伺服器，不會經過任何第三方。
        </p>
        <div className="field-grid">
          <label className="field wide">
            <span>Anthropic API 金鑰（第一層，最準）</span>
            <input type="password" value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} placeholder="sk-ant-..." autoComplete="off" />
          </label>
          <label className="field wide">
            <span>OpenAI（GPT）API 金鑰（第二層備援）</span>
            <input type="password" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
          </label>
          <label className="field wide">
            <span>GPT 模型名稱（進階，通常不用改）</span>
            <input value={openaiModel} onChange={(e) => setOpenaiModel(e.target.value)} placeholder="gpt-4o-mini" />
          </label>
          <label className="field wide">
            <span>Gemini API 金鑰（第三層備援）</span>
            <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIza..." autoComplete="off" />
          </label>
          <label className="field wide">
            <span>Gemini 模型名稱（進階，通常不用改）</span>
            <input value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)} placeholder="gemini-2.0-flash" />
          </label>
        </div>
        <div className="settings-actions-row">
          <button className="btn primary small" onClick={saveApiKeys}>{keySaved ? "已儲存 ✓" : "儲存金鑰"}</button>
        </div>
        <p className="hint">
          三層 AI 金鑰都不填也完全可以使用，系統會直接跳到第四層「本機文字辨識」，或是你也可以隨時放棄辨識、改成手動輸入商品欄位。
        </p>
      </section>

      <section className="form-section">
        <h2><Cloud size={16} strokeWidth={2.2} />資料備份</h2>
        <p className="hint">
          這個獨立版本的資料是存在「這個瀏覽器」的本機空間裡，換裝置、換瀏覽器、或清除瀏覽器資料都不會自動帶過去，也沒有串接任何雲端帳號。
          所以強烈建議三不五時就匯出一次備份檔，存到你的 Google 雲端硬碟、Dropbox 或任何你信任的地方；之後不管在哪台裝置，只要把備份檔匯入回來就能還原全部資料。
        </p>
        <div className="settings-actions-row">
          <button className="btn primary small" onClick={onExportBackup}>
            <DownloadCloud size={14} strokeWidth={2.2} />匯出備份檔
          </button>
          <button className="btn ghost small" onClick={() => backupFileRef.current && backupFileRef.current.click()}>
            <UploadCloud size={14} strokeWidth={2.2} />匯入備份檔還原
          </button>
          <input ref={backupFileRef} type="file" accept="application/json,.json" hidden onChange={handleBackupFile} />
        </div>
      </section>

      <section className="form-section">
        <h2><Tag size={16} strokeWidth={2.2} />自訂選項管理</h2>
        <p className="hint">平台、分類、配送方式、發卡銀行、卡片名稱這幾個欄位，填過的值都會自動記起來、下次可以直接選。這裡可以移除不要的選項，或用箭頭調整顯示順序（越前面代表下拉選單裡排越前面）。</p>
        <div className="option-manager-grid">
          <OptionListManager title="平台" options={platforms} onChange={onChangePlatforms} placeholder="例如：蝦皮" />
          <OptionListManager title="分類" options={categories} onChange={onChangeCategories} placeholder="例如：服飾" />
          <OptionListManager title="配送方式" options={shippingMethods} onChange={onChangeShippingMethods} placeholder="例如：超商取貨" />
          <OptionListManager title="發卡銀行" options={banks} onChange={onChangeBanks} placeholder="例如：國泰世華" />
          <OptionListManager title="卡片名稱" options={cardNames} onChange={onChangeCardNames} placeholder="例如：現金回饋卡" />
        </div>
      </section>

      <section className="form-section">
        <h2><Palette size={16} strokeWidth={2.2} />平台顏色</h2>
        <p className="hint">統計圖表、訂單列表左側色條都是照這裡的顏色來畫。沒有另外設定的平台，系統會自動配一個顏色，你也可以在下面自己指定。</p>
        <div className="platform-color-list">
          {platforms.map((p) => (
            <div key={p} className="platform-color-row">
              <span className="platform-color-swatch" style={{ background: colorForPlatform(p, platformColors) }} />
              <span className="platform-color-name">{p}</span>
              <input
                type="color"
                value={colorForPlatform(p, platformColors)}
                onChange={(e) => onChangePlatformColors({ ...platformColors, [p]: e.target.value })}
              />
              {platformColors[p] && (
                <button type="button" className="btn ghost small" onClick={() => {
                  const next = { ...platformColors };
                  delete next[p];
                  onChangePlatformColors(next);
                }}>還原預設</button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  樣式                                                                */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;800&family=Noto+Serif+TC:wght@500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

.ledger-app {
  --bg: #F5F6F8;
  --card: #FFFFFF;
  --text: #1B1D21;
  --text-soft: #868D99;
  --border: #ECEDF1;
  --danger: ${DANGER};
  --font-body: 'Noto Sans TC', sans-serif;

  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  min-height: 100%;
  padding-bottom: 60px;
  position: relative;
  transition: background 0.2s ease, color 0.2s ease;
}
.ledger-app * { font-family: var(--font-body); }
.ledger-app .mono, .ledger-app .mono * { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  padding: 22px 24px;
  background: var(--header-bg, var(--card));
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.app-title { text-align: var(--title-align, left); width: 100%; max-width: fit-content; }
.app-title-eyebrow { display: block; font-family: 'JetBrains Mono', monospace; font-size: calc(10.5px * var(--font-scale, 1)); letter-spacing: 0.14em; color: var(--text-soft); margin-bottom: 2px; }
.app-title h1 { font-size: calc(22px * var(--font-scale, 1)); font-weight: var(--heading-weight, 800); margin: 0; letter-spacing: 0.01em; }

.tabs { display: flex; gap: 4px; background: var(--bg); padding: 4px; border-radius: 999px; flex-wrap: wrap; }
.tab { display: inline-flex; align-items: center; gap: 6px; font-size: calc(13.5px * var(--font-scale, 1)); font-weight: 600; padding: 8px 16px; border: none; background: transparent; color: var(--text-soft); border-radius: 999px; cursor: pointer; transition: all 0.15s ease; }
.tab:hover { color: var(--text); }
.tab.active { background: var(--primary); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }

.app-main { max-width: 960px; margin: 0 auto; padding: 24px 20px 40px; }

.empty-state { text-align: center; padding: 70px 20px; border: 1.5px dashed var(--border); border-radius: 20px; background: var(--card); }
.empty-title { font-size: calc(18px * var(--font-scale, 1)); font-weight: 700; margin: 0 0 6px; }
.empty-sub { color: var(--text-soft); margin: 0 0 18px; font-size: calc(13.5px * var(--font-scale, 1)); }

.search-row { position: relative; margin-bottom: 18px; }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-soft); pointer-events: none; }
.search-input { width: 100%; box-sizing: border-box; padding: 13px 18px 13px 42px; border: 1px solid var(--border); border-radius: 999px; background: var(--card); font-size: calc(14px * var(--font-scale, 1)); color: var(--text); }
.search-input:focus { outline: none; box-shadow: 0 0 0 3px var(--primary-soft); border-color: var(--primary); }

.order-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.order-card { background: var(--card); border-radius: 18px; border: 1px solid var(--border); overflow: hidden; transition: box-shadow 0.15s ease; }
.order-card.open, .order-card:hover { box-shadow: 0 6px 20px rgba(20,20,30,0.06); }

.order-row-head { width: 100%; display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding: 16px 18px; background: none; border: none; cursor: pointer; text-align: left; color: var(--text); }
.order-row-main { flex: 1; min-width: 0; }
.order-items-title { margin: 0 0 8px; font-size: calc(15px * var(--font-scale, 1)); font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.order-row-sub { margin: 0; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.sub-chip { display: inline-flex; align-items: center; gap: 4px; font-size: calc(12px * var(--font-scale, 1)); color: var(--text-soft); font-weight: 500; }
.save-tag { font-family: 'JetBrains Mono', monospace; font-size: calc(11px * var(--font-scale, 1)); font-weight: 700; color: var(--secondary-dark, var(--primary-dark)); background: var(--secondary-soft, var(--primary-soft)); border-radius: 999px; padding: 3px 10px; flex-shrink: 0; }
.order-row-trailing { display: flex; align-items: center; gap: 6px; flex-shrink: 0; padding-top: 2px; }
.order-paid { font-size: calc(16px * var(--font-scale, 1)); font-weight: 800; color: var(--primary-dark); text-align: right; flex-shrink: 0; }
.chevron { transition: transform 0.15s ease; color: var(--text-soft); flex-shrink: 0; }
.chevron.open { transform: rotate(180deg); }

.order-detail { padding: 0 18px 20px; display: flex; flex-direction: column; gap: 14px; }

.detail-head { display: flex; align-items: center; justify-content: space-between; padding-top: 4px; }
.detail-head-title { font-size: calc(13.5px * var(--font-scale, 1)); font-weight: 700; color: var(--text-soft); }
.detail-head-actions { display: flex; gap: 8px; }
.icon-btn-ghost { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border); background: var(--bg); color: var(--text-soft); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.icon-btn-ghost:hover { border-color: var(--primary); color: var(--primary-dark); background: var(--primary-soft-2); }
.icon-btn-ghost.danger:hover { border-color: var(--danger); color: var(--danger); background: #FDECEC; }

.meta-card { display: flex; flex-direction: column; gap: 8px; background: var(--bg); border-radius: 14px; padding: 12px 16px; }
.meta-row { display: flex; align-items: center; gap: 8px; font-size: calc(13px * var(--font-scale, 1)); color: var(--text-soft); font-weight: 500; }
.meta-row svg { flex-shrink: 0; color: var(--text-soft); }

.items-card { background: var(--bg); border-radius: 14px; padding: 14px 16px; }
.items-card-title { display: flex; align-items: center; gap: 6px; margin: 0 0 10px; font-size: calc(12.5px * var(--font-scale, 1)); font-weight: 700; color: var(--text-soft); }
.item-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--border); }
.item-row:last-of-type { border-bottom: none; }
.item-row-thumb { width: 34px; height: 34px; border-radius: 9px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border); }
.item-row-thumb.placeholder { display: flex; align-items: center; justify-content: center; background: var(--card); color: var(--text-soft); }
.img-fallback { display: flex; align-items: center; justify-content: center; background: var(--card); color: var(--text-soft); }
.item-row-main { min-width: 0; }
.item-row-name { margin: 0 0 3px; font-size: calc(13.5px * var(--font-scale, 1)); font-weight: 600; }
.item-row-name a { color: inherit; text-decoration: none; }
.item-row-name a:hover { color: var(--primary-dark); text-decoration: underline; }
.item-row-sub { margin: 0; font-size: calc(11.5px * var(--font-scale, 1)); color: var(--text-soft); }
.item-row-amount { font-size: calc(13.5px * var(--font-scale, 1)); font-weight: 700; flex-shrink: 0; white-space: nowrap; }
.item-row-amount.strong { font-size: calc(15px * var(--font-scale, 1)); color: var(--primary-dark); font-weight: 800; }
.total-row { border-top: 1.5px dashed var(--border); border-bottom: none; margin-top: 2px; padding-top: 12px; }
.total-row .item-row-name { font-size: calc(13.5px * var(--font-scale, 1)); font-weight: 700; }
.cat-chip { font-size: calc(11px * var(--font-scale, 1)); background: var(--card); color: var(--text-soft); padding: 2px 9px; border-radius: 999px; }

.ledger-lines { max-width: 380px; margin-left: auto; }
.ledger-line { display: flex; justify-content: space-between; font-size: calc(13px * var(--font-scale, 1)); padding: 4px 0; color: var(--text-soft); }
.ledger-line.strong { color: var(--text); font-weight: 700; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin: 4px 0; padding: 7px 0; }
.ledger-line.muted { font-size: calc(12px * var(--font-scale, 1)); }
.highlight-text { color: var(--primary-dark); font-weight: 800; }

.order-note { font-size: calc(13px * var(--font-scale, 1)); color: var(--text); margin: 0 0 10px; white-space: pre-wrap; }

.image-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.image-thumb { position: relative; width: 68px; height: 68px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); flex-shrink: 0; }
.image-thumb img, .image-thumb .img-fallback { width: 100%; height: 100%; object-fit: cover; display: block; }
.image-thumb.view-only { cursor: zoom-in; padding: 0; background: none; }

.lightbox-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; padding: 24px; }
.lightbox-img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; }
.lightbox-close { position: absolute; top: 18px; right: 18px; width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.lightbox-close:hover { background: rgba(255,255,255,0.3); }
.image-remove { position: absolute; top: 3px; right: 3px; width: 18px; height: 18px; border-radius: 50%; border: none; background: rgba(20,20,20,0.65); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.image-add-btn { width: 68px; height: 68px; border-radius: 12px; border: 1.5px dashed var(--border); background: var(--bg); color: var(--text-soft); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; cursor: pointer; font-size: calc(10px * var(--font-scale, 1)); flex-shrink: 0; text-align: center; }
.image-add-btn:hover { border-color: var(--primary); color: var(--primary-dark); }
.image-upload-block { margin-top: 14px; }
.image-upload-head { font-size: calc(12.5px * var(--font-scale, 1)); font-weight: 600; color: var(--text-soft); margin-bottom: 8px; display: flex; align-items: center; }
.image-upload-head span { display: flex; align-items: center; gap: 6px; }

.btn { display: inline-flex; align-items: center; gap: 6px; font-size: calc(13.5px * var(--font-scale, 1)); font-weight: 600; padding: 10px 20px; border-radius: 999px; border: 1px solid var(--border); background: var(--card); color: var(--text); cursor: pointer; transition: all 0.12s ease; }
.btn:hover { transform: translateY(-1px); }
.btn.primary { background: var(--primary); border-color: var(--primary); color: #fff; }
.btn.primary:hover { background: var(--primary-dark); }
.btn.danger { border-color: var(--danger); color: var(--danger); background: var(--card); }
.btn.danger:hover { background: var(--danger); color: #fff; }
.btn.ghost { background: transparent; }
.btn.small { padding: 7px 14px; font-size: calc(12.5px * var(--font-scale, 1)); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.icon-btn { display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: var(--card); color: var(--text-soft); width: 30px; height: 30px; border-radius: 50%; cursor: pointer; flex-shrink: 0; }
.icon-btn:hover { border-color: var(--danger); color: var(--danger); }
.icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.form-section { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 20px 22px; margin-bottom: 16px; }
.form-section h2 { display: flex; align-items: center; gap: 8px; font-size: calc(15.5px * var(--font-scale, 1)); font-weight: var(--heading-weight, 800); margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
.section-head-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 8px; }
.section-head-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.section-head-row h2, .section-head-row h3 { margin: 0; border: none; padding: 0; }

.field-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; font-size: calc(12.5px * var(--font-scale, 1)); color: var(--text-soft); font-weight: 500; }
.field.wide { grid-column: 1 / -1; }
.field.note-field { margin-top: 12px; }
.field input, .field select, .field textarea { font-family: var(--font-body); font-size: calc(14px * var(--font-scale, 1)); padding: 9px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--bg); color: var(--text); resize: vertical; }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; box-shadow: 0 0 0 3px var(--primary-soft); border-color: var(--primary); background: var(--card); }

.item-form-list { display: flex; flex-direction: column; gap: 8px; }
.item-form-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.item-index { width: 16px; color: var(--text-soft); font-size: calc(12px * var(--font-scale, 1)); flex-shrink: 0; }
.item-thumb-btn { width: 34px; height: 34px; border-radius: 9px; border: 1.5px dashed var(--border); background: var(--bg); color: var(--text-soft); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; overflow: hidden; }
.item-thumb-btn:hover { border-color: var(--primary); color: var(--primary-dark); }
.item-thumb-btn img, .item-thumb-btn .img-fallback { width: 100%; height: 100%; object-fit: cover; }
.icon-btn.tiny { width: 20px; height: 20px; margin-left: -4px; }
.item-form-row input { font-size: calc(13.5px * var(--font-scale, 1)); padding: 9px 11px; border: 1px solid var(--border); border-radius: 12px; background: var(--bg); color: var(--text); }
.item-form-row input:focus { outline: none; box-shadow: 0 0 0 3px var(--primary-soft); border-color: var(--primary); background: var(--card); }
.item-name { flex: 2; min-width: 100px; }
.item-spec { flex: 1.2; min-width: 90px; color: var(--text-soft); }
.item-num { width: 74px; font-family: 'JetBrains Mono', monospace; }
.item-cat { width: 96px; }
.item-link { flex: 1.4; min-width: 100px; }

.coupon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.coupon-card { border: 1px solid var(--border); border-radius: 16px; padding: 14px 16px; background: var(--bg); }
.coupon-card.on { border-color: var(--primary); background: var(--primary-soft-2); }
.coupon-toggle { display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; }
.coupon-toggle input { width: 17px; height: 17px; accent-color: var(--primary); }
.toggle-row { display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; margin: 12px 0 4px; font-size: calc(13.5px * var(--font-scale, 1)); }
.toggle-row input { width: 17px; height: 17px; accent-color: var(--primary); flex-shrink: 0; }
.coupon-body { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.coupon-type-switch { display: flex; border-radius: 999px; overflow: hidden; width: fit-content; background: var(--card); border: 1px solid var(--border); }
.coupon-type-switch button { font-size: calc(12.5px * var(--font-scale, 1)); font-weight: 600; padding: 7px 14px; border: none; background: transparent; color: var(--text-soft); cursor: pointer; }
.coupon-type-switch button.active { background: var(--primary); color: #fff; }

.reward-list { display: flex; flex-direction: column; gap: 8px; }
.reward-row { display: flex; align-items: center; gap: 8px; }
.reward-row select, .reward-row input { font-size: calc(13.5px * var(--font-scale, 1)); padding: 9px 11px; border: 1px solid var(--border); border-radius: 12px; background: var(--bg); color: var(--text); }
.reward-mode-switch { display: flex; border-radius: 999px; overflow: hidden; border: 1px solid var(--border); background: var(--bg); flex-shrink: 0; }
.reward-mode-switch button { font-size: calc(12px * var(--font-scale, 1)); font-weight: 600; padding: 7px 10px; border: none; background: transparent; color: var(--text-soft); cursor: pointer; min-width: 30px; }
.reward-mode-switch button.active { background: var(--primary); color: #fff; }
.pct-sign { color: var(--text-soft); font-size: calc(13px * var(--font-scale, 1)); }

.hint { font-size: calc(12px * var(--font-scale, 1)); color: var(--text-soft); margin: 8px 0 0; line-height: 1.6; }

.scanner-block { background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 14px 16px; margin-bottom: 14px; }
.scanner-upload-row { display: flex; gap: 10px; }
.scanner-upload { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 28px 16px; border: 1.5px dashed var(--border); border-radius: 14px; background: var(--bg); color: var(--text-soft); cursor: pointer; font-family: var(--font-body); font-size: calc(13px * var(--font-scale, 1)); font-weight: 600; width: 100%; }
.scanner-upload:hover { border-color: var(--primary); color: var(--primary-dark); }
.scanner-canvas { position: relative; display: inline-block; max-width: 100%; user-select: none; touch-action: none; border-radius: 12px; overflow: hidden; cursor: crosshair; }
.scanner-canvas img { display: block; max-width: 100%; max-height: 420px; width: auto; pointer-events: none; }
.scanner-selection { position: absolute; border: 2px solid var(--primary); background: var(--primary-soft); opacity: 0.55; pointer-events: none; }
.scanner-message { background: var(--card); border-radius: 10px; padding: 8px 12px; margin-top: 10px; }
.ocr-raw-text { margin-top: 6px; font-size: calc(11px * var(--font-scale, 1)); color: var(--text-soft); }
.ocr-raw-text summary { cursor: pointer; }
.ocr-raw-text pre { white-space: pre-wrap; word-break: break-all; background: var(--card); border-radius: 8px; padding: 8px 10px; margin-top: 6px; }
.spin { animation: ledger-spin 0.8s linear infinite; }
@keyframes ledger-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.preview-section { background: var(--primary-soft-2); border-color: var(--primary-soft); }
.preview-section .ledger-lines { max-width: none; margin-left: 0; }

.form-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 6px 4px 30px; }

.stats-toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.mode-switch { display: flex; background: var(--card); border: 1px solid var(--border); border-radius: 999px; overflow: hidden; padding: 3px; }
.mode-switch.small { padding: 2px; }
.mode-switch button { font-size: calc(12.5px * var(--font-scale, 1)); font-weight: 600; padding: 7px 14px; border: none; background: transparent; color: var(--text-soft); cursor: pointer; border-radius: 999px; }
.mode-switch.small button { padding: 5px 12px; font-size: calc(11.5px * var(--font-scale, 1)); }
.mode-switch button.active { background: var(--primary); color: #fff; }

.search-view { display: flex; flex-direction: column; gap: 12px; }
.search-input-row { display: flex; align-items: center; gap: 8px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 10px 14px; color: var(--text-soft); }
.search-input-row input { flex: 1; border: none; background: none; font-size: calc(14px * var(--font-scale, 1)); color: var(--text); }
.search-input-row input:focus { outline: none; }
.search-amount-row { display: flex; align-items: center; gap: 8px; }
.search-amount-row input { flex: 1; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 10px 14px; font-size: calc(14px * var(--font-scale, 1)); color: var(--text); }
.search-amount-row input:focus { outline: none; border-color: var(--primary); }
.search-amount-row span { color: var(--text-soft); }
.search-hint { margin-top: -4px; }
.search-empty-hint { text-align: center; padding: 30px 0; }
.search-result-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.search-result-item { display: flex; align-items: center; gap: 10px; background: var(--card); border-radius: 12px; padding: 10px 12px; cursor: pointer; }
.search-result-item:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
.search-result-color { width: 6px; align-self: stretch; border-radius: 4px; flex-shrink: 0; }
.search-result-main { flex: 1; min-width: 0; }
.search-result-top { display: flex; gap: 8px; align-items: baseline; font-size: calc(11.5px * var(--font-scale, 1)); color: var(--text-soft); }
.search-result-platform { font-weight: 700; }
.search-result-name { margin: 2px 0 0; font-size: calc(13.5px * var(--font-scale, 1)); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.search-result-amount { flex-shrink: 0; font-weight: 700; color: var(--primary-dark); }
.period-nav { display: flex; align-items: center; gap: 10px; }
.period-label { font-size: calc(14.5px * var(--font-scale, 1)); font-weight: 700; min-width: 120px; text-align: center; }

.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 22px; }
.summary-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; }
.summary-card.highlight-card { background: var(--primary-soft-2); border-color: var(--primary-soft); }
.summary-label { font-size: calc(12px * var(--font-scale, 1)); color: var(--text-soft); font-weight: 500; }
.summary-value { font-size: calc(19px * var(--font-scale, 1)); font-weight: 800; }
.summary-value.accent { color: var(--primary-dark); }
.highlight-card .summary-value { color: var(--primary-dark); }

.breakdown-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.breakdown-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 18px 20px; grid-column: span 1; }
.breakdown-card.treemap-card, .breakdown-card:last-child { grid-column: 1 / -1; }
.breakdown-card h3 { font-size: calc(14.5px * var(--font-scale, 1)); font-weight: var(--heading-weight, 800); margin: 0 0 12px; }

.bar-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.bar-list li { display: flex; align-items: center; gap: 10px; font-size: calc(12.5px * var(--font-scale, 1)); }
.bar-label { width: 56px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.bar-track { flex: 1; height: 10px; background: var(--bg); border-radius: 999px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 999px; }
.bar-value { width: 84px; text-align: right; flex-shrink: 0; }

.reward-summary-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px 20px; }
.reward-summary-list li { display: flex; justify-content: space-between; font-size: calc(13px * var(--font-scale, 1)); padding: 7px 0; border-bottom: 1px solid var(--border); }

.payment-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.payment-item { border-radius: 12px; overflow: hidden; }
.payment-row-head { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 4px; border: none; background: none; cursor: default; text-align: left; color: var(--text); font-size: calc(13.5px * var(--font-scale, 1)); font-weight: 600; }
.payment-row-head.clickable { cursor: pointer; }
.payment-row-head.clickable:hover { color: var(--primary-dark); }
.payment-method-name { display: flex; align-items: center; gap: 6px; }
.payment-row-trailing { display: flex; align-items: center; gap: 6px; }
.payment-row-trailing .chevron { color: var(--text-soft); }
.payment-sub-list { list-style: none; margin: 0 0 4px; padding: 4px 4px 4px 18px; display: flex; flex-direction: column; gap: 4px; border-left: 2px solid var(--border); }
.payment-sub-list li { display: flex; justify-content: space-between; font-size: calc(12.5px * var(--font-scale, 1)); color: var(--text-soft); padding: 3px 0; }
.payment-sub-item { display: flex; flex-direction: column; }
.payment-sub-row-head { display: flex; justify-content: space-between; align-items: center; background: none; border: none; padding: 3px 0; font: inherit; color: var(--text-soft); font-size: calc(12.5px * var(--font-scale, 1)); cursor: default; width: 100%; text-align: left; }
.payment-sub-row-head.clickable { cursor: pointer; }
.payment-sub-sub-list { list-style: none; margin: 0 0 2px; padding: 2px 4px 2px 16px; display: flex; flex-direction: column; gap: 3px; border-left: 2px dashed var(--border); }
.payment-sub-sub-list li { display: flex; justify-content: space-between; font-size: calc(11.5px * var(--font-scale, 1)); color: var(--text-soft); padding: 2px 0; }

.treemap-wrap { border-radius: 14px; overflow: hidden; }

.calendar-wrap { padding: 4px 2px; }
.calendar-size-control { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-bottom: 8px; font-size: calc(12px * var(--font-scale, 1)); color: var(--text-soft); }
.calendar-size-control .icon-btn-ghost { width: 26px; height: 26px; font-weight: 700; }
.calendar-scale-inner { margin: 0 auto; transition: max-width 0.15s ease; }
.calendar-weekday-row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: calc(11.5px * var(--font-scale, 1)); color: var(--text-soft); font-weight: 700; margin-bottom: 4px; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.calendar-cell { aspect-ratio: 1 / 1; border-radius: 8px; background: var(--bg); padding: 4px 3px; display: flex; flex-direction: column; gap: 2px; overflow: hidden; position: relative; }
.calendar-cell.empty { background: transparent; }
.calendar-daynum { font-size: calc(11px * var(--font-scale, 1)); color: var(--text-soft); font-weight: 600; flex-shrink: 0; }
.calendar-tags { display: flex; flex-direction: column; gap: 2px; min-height: 0; overflow: hidden; }
.calendar-tag-wrap { position: relative; }
.calendar-tag { width: 100%; border: none; border-radius: 5px; padding: 2px 5px; font-size: calc(9.5px * var(--font-scale, 1)); color: #fff; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; font-family: var(--font-body); line-height: 1.5; }
.calendar-tag-more { background: var(--text-soft) !important; text-align: center; font-weight: 700; }
.calendar-tooltip { position: absolute; z-index: 20; top: calc(100% + 4px); left: 0; min-width: 150px; background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 3px; font-size: calc(12px * var(--font-scale, 1)); }
.calendar-tooltip b { font-size: calc(11px * var(--font-scale, 1)); color: var(--text-soft); }
.calendar-tooltip .mono { color: var(--primary-dark); font-weight: 700; }
@media (max-width: 480px) {
  .calendar-tag { font-size: calc(8.5px * var(--font-scale, 1)); }
}

/* ---------- 設定頁 ---------- */
.settings-view { display: flex; flex-direction: column; }
.theme-swatches { display: flex; flex-wrap: wrap; gap: 16px; }
.swatch-wrap { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 60px; position: relative; }
.swatch { width: 42px; height: 42px; border-radius: 50%; border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: transform 0.15s ease; display: flex; align-items: center; justify-content: center; }
.swatch:hover { transform: scale(1.08); }
.swatch.selected { box-shadow: 0 0 0 3px var(--card), 0 0 0 5px var(--text); }
.swatch-name { font-size: calc(10.5px * var(--font-scale, 1)); color: var(--text-soft); text-align: center; }
.swatch-remove { position: absolute; top: -4px; right: 2px; width: 16px; height: 16px; border-radius: 50%; border: none; background: var(--danger); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }

.color-field-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
.color-field { display: flex; flex-direction: column; gap: 6px; font-size: calc(12.5px * var(--font-scale, 1)); color: var(--text-soft); font-weight: 500; }
.color-field-row { display: flex; align-items: center; gap: 8px; }
.color-field-row input[type="color"] { width: 40px; height: 34px; border: 1px solid var(--border); border-radius: 8px; padding: 0; cursor: pointer; background: none; }
.color-hex { font-size: calc(12px * var(--font-scale, 1)); color: var(--text); }

.theme-save-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.theme-name-input { flex: 1; min-width: 160px; padding: 9px 12px; border: 1px solid var(--border); border-radius: 999px; font-size: calc(13px * var(--font-scale, 1)); background: var(--bg); color: var(--text); }
.theme-name-input:focus { outline: none; box-shadow: 0 0 0 3px var(--primary-soft); border-color: var(--primary); }

.settings-actions-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }

.option-manager-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 12px; }
.option-manager { background: var(--bg); border-radius: 14px; padding: 12px 14px; }
.option-manager-title { font-weight: 700; font-size: calc(13.5px * var(--font-scale, 1)); margin: 0 0 8px; }
.option-manager-list { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.option-manager-list li { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: var(--card); border-radius: 9px; padding: 6px 8px 6px 10px; }
.option-manager-name { font-size: calc(13px * var(--font-scale, 1)); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.option-manager-actions { display: flex; gap: 2px; flex-shrink: 0; }
.option-manager-actions .icon-btn.tiny:disabled { opacity: 0.3; cursor: default; }
.option-manager-add { display: flex; gap: 8px; }
.option-manager-add input { flex: 1; }

.platform-color-list { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
.platform-color-row { display: flex; align-items: center; gap: 10px; background: var(--bg); border-radius: 10px; padding: 8px 12px; }
.platform-color-swatch { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; }
.platform-color-name { flex: 1; font-size: calc(13.5px * var(--font-scale, 1)); font-weight: 600; }
.platform-color-row input[type="color"] { width: 40px; height: 30px; border: none; border-radius: 6px; padding: 0; background: none; cursor: pointer; flex-shrink: 0; }
.theme-paste-row { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.theme-paste-row textarea { font-family: 'JetBrains Mono', monospace; font-size: calc(12px * var(--font-scale, 1)); padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--bg); color: var(--text); resize: vertical; }
.theme-paste-row textarea:focus { outline: none; box-shadow: 0 0 0 3px var(--primary-soft); border-color: var(--primary); }
.theme-paste-row button { align-self: flex-end; }

.font-option-list { display: flex; flex-wrap: wrap; gap: 8px; }
.font-option { padding: 10px 16px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg); color: var(--text); cursor: pointer; font-size: calc(13.5px * var(--font-scale, 1)); }
.font-option.active { border-color: var(--primary); background: var(--primary-soft-2); color: var(--primary-dark); font-weight: 700; }

.settings-subrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; flex-wrap: wrap; }
.settings-subrow-label { font-size: calc(13px * var(--font-scale, 1)); color: var(--text); font-weight: 600; }
.emoji-current { width: 44px; height: 44px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--bg); font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.emoji-current:hover { border-color: var(--primary); }
.emoji-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 6px; padding: 10px; margin-bottom: 6px; background: var(--bg); border-radius: 14px; }
.emoji-swatch { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border); background: var(--card); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-soft); }
.emoji-swatch:hover { border-color: var(--primary); }
.emoji-swatch.active { border-color: var(--primary); background: var(--primary-soft-2); }

.modal-backdrop { position: fixed; inset: 0; background: rgba(20, 20, 30, 0.45); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { background: var(--card); border-radius: 20px; padding: 24px 26px; max-width: 320px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
.modal.crop-modal { max-width: 92vw; width: 480px; }
.crop-modal-title { font-size: 13px; font-weight: 600; color: var(--text); margin: 0 0 12px; }
.crop-modal .scanner-canvas { margin-bottom: 4px; }
.modal p { margin: 0 0 16px; font-size: calc(14px * var(--font-scale, 1)); }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

@media (max-width: 640px) {
  .breakdown-grid { grid-template-columns: 1fr; }
  .breakdown-card:last-child { grid-column: auto; }
  .coupon-grid { grid-template-columns: 1fr; }
  .reward-row { flex-wrap: wrap; }
  .app-header { flex-direction: column; align-items: flex-start; }
  .order-items-title { max-width: 220px; }
}
`;
