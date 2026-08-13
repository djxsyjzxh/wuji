(function () {
  "use strict";

  var LS_RECORDS = "wuji.records.v1";
  var LS_STORES = "wuji.stores.v1";
  var LS_PROFILE = "wuji.profile.v1";
  var LS_SEEDED = "wuji.seeded.v1";
  var LS_BARCODE = "wuji.barcode.v1";
  var LS_SESSION = "wuji.session.v1";
  var LS_CART = "wuji.cart.v1";

  var CATEGORIES = [
    "护肤美妆",
    "个护洗护",
    "日用清洁",
    "食品饮料",
    "家居",
    "厨房用品",
    "数码电器",
    "服饰",
    "母婴",
    "宠物",
    "运动户外",
    "药品保健",
    "文具办公",
    "其他"
  ];
  var CATEGORY_EMOJI = {
    "护肤美妆": "🧴",
    "个护洗护": "🛁",
    "日用清洁": "🧻",
    "食品饮料": "🍜",
    "家居": "🛋️",
    "厨房用品": "🍳",
    "数码电器": "📱",
    "服饰": "👕",
    "母婴": "🍼",
    "宠物": "🐾",
    "运动户外": "⚽",
    "药品保健": "💊",
    "文具办公": "✏️",
    "其他": "📦"
  };

  var CATEGORY_SUBS = {
    "护肤美妆": ["洁面", "水乳/精华", "面霜/眼霜", "防晒", "面膜", "彩妆", "身体护理", "其他"],
    "个护洗护": ["洗发", "沐浴", "牙膏/口腔", "身体乳", "香氛", "剃须/脱毛", "其他"],
    "日用清洁": ["纸巾/湿巾", "洗衣/柔顺", "清洁剂", "垃圾袋", "刷具/拖把", "其他"],
    "食品饮料": ["零食", "咖啡/茶", "饮料", "粮油调味", "速食", "其他"],
    "家居": ["杯具", "床品", "收纳", "家具", "灯具", "装饰", "其他"],
    "厨房用品": ["锅具", "餐具", "保鲜盒/袋", "厨房小工具", "其他"],
    "数码电器": ["手机/配件", "耳机/音箱", "充电/线材", "小家电", "电脑外设", "其他"],
    "服饰": ["上衣", "裤装", "鞋袜", "内衣", "配饰", "其他"],
    "母婴": ["奶粉/辅食", "尿不湿", "玩具", "洗护", "其他"],
    "宠物": ["宠物食品", "猫砂/尿垫", "玩具/用品", "护理清洁", "其他"],
    "运动户外": ["运动鞋", "运动服", "球类/器械", "露营/户外", "其他"],
    "药品保健": ["维生素/补剂", "常备药品", "护理用品", "器械/工具", "其他"],
    "文具办公": ["书写工具", "本册/纸张", "办公用品", "收纳", "其他"],
    "其他": ["其他"]
  };

  var PURCHASE_TYPES = [
    { value: "online", label: "线上" },
    { value: "offline", label: "线下" },
    { value: "gift", label: "别人送的" }
  ];
  var PURCHASE_EMOJI = {
    online: "🛒",
    offline: "🏬",
    gift: "🎁"
  };
  var EXPIRY_CATS = [
    "食品饮料",
    "药品保健",
    "护肤美妆",
    "个护洗护",
    "母婴",
    "宠物"
  ];
  var STORE_CATS = [
    { value: "餐厅", label: "餐厅", emoji: "🍽️" },
    { value: "咖啡饮品", label: "咖啡饮品", emoji: "☕" },
    { value: "甜品", label: "甜品", emoji: "🍰" },
    { value: "小吃", label: "小吃", emoji: "🍢" },
    { value: "超市", label: "超市", emoji: "🛒" },
    { value: "便利店", label: "便利店", emoji: "🏪" },
    { value: "服装", label: "服装", emoji: "👕" },
    { value: "美妆", label: "美妆", emoji: "💄" },
    { value: "数码", label: "数码", emoji: "📱" },
    { value: "生活服务", label: "生活服务", emoji: "✂️" },
    { value: "其他", label: "其他", emoji: "📍" }
  ];
  var PURCHASE_CHANNELS = {
    online: [
      { value: "淘宝/天猫", label: "淘宝/天猫" },
      { value: "京东", label: "京东" },
      { value: "拼多多", label: "拼多多" },
      { value: "抖音/直播", label: "抖音/直播" },
      { value: "小红书", label: "小红书" },
      { value: "即时零售", label: "即时零售" },
      { value: "海淘/代购", label: "海淘/代购" },
      { value: "二手平台", label: "二手平台" },
      { value: "其他线上", label: "其他线上" }
    ],
    offline: [
      { value: "超市/便利店", label: "超市/便利店" },
      { value: "商场/专柜", label: "商场/专柜" },
      { value: "品牌专卖店", label: "品牌专卖店" },
      { value: "其他线下", label: "其他线下" }
    ]
  };

  var state = {
    records: [],
    stores: [],
    cart: [],
    cartSearch: "",
    cartAdding: false,
    cartDraft: null,
    pendingCartId: null,
    profile: { name: "物友", phone: "", avatar: "" },
    session: null,
    authMode: "login",
    editingNick: false,
    itemsSearch: "",
    itemsFilter: {
      category: "",
      rating: "",
      repurchase: "",
      price: "",
      source: ""
    },
    expandedItems: {},
    storeSearch: "",
    storeCat: "",
    expandedStores: {},
    editingStore: null,
    editing: null,
    barcodeCache: {},
    lastTab: "home",
    scanRaf: null,
    scanTracks: null,
    zxingReader: null,
    toastTimer: null,
    cloudOk: false
  };

  var view = document.getElementById("view");
  var toastEl = document.getElementById("toast");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  function uid() {
    return (
      "r" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 7)
    );
  }

  function dayMs() {
    return 86400000;
  }

  function todayStr() {
    var d = new Date();
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  function monthPrefix() {
    return todayStr().slice(0, 7);
  }

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return d.getMonth() + 1 + "月" + d.getDate() + "日";
  }

  function fmtMoney(n) {
    if (n == null || isNaN(n)) return "—";
    return String(Math.round(Number(n) * 100) / 100);
  }

  function purchaseLabel(r) {
    if (r.purchaseChannel) return r.purchaseChannel;
    if (r.purchaseType === "gift") return "别人送的";
    return "";
  }

  function categoryLabel(r) {
    if (!r.category) return "未选";
    if (r.subcategory && r.subcategory !== "其他") {
      return r.category + " · " + r.subcategory;
    }
    return r.category;
  }

  function recordEmoji(r) {
    if (!r) return "📦";
    if (r.emoji && r.emoji !== "📦") return r.emoji;
    return (r.category && CATEGORY_EMOJI[r.category]) || r.emoji || "📦";
  }

  function daysLeft(expiryDate) {
    if (!expiryDate) return null;
    var t = new Date(expiryDate + "T00:00:00");
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.round((t - now) / dayMs());
  }

  function expiryLabel(days) {
    if (days < 0) return "已过期";
    if (days === 0) return "今天到期";
    return days + " 天后";
  }

  function expiryBadgeClass(days) {
    if (days < 0) return "gray";
    if (days <= 7) return "red";
    if (days <= 30) return "orange";
    return "green";
  }

  function activeExpiryRecords() {
    return state.records
      .filter(function (r) {
        return (
          r.expiryDate &&
          r.status !== "finished" &&
          r.status !== "abandoned"
        );
      })
      .map(function (r) {
        return { r: r, days: daysLeft(r.expiryDate) };
      })
      .filter(function (x) {
        return x.days <= 90;
      })
      .sort(function (a, b) {
        return a.days - b.days;
      });
  }

  function renderExpiryStrip() {
    var list = activeExpiryRecords();
    if (!list.length || !list.some(function (x) { return x.days <= 30; })) {
      return "";
    }
    return (
      '<section class="home-module home-module-expiry">' +
      '<div class="home-module-title">临期提醒</div>' +
      '<div class="home-module-body"><div class="expiry-strip">' +
      list
        .map(function (x) {
          return (
            '<a class="expiry-card" href="#/detail/r-' +
            esc(x.r.id) +
            '">' +
            '<button type="button" class="expiry-done" data-action="expiry-done" data-id="' +
            esc(x.r.id) +
            '" aria-label="用完了">✓</button>' +
            '<span class="expiry-emoji" aria-hidden="true">' +
            esc(recordEmoji(x.r)) +
            "</span>" +
            "<b>" +
            esc(x.r.name) +
            "</b>" +
            '<span class="epill ' +
            expiryBadgeClass(x.days) +
            '">' +
            expiryLabel(x.days) +
            "</span>" +
            "</a>"
          );
        })
        .join("") +
      "</div></div></section>"
    );
  }

  function itemKey(r) {
    return (
      (r.name || "").trim() +
      "|" +
      (r.brand || "").trim() +
      "|" +
      (r.category || "").trim()
    );
  }

  function recordsByKey(key) {
    return state.records
      .filter(function (r) {
        return itemKey(r) === key;
      })
      .sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  }

  function itemGroups(recs) {
    var groups = {};
    recs.forEach(function (r) {
      var k = itemKey(r);
      if (!groups[k]) groups[k] = [];
      groups[k].push(r);
    });
    return Object.keys(groups).map(function (k) {
      return groups[k];
    });
  }

  function repurchaseText(r) {
    var same = recordsByKey(itemKey(r));
    return same.length >= 2
      ? "已回购 " + (same.length - 1) + " 次"
      : "首次购买";
  }

  function storeKey(r) {
    return (
      (r.name || "").trim() + "|" + (r.category || "").trim()
    );
  }

  function storesByKey(key) {
    return state.stores
      .filter(function (r) {
        return storeKey(r) === key;
      })
      .sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  }

  function storeEmoji(cat) {
    var hit = STORE_CATS.find(function (c) {
      return c.value === cat;
    });
    return hit ? hit.emoji : "🏪";
  }

  function purchaseRow(r, i) {
    return (
      '<a class="row purchase-row" href="#/detail/r-' +
      r.id +
      '">' +
      '<span class="purchase-badge" aria-hidden="true">' +
      i +
      "</span>" +
      '<span class="row-main">' +
      '<span class="purchase-date">' +
      esc(fmtDate(r.createdAt)) +
      "</span>" +
      (r.rating ? starsLine(r.rating) : "") +
      "</span>" +
      '<span class="purchase-side">' +
      (r.price != null
        ? '<span class="purchase-price">¥' +
          esc(fmtMoney(r.price)) +
          "</span>"
        : "") +
      "</span>" +
      "</a>"
    );
  }

  function sortedRecords() {
    return state.records.slice().sort(function (a, b) {
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
  }

  function saveRecords() {
    try {
      localStorage.setItem(LS_RECORDS, JSON.stringify(state.records));
    } catch (e) {
      toast("保存失败：本地存储空间不足，可先删除带照片的记录");
    }
  }

  function saveStores() {
    try {
      localStorage.setItem(LS_STORES, JSON.stringify(state.stores));
    } catch (e) {}
  }

  function renderCartReminder() {
    var items = pendingCart();
    if (!items.length) return "";
    var high = items.filter(function (item) { return item.priority === "high"; }).length;
    return (
      '<section class="home-module home-module-cart">' +
      '<div class="home-module-title">待购买提醒</div>' +
      '<div class="home-module-body"><div class="card cart-reminder">' +
      '<div class="cart-reminder-main"><span class="cart-reminder-icon">🛍️</span>' +
      '<span><b>还有 ' + items.length + ' 件想买的物品</b><small>' +
      (high ? high + ' 件优先购买' : '记得下次购买时看看') +
      '</small></span></div>' +
      '<button class="link-btn" data-action="goto" data-to="#/cart">查看 ›</button>' +
      '</div></div></section>'
    );
  }

  function saveCart() {
    try {
      localStorage.setItem(LS_CART, JSON.stringify(state.cart));
    } catch (e) {
      toast("购物车保存失败，请检查本机存储空间");
    }
  }

  function pendingCart() {
    return state.cart
      .filter(function (item) { return item.status === "pending"; })
      .sort(function (a, b) {
        var priority = { high: 0, normal: 1, low: 2 };
        return (priority[a.priority] - priority[b.priority]) ||
          (new Date(b.updatedAt) - new Date(a.updatedAt));
      });
  }

  function cartItemForRecord(record) {
    if (!record) return null;
    return state.cart.find(function (item) {
      return item.status === "pending" &&
        (item.sourceRecordId === record.id ||
          (item.name === record.name && item.brand === (record.brand || "") &&
            item.category === (record.category || "")));
    }) || null;
  }

  function cartPriorityLabel(priority) {
    return priority === "high" ? "优先购买" : priority === "low" ? "不着急" : "想买";
  }

  function saveBarcodeCache() {
    try {
      localStorage.setItem(LS_BARCODE, JSON.stringify(state.barcodeCache));
    } catch (e) {
      // 缓存失败不影响主功能
    }
  }

  /* ---------- 云端同步（Supabase） ---------- */

  var CLOUD_URL =
    typeof WUJI_SUPABASE_URL !== "undefined" ? WUJI_SUPABASE_URL : "";
  var CLOUD_ANON =
    typeof WUJI_SUPABASE_ANON !== "undefined" ? WUJI_SUPABASE_ANON : "";

  function cloudEnabled() {
    return !!(
      CLOUD_URL &&
      CLOUD_ANON &&
      authed() &&
      typeof fetch === "function"
    );
  }

  function currentOwner() {
    return state.session && state.session.user
      ? state.session.user.id
      : "";
  }

  function authApi(path, options) {
    options = options || {};
    options.headers = Object.assign(
      {
        apikey: CLOUD_ANON,
        Authorization: "Bearer " + CLOUD_ANON,
        "Content-Type": "application/json"
      },
      options.headers || {}
    );
    return fetch(CLOUD_URL + "/auth/v1" + path, options);
  }

  function phoneToEmail(phone) {
    return phone + "@wuji.local";
  }

  function phoneMask(p) {
    return p && p.length >= 7 ? p.slice(0, 3) + "****" + p.slice(7) : p || "";
  }

  function saveSession() {
    try {
      localStorage.setItem(LS_SESSION, JSON.stringify(state.session));
    } catch (e) {}
  }

  function restoreSession() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_SESSION));
      if (s && s.access_token && s.user) state.session = s;
    } catch (e) {
      state.session = null;
    }
  }

  function clearSession() {
    state.session = null;
    try {
      localStorage.removeItem(LS_SESSION);
    } catch (e) {}
  }

  function authed() {
    return !!(state.session && state.session.access_token);
  }

  function signUp(phone, password, nickname) {
    return authApi("/signup", {
      method: "POST",
      body: JSON.stringify({
        email: phoneToEmail(phone),
        password: password,
        data: { nickname: nickname }
      })
    }).then(function (res) {
      return res.json().then(function (d) {
        return { ok: res.ok, status: res.status, data: d };
      });
    });
  }

  function signIn(phone, password) {
    return authApi("/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({
        email: phoneToEmail(phone),
        password: password
      })
    }).then(function (res) {
      return res.json().then(function (d) {
        return { ok: res.ok, status: res.status, data: d };
      });
    });
  }

  function refreshSession() {
    if (!state.session || !state.session.refresh_token) {
      return Promise.resolve(false);
    }
    return authApi("/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: state.session.refresh_token })
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (d) {
        if (d.access_token) {
          state.session.access_token = d.access_token;
          state.session.refresh_token = d.refresh_token || state.session.refresh_token;
          state.session.expires_at =
            Date.now() + (d.expires_in || 3600) * 1000;
          saveSession();
          return true;
        }
        return false;
      })
      .catch(function () {
        return false;
      });
  }

  function signOut() {
    if (authed()) {
      authApi("/logout", {
        method: "POST",
        headers: {
          apikey: CLOUD_ANON,
          Authorization: "Bearer " + state.session.access_token
        }
      }).catch(function () {});
    }
    clearSession();
    closeAuthSheet();
    route();
    toast("已退出登录");
  }

  function cloudApi(path, options) {
    options = options || {};
    options.headers = Object.assign(
      {
        apikey: CLOUD_ANON,
        Authorization: authed()
          ? "Bearer " + state.session.access_token
          : "Bearer " + CLOUD_ANON
      },
      options.headers || {}
    );
    return fetch(CLOUD_URL + "/rest/v1" + path, options);
  }

  function recordToRow(r) {
    return {
      id: r.id,
      owner: currentOwner(),
      name: r.name || "",
      brand: r.brand || "",
      emoji: r.emoji || "📦",
      barcode: r.barcode || "",
      photo: r.photo || null,
      rating: r.rating || 0,
      repurchase: r.repurchase || "unsure",
      recommend: r.recommend || "",
      category: r.category || "",
      subcategory: r.subcategory || "",
      purchasetype: r.purchaseType || null,
      purchasechannel: r.purchaseChannel || null,
      price: r.price == null || r.price === "" ? null : r.price,
      comment: r.comment || "",
      status: r.status || "using",
      method: r.method || "manual",
      expirydate: r.expiryDate || "",
      produceddate: r.producedDate || "",
      shelfdays: r.shelfDays == null ? null : r.shelfDays,
      createdat: r.createdAt || new Date().toISOString(),
      updatedat: r.updatedAt || new Date().toISOString()
    };
  }

  function cartToRow(item) {
    return {
      id: item.id,
      owner: currentOwner(),
      name: item.name || "",
      note: item.note || "",
      priority: item.priority || "normal",
      sourcerecordid: item.sourceRecordId || null,
      category: item.category || "",
      image: item.image || null,
      status: item.status || "pending",
      createdat: item.createdAt || new Date().toISOString(),
      purchasedat: item.purchasedAt || null,
      updatedat: item.updatedAt || new Date().toISOString()
    };
  }

  function rowToCart(row) {
    return {
      id: row.id,
      name: row.name || "",
      note: row.note || "",
      priority: row.priority || "normal",
      sourceRecordId: row.sourcerecordid || null,
      category: row.category || "",
      image: row.image || null,
      status: row.status || "pending",
      createdAt: row.createdat,
      purchasedAt: row.purchasedat || null,
      updatedAt: row.updatedat
    };
  }

  function fetchCart() {
    return cloudApi(
      "/shopping_cart?select=*&owner=eq." + encodeURIComponent(currentOwner()) +
        "&order=createdat.asc"
    ).then(function (res) {
      if (!res.ok) throw new Error("cloud " + res.status);
      return res.json();
    });
  }

  function upsertCartToCloud(item) {
    if (!cloudEnabled()) return Promise.resolve();
    return cloudApi("/shopping_cart?on_conflict=id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify([cartToRow(item)])
    }).catch(function () {});
  }

  function deleteCartInCloud(id) {
    if (!cloudEnabled()) return Promise.resolve();
    return cloudApi(
      "/shopping_cart?id=eq." + encodeURIComponent(id) +
        "&owner=eq." + encodeURIComponent(currentOwner()),
      { method: "DELETE" }
    ).catch(function () {});
  }

  function syncCartFromCloud() {
    if (!cloudEnabled()) return Promise.resolve();
    return fetchCart().then(function (cloudRows) {
      var cloudById = {};
      cloudRows.forEach(function (row) { cloudById[row.id] = row; });
      var merged = state.cart.slice();
      var localById = {};
      merged.forEach(function (item) { localById[item.id] = item; });
      cloudRows.forEach(function (row) {
        var local = localById[row.id];
        if (!local) merged.push(rowToCart(row));
        else if (new Date(row.updatedat) > new Date(local.updatedAt)) {
          merged[merged.indexOf(local)] = rowToCart(row);
        }
      });
      state.cart = merged;
      saveCart();
      merged.forEach(function (item) {
        var remote = cloudById[item.id];
        if (!remote || new Date(item.updatedAt) > new Date(remote.updatedat)) {
          upsertCartToCloud(item);
        }
      });
      updateCartBadge();
      if (parseHash().path === "cart" || parseHash().path === "home") route();
    }).catch(function () {});
  }

  function rowToRecord(row) {
    return {
      id: row.id,
      name: row.name || "",
      brand: row.brand || "",
      emoji: row.emoji || "📦",
      barcode: row.barcode || "",
      photo: row.photo || null,
      rating: row.rating || 0,
      repurchase: row.repurchase || "unsure",
      recommend: row.recommend || "",
      category: row.category || "",
      subcategory: row.subcategory || "",
      purchaseType: row.purchasetype || null,
      purchaseChannel: row.purchasechannel || null,
      price: row.price == null ? null : Number(row.price),
      comment: row.comment || "",
      status: row.status || "using",
      method: row.method || "manual",
      expiryDate: row.expirydate || "",
      producedDate: row.produceddate || "",
      shelfDays: row.shelfdays == null ? null : Number(row.shelfdays),
      createdAt: row.createdat,
      updatedAt: row.updatedat
    };
  }

  function fetchCloudRecords() {
    return cloudApi(
      "/records?select=*&owner=eq." +
        encodeURIComponent(currentOwner()) +
        "&order=createdat.asc"
    ).then(function (res) {
      if (!res.ok) throw new Error("cloud " + res.status);
      return res.json();
    });
  }

  function upsertRecordToCloud(r) {
    if (!cloudEnabled()) return Promise.resolve();
    return cloudApi("/records?on_conflict=id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify([recordToRow(r)])
    }).catch(function () {});
  }

  function deleteRecordInCloud(id) {
    if (!cloudEnabled()) return Promise.resolve();
    return cloudApi(
      "/records?id=eq." +
        encodeURIComponent(id) +
        "&owner=eq." +
        encodeURIComponent(currentOwner()),
      { method: "DELETE" }
    ).catch(function () {});
  }

  function loadProfileFromCloud() {
    if (!cloudEnabled()) return;
    cloudApi(
      "/profiles?select=*&uid=eq." + encodeURIComponent(currentOwner())
    )
      .then(function (res) {
        return res.ok ? res.json() : [];
      })
      .then(function (rows) {
        if (rows && rows[0] && rows[0].nickname) {
          state.profile.name = rows[0].nickname;
          state.profile.phone = rows[0].phone || state.session.user.phone;
          saveProfile();
          if (parseHash().path === "profile") route();
        }
      })
      .catch(function () {});
  }

  function upsertProfileToCloud() {
    if (!cloudEnabled()) return Promise.resolve();
    return cloudApi("/profiles?on_conflict=uid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify([
        {
          uid: currentOwner(),
          phone: state.session.user.phone || "",
          nickname: state.profile.name || "物友",
          avatar: state.profile.avatar || ""
        }
      ])
    }).catch(function () {});
  }

  function dataUrlToBlob(dataUrl) {
    var parts = String(dataUrl || "").split(",");
    if (parts.length < 2) return null;
    var mime = (parts[0].match(/data:(.*?);/) || [])[1] || "image/jpeg";
    var bin = atob(parts[1]);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function isStorageUrl(s) {
    return (
      !!s && s.indexOf(CLOUD_URL + "/storage/v1/object/public/") === 0
    );
  }

  function uploadImageToStorage(dataUrl) {
    if (!cloudEnabled() || !dataUrl) return Promise.resolve(dataUrl);
    var blob = dataUrlToBlob(dataUrl);
    if (!blob) return Promise.resolve(dataUrl);
    var path =
      currentOwner() +
      "/img-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 8) +
      ".jpg";
    return fetch(
      CLOUD_URL + "/storage/v1/object/wuji-photos/" + encodeURIComponent(path),
      {
        method: "POST",
        headers: {
          apikey: CLOUD_ANON,
          Authorization: "Bearer " + state.session.access_token,
          "Content-Type": blob.type || "image/jpeg"
        },
        body: blob
      }
    )
      .then(function (res) {
        if (!res.ok) throw new Error("upload " + res.status);
        return (
          CLOUD_URL +
          "/storage/v1/object/public/wuji-photos/" +
          encodeURIComponent(path)
        );
      })
      .catch(function () {
        return dataUrl;
      });
  }

  function deleteStorageFile(url) {
    if (!cloudEnabled() || !isStorageUrl(url)) return Promise.resolve();
    var p = url.split("/storage/v1/object/public/")[1];
    if (!p) return Promise.resolve();
    return fetch(
      CLOUD_URL + "/storage/v1/object/" + encodeURIComponent(p),
      {
        method: "DELETE",
        headers: {
          apikey: CLOUD_ANON,
          Authorization: "Bearer " + state.session.access_token
        }
      }
    ).catch(function () {});
  }

  function storeToRow(s) {
    return {
      id: s.id,
      owner: currentOwner(),
      name: s.name || "",
      category: s.category || "",
      emoji: s.emoji || storeEmoji(s.category),
      photo: s.photo || null,
      rating: s.rating || 0,
      recommend: s.recommend || "",
      price: s.price == null || s.price === "" ? null : s.price,
      totalspend: s.totalSpend == null || s.totalSpend === "" ? null : s.totalSpend,
      people: s.people == null || s.people === "" ? null : s.people,
      latitude: s.latitude == null ? null : Number(s.latitude),
      longitude: s.longitude == null ? null : Number(s.longitude),
      address: s.address || "",
      comment: s.comment || "",
      status: s.status || "using",
      createdat: s.createdAt || new Date().toISOString(),
      updatedat: s.updatedAt || new Date().toISOString()
    };
  }

  function rowToStore(row) {
    return {
      id: row.id,
      name: row.name || "",
      category: row.category || "",
      emoji: row.emoji || storeEmoji(row.category),
      photo: row.photo || null,
      rating: row.rating || 0,
      recommend: row.recommend || "",
      price: row.price == null ? null : Number(row.price),
      totalSpend: row.totalspend == null ? null : Number(row.totalspend),
      people: row.people == null ? null : Number(row.people),
      latitude: row.latitude == null ? null : Number(row.latitude),
      longitude: row.longitude == null ? null : Number(row.longitude),
      address: row.address || "",
      comment: row.comment || "",
      status: row.status || "using",
      createdAt: row.createdat,
      updatedAt: row.updatedat
    };
  }

  function fetchStores() {
    return cloudApi(
      "/stores?select=*&owner=eq." +
        encodeURIComponent(currentOwner()) +
        "&order=createdat.asc"
    ).then(function (res) {
      if (!res.ok) throw new Error("cloud " + res.status);
      return res.json();
    });
  }

  function upsertStoreToCloud(s) {
    if (!cloudEnabled()) return Promise.resolve();
    return cloudApi("/stores?on_conflict=id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify([storeToRow(s)])
    }).catch(function () {});
  }

  function deleteStoreInCloud(id) {
    if (!cloudEnabled()) return Promise.resolve();
    return cloudApi(
      "/stores?id=eq." +
        encodeURIComponent(id) +
        "&owner=eq." +
        encodeURIComponent(currentOwner()),
      { method: "DELETE" }
    ).catch(function () {});
  }

  function syncStoresFromCloud() {
    if (!cloudEnabled()) return Promise.resolve();
    return fetchStores()
      .then(function (cloudRows) {
        var cloudById = {};
        cloudRows.forEach(function (cr) {
          cloudById[cr.id] = cr;
        });
        var merged = state.stores.slice();
        var localById = {};
        merged.forEach(function (s) {
          localById[s.id] = s;
        });
        cloudRows.forEach(function (cr) {
          var ls = localById[cr.id];
          if (!ls) {
            merged.push(rowToStore(cr));
          } else if (new Date(cr.updatedat) > new Date(ls.updatedAt)) {
            var idx = merged.indexOf(ls);
            merged[idx] = rowToStore(cr);
          }
        });
        var toPush = merged.filter(function (s) {
          var cr = cloudById[s.id];
          return !cr || new Date(s.updatedAt) > new Date(cr.updatedat);
        });
        state.stores = merged;
        saveStores();
        toPush.forEach(function (s) {
          upsertStoreToCloud(s);
        });
      })
      .catch(function () {});
  }

  function syncFromCloud() {
    if (!cloudEnabled()) {
      state.cloudOk = false;
      return;
    }
    fetchCloudRecords()
      .then(function (cloudRows) {
        state.cloudOk = true;
        var cloudById = {};
        cloudRows.forEach(function (cr) {
          cloudById[cr.id] = cr;
        });
        var merged = state.records.slice();
        var localById = {};
        merged.forEach(function (r) {
          localById[r.id] = r;
        });
        cloudRows.forEach(function (cr) {
          var lr = localById[cr.id];
          if (!lr) {
            merged.push(rowToRecord(cr));
          } else if (new Date(cr.updatedat) > new Date(lr.updatedAt)) {
            var idx = merged.indexOf(lr);
            merged[idx] = rowToRecord(cr);
          }
        });
        var toPush = merged.filter(function (r) {
          var cr = cloudById[r.id];
          return !cr || new Date(r.updatedAt) > new Date(cr.updatedat);
        });
        state.records = merged;
        saveRecords();
        toPush.forEach(function (r) {
          upsertRecordToCloud(r);
        });
        route();
        syncStoresFromCloud();
      syncCartFromCloud();
      })
      .catch(function () {
        state.cloudOk = false;
      });
  }

  function renderLogin() {
    return (
      '<div class="auth-wrap auth-sheet">' +
      '<div class="auth-logo" aria-hidden="true">📦</div>' +
      '<div class="auth-title">物记账号</div>' +
      '<div class="auth-sub">登录后记录自动同步到云端</div>' +
      '<div class="auth-tabs">' +
      '<button type="button" class="auth-tab ' +
      (state.authMode === "login" ? "on" : "") +
      '" data-action="auth-mode" data-value="login">登录</button>' +
      '<button type="button" class="auth-tab ' +
      (state.authMode === "register" ? "on" : "") +
      '" data-action="auth-mode" data-value="register">注册</button>' +
      "</div>" +
      '<div class="card auth-card">' +
      '<div class="auth-field" id="auth-nick-field" style="' +
      (state.authMode === "register" ? "" : "display:none;") +
      '">' +
      '<label class="label" for="auth-nick">昵称</label>' +
      '<input class="input" id="auth-nick" maxlength="12" placeholder="给自己起个名字（可留空）">' +
      "</div>" +
      '<label class="label" for="auth-phone">手机号</label>' +
      '<input class="input" id="auth-phone" inputmode="numeric" maxlength="11" placeholder="请输入 11 位手机号">' +
      '<label class="label" for="auth-pass">密码</label>' +
      '<input class="input" id="auth-pass" type="password" maxlength="32" placeholder="至少 6 位">' +
      '<button class="btn btn-primary" id="auth-submit" data-action="auth-submit">' +
      (state.authMode === "register" ? "注册并进入" : "登 录") +
      "</button>" +
      '<div class="hint" style="margin-top:14px;">数据加密保存在云端，换设备登录同一账号即可同步</div>' +
      "</div></div>"
    );
  }

  function openAuthSheet() {
    var overlay = document.getElementById("auth-sheet");
    if (overlay) {
      overlay.style.display = "flex";
    } else {
      var sheet = document.createElement("div");
      sheet.id = "auth-sheet";
      sheet.className = "sheet-overlay";
      sheet.setAttribute("data-action", "sheet-close");
      sheet.innerHTML =
        '<div class="sheet" data-action="sheet-noop">' +
        '<div class="sheet-head">' +
        '<div class="sheet-title">账号</div>' +
        '<button type="button" class="icon-btn" data-action="auth-close" aria-label="关闭">✕</button>' +
        "</div>" +
        '<div id="auth-form"></div>' +
        "</div>";
      document.getElementById("app").appendChild(sheet);
    }
    renderAuthForm();
  }

  function closeAuthSheet() {
    var overlay = document.getElementById("auth-sheet");
    if (overlay) overlay.style.display = "none";
  }

  function renderAuthForm() {
    var el = document.getElementById("auth-form");
    if (el) el.innerHTML = renderLogin();
  }

  function enterApp() {
    state.cloudOk = false;
    loadProfileFromCloud();
    route();
    syncFromCloud();
  }

  function setAuthMode(mode) {
    state.authMode = mode === "register" ? "register" : "login";
    renderAuthForm();
  }

  function submitAuth() {
    var phoneEl = document.getElementById("auth-phone");
    var passEl = document.getElementById("auth-pass");
    var nickEl = document.getElementById("auth-nick");
    var phone = phoneEl ? String(phoneEl.value || "").trim() : "";
    var pass = passEl ? passEl.value || "" : "";
    var nick = nickEl ? String(nickEl.value || "").trim() : "";
    if (!/^1\d{10}$/.test(phone)) {
      toast("请输入正确的 11 位手机号");
      return;
    }
    if (pass.length < 6) {
      toast("密码至少 6 位");
      return;
    }
    var btn = document.getElementById("auth-submit");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "请稍候…";
    }
    var task =
      state.authMode === "register"
        ? signUp(phone, pass, nick || "物友")
        : signIn(phone, pass);
    task
      .then(function (r) {
        if (btn) btn.disabled = false;
        var d = r.data || {};
        if (r.ok && d.access_token) {
          state.session = {
            access_token: d.access_token,
            refresh_token: d.refresh_token || "",
            expires_at: Date.now() + (d.expires_in || 3600) * 1000,
            user: {
              id: d.user ? d.user.id : "",
              phone: phone
            }
          };
          state.profile.name = nick || state.profile.name || "物友";
          state.profile.phone = phone;
          saveProfile();
          saveSession();
          closeAuthSheet();
          enterApp();
          toast(state.authMode === "register" ? "注册成功，欢迎使用" : "欢迎回来");
        } else if (r.ok && d.user && !d.access_token) {
          toast("注册已提交，但项目开启了邮箱确认，请先在 Supabase 后台关闭");
        } else {
          var msg = d.error_description || d.msg || d.message || "";
          if (!msg && r.status === 422) msg = "该手机号已注册，请直接登录";
          toast(msg || "操作失败，请稍后再试");
          if (state.authMode === "register" && /(already|exists|已注册|registered)/i.test(msg)) {
            setAuthMode("login");
          }
        }
      })
      .catch(function () {
        if (btn) btn.disabled = false;
        toast("网络异常，请检查网络后重试");
      });
  }

  function saveProfile() {
    localStorage.setItem(LS_PROFILE, JSON.stringify(state.profile));
  }

  function saveNick() {
    var el = document.getElementById("nick-input");
    var name = el ? el.value.trim() : "";
    if (!name) name = "物友";
    state.profile.name = name;
    state.editingNick = false;
    saveProfile();
    upsertProfileToCloud();
    route();
    toast("昵称已保存");
  }

  function syncTip() {
    if (!cloudEnabled()) return "数据保存在这台设备浏览器里";
    return state.cloudOk
      ? "数据已同步到云端，换设备登录同一账号即可查看"
      : "云端暂未连接，数据保存在本机浏览器";
  }

  function loadAll() {
    try {
      var rec = localStorage.getItem(LS_RECORDS);
      state.records = rec ? JSON.parse(rec) : [];
    } catch (e) {
      state.records = [];
    }
    try {
      var st = localStorage.getItem(LS_STORES);
      state.stores = st ? JSON.parse(st) : [];
    } catch (e) {
      state.stores = [];
    }
    try {
      var cart = localStorage.getItem(LS_CART);
      state.cart = cart ? JSON.parse(cart) : [];
      if (!Array.isArray(state.cart)) state.cart = [];
    } catch (e) {
      state.cart = [];
    }
    try {
      var prof = localStorage.getItem(LS_PROFILE);
      if (prof)
        state.profile = Object.assign(
          { name: "物友", phone: "", avatar: "" },
          JSON.parse(prof)
        );
    } catch (e) {
      state.profile = { name: "小禾" };
    }
    try {
      var bc = localStorage.getItem(LS_BARCODE);
      if (bc) state.barcodeCache = JSON.parse(bc) || {};
    } catch (e) {
      state.barcodeCache = {};
    }
    if (!state.records.length && !localStorage.getItem(LS_SEEDED)) {
      state.records = wujiSeedRecords();
      saveRecords();
      localStorage.setItem(LS_SEEDED, "1");
    }
  }

  function updateCartBadge() {
    var count = pendingCart().length;
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = count;
      el.hidden = !count;
    });
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 1800);
  }

  function catalogForRecord(r) {
    if (!r) return null;
    if (r.barcode) {
      var byCode = WUJI_CATALOG.find(function (c) {
        return c.barcode === r.barcode;
      });
      if (byCode) return byCode;
    }
    return (
      WUJI_CATALOG.find(function (c) {
        return c.name === r.name;
      }) ||
      WUJI_CATALOG.find(function (c) {
        return r.name && c.name.indexOf(r.name) >= 0;
      }) ||
      WUJI_CATALOG.find(function (c) {
        return r.name && r.name.indexOf(c.name) >= 0;
      }) ||
      null
    );
  }

  function recordsForCatalog(c) {
    return state.records.filter(function (r) {
      return (
        (r.barcode && c.barcode && r.barcode === c.barcode) || r.name === c.name
      );
    });
  }

  /* ---------- month stats ---------- */

  function monthStats() {
    var m = monthPrefix();
    var recs = state.records.filter(function (r) {
      return r.createdAt && r.createdAt.indexOf(m) === 0;
    });
    var rated = recs.filter(function (r) {
      return r.rating > 0;
    });
    var avg = 0;
    if (rated.length) {
      avg =
        rated.reduce(function (s, r) {
          return s + r.rating;
        }, 0) / rated.length;
    }
    var groups = itemGroups(recs);
    var repurchased = groups.filter(function (g) {
      return g.length >= 2;
    }).length;
    var cats = {};
    recs.forEach(function (r) {
      var k = r.category || "其他";
      cats[k] = (cats[k] || 0) + 1;
    });
    var catList = Object.keys(cats)
      .map(function (k) {
        return { name: k, count: cats[k] };
      })
      .sort(function (a, b) {
        return b.count - a.count;
      });
    var best = rated.slice().sort(function (a, b) {
      return b.rating - a.rating;
    })[0];
    var worst = rated.slice().sort(function (a, b) {
      return a.rating - b.rating;
    })[0];
    var days = {};
    recs.forEach(function (r) {
      if (r.createdAt) days[r.createdAt.slice(0, 10)] = 1;
    });
    var spend = recs.reduce(function (s, r) {
      var p = Number(r.price);
      return s + (isNaN(p) ? 0 : p);
    }, 0);
    return {
      count: recs.length,
      avg: avg,
      repurchaseRate: groups.length ? repurchased / groups.length : 0,
      best: best,
      worst: worst,
      cats: catList,
      activeDays: Object.keys(days).length,
      totalSpend: spend
    };
  }

  function streakDays() {
    var days = {};
    state.records.forEach(function (r) {
      if (r.createdAt) days[r.createdAt.slice(0, 10)] = 1;
    });
    var list = Object.keys(days).sort().reverse();
    if (!list.length) return 0;
    var yesterday = new Date(Date.now() - dayMs()).toISOString().slice(0, 10);
    if (list[0] !== todayStr() && list[0] !== yesterday) return 0;
    var n = 1;
    for (var i = 0; i < list.length - 1; i++) {
      var a = new Date(list[i] + "T00:00:00");
      var b = new Date(list[i + 1] + "T00:00:00");
      if ((a - b) / dayMs() === 1) n++;
      else break;
    }
    return n;
  }

  /* ---------- small components ---------- */

  function starText(v) {
    return '<span class="stars">★ ' + esc(v) + "</span>";
  }

  function itemRow(r, href) {
    var cat = r.category
      ? r.category +
        (r.subcategory && r.subcategory !== "其他" ? " · " + r.subcategory : "")
      : "";
    return (
      '<a class="row" href="' +
      href +
      '">' +
      '<span class="thumb" aria-hidden="true">' +
      esc(recordEmoji(r)) +
      "</span>" +
      '<span class="row-main">' +
      '<span class="row-name">' +
      esc(r.name) +
      "</span>" +
      (cat ? '<span class="row-meta">' + esc(cat) + "</span>" : "") +
      (r.rating ? starsLine(r.rating) : "") +
      "</span>" +
      '<span class="row-side">' +
      (r.recommend === "yes"
        ? '<span class="rec-flag" aria-label="推荐">👍</span>'
        : r.recommend === "no"
          ? '<span class="rec-flag" aria-label="不推荐">👎</span>'
          : "") +
      '<span class="row-price">' +
      (r.price != null ? "¥" + esc(fmtMoney(r.price)) : "") +
      "</span></span>" +
      "</a>"
    );
  }

  function starIcons(v) {
    var n = Math.max(0, Math.min(5, Math.round(Number(v) || 0)));
    var html = "";
    for (var i = 1; i <= 5; i++) {
      html +=
        '<span class="star-ico' +
        (i <= n ? " on" : "") +
        '" aria-hidden="true">★</span>';
    }
    return '<span class="stars-ico">' + html + "</span>";
  }

  function starsLine(v) {
    return (
      '<span class="stars-line">' +
      starIcons(v) +
      '<span class="row-score">' +
      esc(v) +
      "</span></span>"
    );
  }

  function communityCard(c) {
    var pct = Math.round(c.repurchaseRate * 100);
    var dist = {};
    c.reviews.forEach(function (rv) {
      var k = String(Math.round(rv.rating));
      dist[k] = (dist[k] || 0) + 1;
    });
    var max = Math.max.apply(
      null,
      Object.keys(dist).map(function (k) {
        return dist[k];
      })
    );
    var bars = "";
    for (var i = 5; i >= 1; i--) {
      var n = dist[String(i)] || 0;
      bars +=
        '<div class="dist-row"><span>' +
        i +
        "★</span><div class=\"bar\"><span style=\"width:" +
        (max ? Math.round((n / max) * 100) : 0) +
        '%;background:var(--star);"></span></div><span>' +
        n +
        "</span></div>";
    }
    return (
      '<div class="section">社区数据<span class="demo-badge">演示数据</span></div>' +
      '<div class="card">' +
      '<div class="score-grid">' +
      '<div><div class="score-num">' +
      esc(c.rating) +
      '<small> / 5</small></div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:2px;">' +
      esc(c.count) +
      " 人 · 平均使用 " +
      esc(c.avgDays) +
      " 天</div></div>" +
      '<div>' +
      '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);"><span>回购率</span><span style="color:var(--accent);font-weight:600;">' +
      pct +
      "%</span></div>" +
      '<div class="bar" style="margin-top:5px;"><span style="width:' +
      pct +
      '%"></span></div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:6px;">样本评分分布</div>' +
      bars +
      "</div></div></div>" +
      '<div class="section">真实使用评价（用过才能评）</div>' +
      c.reviews
        .map(function (rv) {
          return (
            '<div class="quote"><div class="quote-head">' +
            '<span class="avatar" style="width:22px;height:22px;font-size:11px;">' +
            esc(rv.user.charAt(0)) +
            "</span> " +
            esc(rv.user) +
            " · 用了 " +
            esc(rv.days) +
            " 天 <span style=\"margin-left:auto;\" class=\"stars\">★ " +
            esc(rv.rating) +
            "</span></div>" +
            esc(rv.text) +
            "</div>"
          );
        })
        .join("")
    );
  }

  /* ---------- views ---------- */

  function renderHome() {
    var m = monthStats();
    var recs = sortedRecords().slice(0, 8);
    return (
      '<div class="home-hero">' +
      '<div class="home-topline"><div class="avatar" aria-hidden="true">' +
      esc((state.profile.name || "禾").charAt(0)) +
      '</div><div class="home-top-actions"><button class="home-reward" data-action="goto" data-to="#/review">本月回顾</button></div></div>' +
      '<div class="brand-kicker">LIFE INDEX · 物记生活索引</div>' +
      '<div class="page-title home-title">你好，' +
      esc(state.profile.name) +
      '</div>' +
      '<div class="sub">连续记录 ' +
      streakDays() +
      ' 天 · 本月 ' +
      m.count +
      ' 件</div>' +
      '<div class="home-quick-actions"><button class="quick-action on" data-action="new-record">＋ 记录物品</button><button class="quick-action" data-action="goto" data-to="#/items">我的物品</button><button class="quick-action" data-action="goto" data-to="#/cart">待购买</button></div>' +
      '</div>' +
      '<div class="overview home-overview">' +
      '<div class="overview-top"><span style="font-size:12px;color:var(--muted);">' +
      monthPrefix().replace("-", " 年 ") +
      " 月概览</span>" +
      '<button class="link-btn" data-action="goto" data-to="#/review">看复盘 ›</button></div>' +
      '<div class="ov-stats">' +
      '<div class="ov-stat"><div class="ov-num">' +
      m.count +
      '</div><div class="ov-label">本月记录</div></div>' +
      '<div class="ov-stat"><div class="ov-num">' +
      (m.avg ? m.avg.toFixed(1) : "—") +
      '</div><div class="ov-label">平均评分</div></div>' +
      '<div class="ov-stat"><div class="ov-num">' +
      Math.round(m.repurchaseRate * 100) +
      '%</div><div class="ov-label">回购率</div></div>' +
      '<div class="ov-stat"><div class="ov-num">' +
      (m.totalSpend ? "¥" + fmtMoney(m.totalSpend) : "—") +
      '</div><div class="ov-label">本月花费</div></div>' +
      "</div>" +
      '<div class="note">本月记录了 ' +
      m.activeDays +
      " 天</div></div>" +
      renderCartReminder() +
      renderExpiryStrip() +
      '<section class="home-module home-module-recent">' +
      '<div class="home-module-title home-recent-title">最近记录</div>' +
      '<div class="home-module-body">' + homeRecentHtml(recs) + '</div></section>' +
      '<div class="home-spacer"></div>'
    );
  }

  function homeDateLabel(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    var pad = function (n) {
      return String(n).padStart(2, "0");
    };
    var s =
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate());
    var week = "周" + "日一二三四五六".charAt(d.getDay());
    if (s === todayStr()) return "今天 · " + week;
    if (s === new Date(Date.now() - dayMs()).toISOString().slice(0, 10))
      return "昨天 · " + week;
    return d.getMonth() + 1 + "月" + d.getDate() + "日 · " + week;
  }

  function homeRecentHtml(recs) {
    if (!recs.length) {
      return (
        '<div class="card"><div class="empty"><span class="e">📦</span>' +
        "还没有记录，点下面按钮记下第一件物品吧</div></div>"
      );
    }
    var groups = {};
    recs.forEach(function (r) {
      var l = homeDateLabel(r.updatedAt || r.createdAt);
      (groups[l] = groups[l] || []).push(r);
    });
    var html = "";
    var first = true;
    Object.keys(groups).forEach(function (l) {
      html +=
        '<div class="home-date-label' +
        (first ? " first" : "") +
        '">' +
        esc(l) +
        "</div>" +
        '<div class="card home-recent-card">' +
        groups[l]
          .map(function (r) {
            return itemRow(r, "#/detail/r-" + r.id);
          })
          .join("") +
        "</div>";
      first = false;
    });
    return html;
  }

  function renderItems() {
    var groups = filteredGroups();
    var filtering = !!(state.itemsSearch || activeFilterCount());
    return (
      '<div class="head"><div><div class="page-title">我的物品</div>' +
      '<div class="sub">' +
      (filtering
        ? "找到 " + groups.length + " 种物品"
        : "共 " + state.records.length + " 件记录 · " + groups.length + " 种物品") +
      "</div></div>" +
      '<button class="icon-btn add-btn" data-action="new-record" aria-label="新增记录">＋</button></div>' +
      '<div class="search-row">' +
      '<div class="search-box">' +
      '<span class="search-icon" aria-hidden="true">🔍</span>' +
      '<input class="input" id="items-search" type="search" placeholder="搜索名称 / 品牌 / 拼音" value="' +
      esc(state.itemsSearch) +
      '">' +
      "</div>" +
      '<button type="button" class="btn filter-btn" data-action="open-filter">筛选' +
      (activeFilterCount()
        ? '<span class="filter-badge">' + activeFilterCount() + "</span>"
        : "") +
      "</button>" +
      "</div>" +
      '<div class="filter-tags" id="filter-tags">' +
      renderFilterTags() +
      "</div>" +
      '<div id="items-list">' +
      itemsListHtml() +
      "</div>"
    );
  }

  function activeFilterCount() {
    var f = state.itemsFilter;
    var n = 0;
    Object.keys(f).forEach(function (k) {
      if (f[k]) n++;
    });
    return n;
  }

  function filteredGroups() {
    var groups = {};
    state.records.forEach(function (r) {
      var k = itemKey(r);
      if (!groups[k]) groups[k] = [];
      groups[k].push(r);
    });
    var groupList = Object.keys(groups)
      .map(function (k) {
        return { key: k, list: recordsByKey(k) };
      })
      .sort(function (a, b) {
        var la = a.list[a.list.length - 1];
        var lb = b.list[b.list.length - 1];
        return (
          new Date(lb.updatedAt || lb.createdAt) -
          new Date(la.updatedAt || la.createdAt)
        );
      });
    var f = state.itemsFilter;
    var q = String(state.itemsSearch || "").trim().toLowerCase();
    return groupList.filter(function (g) {
      var l = g.list[g.list.length - 1];
      if (f.category && l.category !== f.category) return false;
      if (f.rating === "high" && !(l.rating >= 4)) return false;
      if (f.rating === "low" && !(l.rating > 0 && l.rating <= 2)) return false;
      if (f.repurchase === "yes" && g.list.length < 2) return false;
      if (f.repurchase === "no" && g.list.length !== 1) return false;
      if (f.price === "lt50" && !(l.price != null && l.price < 50)) return false;
      if (
        f.price === "50to100" &&
        !(l.price != null && l.price >= 50 && l.price <= 100)
      )
        return false;
      if (f.price === "gt100" && !(l.price != null && l.price > 100))
        return false;
      if (f.source && l.purchaseType !== f.source) return false;
      if (q) {
        var hay = ((l.name || "") + " " + (l.brand || "")).toLowerCase();
        var ok = hay.indexOf(q) >= 0;
        if (
          !ok &&
          window.pinyinPro &&
          typeof window.pinyinPro.match === "function"
        ) {
          try {
            ok = window.pinyinPro.match(l.name + (l.brand || ""), q);
          } catch (e) {}
        }
        if (!ok) return false;
      }
      return true;
    });
  }

  function itemsListHtml() {
    var groupList = filteredGroups();
    if (!groupList.length) {
      return (
        '<div class="empty"><span class="e">🔍</span>' +
        (state.itemsSearch || activeFilterCount()
          ? "没有找到匹配的物品"
          : "还没有物品，先记录一件吧") +
        "</div>"
      );
    }
    return groupList
      .map(function (g) {
        var latest = g.list[g.list.length - 1];
        var expanded = !!state.expandedItems[g.key];
        var rating = latest.rating || 0;
        var repHigh = g.list.length >= 2;
        var repLow = !repHigh && rating > 0 && rating <= 2;
        var cartItem = cartItemForRecord(latest);
        return (
          '<div class="card item-card">' +
          '<div class="item-head" data-action="toggle-items" data-key="' +
          esc(g.key) +
          '">' +
          '<span class="thumb" aria-hidden="true">' +
          esc(recordEmoji(latest)) +
          "</span>" +
          '<span class="row-main">' +
          '<span class="row-name item-name-full">' +
          esc(latest.name) +
          "</span>" +
          '<span class="item-kv">' +
          (function () {
            var dl =
              latest.expiryDate &&
              latest.status !== "finished" &&
              latest.status !== "abandoned"
                ? daysLeft(latest.expiryDate)
                : null;
            return dl != null && dl <= 30
              ? '<span class="epill ' +
                expiryBadgeClass(dl) +
                '">⏰ ' +
                expiryLabel(dl) +
                "</span>"
              : "";
          })() +
          '<span class="buy-count' +
          (repHigh ? " rep-high" : repLow ? " rep-low" : "") +
          '">已买 <b>' +
          g.list.length +
          "</b> 次</span></span>" +
          "</span>" +
          '<span class="item-actions">' +
          '<button class="rebuy-btn" data-action="re-buy" data-id="' + esc(latest.id) + '">再买一次</button>' +
          '<button class="rebuy-btn cart-rebuy-btn" data-action="' + (cartItem ? "cart-remove" : "cart-add-record") + '" data-id="' +
          esc(latest.id) +
          '">' + (cartItem ? "已在购物车" : "加入购物车") + '</button></span>' +
          '<span class="item-chevron" aria-hidden="true">' +
          (expanded ? "▾" : "▸") +
          "</span>" +
          "</div>" +
          '<div class="purchase-list"' +
          (expanded ? "" : " hidden") +
          ">" +
          g.list
            .map(function (r, i) {
              return purchaseRow(r, i + 1);
            })
            .join("") +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function filterChipsFor(group, opts) {
    var html = '<div class="chips">';
    html +=
      '<button type="button" class="chip ' +
      (!state.itemsFilter[group] ? "on" : "") +
      '" data-action="filter-set" data-group="' +
      group +
      '" data-value="">全部</button>';
    opts.forEach(function (o) {
      html +=
        '<button type="button" class="chip ' +
        (state.itemsFilter[group] === o.value ? "on" : "") +
        '" data-action="filter-set" data-group="' +
        group +
        '" data-value="' +
        o.value +
        '">' +
        o.label +
        "</button>";
    });
    return html + "</div>";
  }

  function openFilterSheet() {
    var overlay = document.getElementById("filter-sheet");
    if (overlay) {
      overlay.style.display = "flex";
    } else {
      var sheet = document.createElement("div");
      sheet.id = "filter-sheet";
      sheet.className = "sheet-overlay";
      sheet.setAttribute("data-action", "sheet-close");
      sheet.innerHTML =
        '<div class="sheet" data-action="sheet-noop">' +
        '<div class="sheet-head">' +
        '<div class="sheet-title">筛选</div>' +
        '<div class="sheet-actions">' +
        '<button type="button" class="link-btn" data-action="filter-reset">重置</button>' +
        '<button type="button" class="icon-btn" data-action="filter-close" aria-label="关闭">✕</button>' +
        "</div></div>" +
        '<div id="filter-body"></div>' +
        '<button class="btn btn-primary" data-action="filter-done">完成</button>' +
        "</div>";
      document.getElementById("app").appendChild(sheet);
    }
    renderFilterBody();
  }

  function renderFilterBody() {
    var el = document.getElementById("filter-body");
    if (!el) return;
    var cats = [];
    state.records.forEach(function (r) {
      if (r.category && cats.indexOf(r.category) < 0) cats.push(r.category);
    });
    cats.sort();
    var html =
      '<div class="label">分类</div>' +
      filterChipsFor(
        "category",
        cats.map(function (c) {
          return { value: c, label: c };
        })
      );
    html +=
      '<div class="label">星级</div>' +
      filterChipsFor("rating", [
        { value: "high", label: "4星以上" },
        { value: "low", label: "2星及以下" }
      ]);
    html +=
      '<div class="label">回购状态</div>' +
      filterChipsFor("repurchase", [
        { value: "yes", label: "已回购（2次以上）" },
        { value: "no", label: "仅买过 1 次" }
      ]);
    html +=
      '<div class="label">价格区间</div>' +
      filterChipsFor("price", [
        { value: "lt50", label: "50元以下" },
        { value: "50to100", label: "50-100元" },
        { value: "gt100", label: "100元以上" }
      ]);
    html +=
      '<div class="label">购买来源</div>' +
      filterChipsFor("source", [
        { value: "online", label: "线上" },
        { value: "offline", label: "线下" },
        { value: "gift", label: "别人送的" }
      ]);
    el.innerHTML = html;
  }

  function renderFilterTags() {
    var labels = {
      rating: { high: "4星以上", low: "2星及以下" },
      repurchase: { yes: "已回购", no: "仅买过 1 次" },
      price: { lt50: "50元以下", "50to100": "50-100元", gt100: "100元以上" },
      source: { online: "线上", offline: "线下", gift: "别人送的" }
    };
    var html = "";
    Object.keys(state.itemsFilter).forEach(function (g) {
      var v = state.itemsFilter[g];
      if (!v) return;
      var label = g === "category" ? v : (labels[g] || {})[v] || v;
      html +=
        '<button type="button" class="filter-tag" data-action="filter-set" data-group="' +
        g +
        '" data-value="">' +
        esc(label) +
        " ×</button>";
    });
    return html;
  }

  function refreshItemsAfterFilter() {
    renderFilterBody();
    var tags = document.getElementById("filter-tags");
    if (tags) tags.innerHTML = renderFilterTags();
    var list = document.getElementById("items-list");
    if (list) list.innerHTML = itemsListHtml();
  }

  /* ---------- 店铺 ---------- */

  function filteredStoreGroups() {
    var groups = {};
    state.stores.forEach(function (s) {
      var k = storeKey(s);
      if (!groups[k]) groups[k] = [];
      groups[k].push(s);
    });
    var list = Object.keys(groups)
      .map(function (k) {
        return { key: k, list: storesByKey(k) };
      })
      .sort(function (a, b) {
        var la = a.list[a.list.length - 1];
        var lb = b.list[b.list.length - 1];
        return (
          new Date(lb.updatedAt || lb.createdAt) -
          new Date(la.updatedAt || la.createdAt)
        );
      });
    var q = String(state.storeSearch || "").trim().toLowerCase();
    var cat = state.storeCat || "";
    return list.filter(function (g) {
      var l = g.list[g.list.length - 1];
      if (cat && l.category !== cat) return false;
      if (q) {
        var hay = (
          (l.name || "") +
          " " +
          (l.category || "") +
          " " +
          (l.address || "")
        ).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function storeVisitRow(s, i) {
    return (
      '<a class="row purchase-row" href="#/store-detail/r-' +
      s.id +
      '">' +
      '<span class="purchase-badge" aria-hidden="true">' +
      i +
      "</span>" +
      '<span class="row-main">' +
      '<span class="purchase-date">' +
      esc(fmtDate(s.createdAt)) +
      "</span>" +
      (s.rating ? starsLine(s.rating) : "") +
      "</span>" +
      '<span class="purchase-side">' +
      (s.price != null
        ? '<span class="purchase-price">¥' +
          esc(fmtMoney(s.price)) +
          "</span>"
        : "") +
      "</span>" +
      "</a>"
    );
  }

  function storeListHtml() {
    var groups = filteredStoreGroups();
    if (!groups.length) {
      return (
        '<div class="empty"><span class="e">🏪</span>' +
        (state.storeSearch || state.storeCat
          ? "没有找到匹配的店铺"
          : "还没有店铺，点右上角 ＋ 记录第一家吧") +
        "</div>"
      );
    }
    return groups
      .map(function (g) {
        var l = g.list[g.list.length - 1];
        var expanded = !!state.expandedStores[g.key];
        var repHigh = g.list.length >= 2;
        return (
          '<div class="card item-card">' +
          '<div class="item-head" data-action="toggle-store" data-key="' +
          esc(g.key) +
          '">' +
          '<span class="thumb" aria-hidden="true">' +
          esc(l.emoji || storeEmoji(l.category)) +
          "</span>" +
          '<span class="row-main">' +
          '<span class="row-name">' +
          esc(l.name) +
          (l.recommend === "yes"
            ? ' <span class="rec-flag" aria-hidden="true">👍</span>'
            : l.recommend === "no"
              ? ' <span class="rec-flag" aria-hidden="true">👎</span>'
              : "") +
          "</span>" +
          '<span class="item-kv">' +
          (l.category
            ? '<span class="mini-tag">' + esc(l.category) + "</span>"
            : "") +
          (l.price != null
            ? '<span class="item-price">¥' + esc(fmtMoney(l.price)) + "</span>"
            : "") +
          (l.rating
            ? '<span class="stars">★ ' + esc(l.rating) + "</span>"
            : "") +
          '<span class="buy-count' +
          (repHigh ? " rep-high" : "") +
          '">到访 <b>' +
          g.list.length +
          "</b> 次</span>" +
          "</span>" +
          "</span>" +
          '<button class="rebuy-btn" data-action="re-visit" data-id="' +
          esc(l.id) +
          '">再访一次</button>' +
          '<span class="item-chevron" aria-hidden="true">' +
          (expanded ? "▾" : "▸") +
          "</span>" +
          "</div>" +
          '<div class="purchase-list"' +
          (expanded ? "" : " hidden") +
          ">" +
          g.list
            .map(function (s, i) {
              return storeVisitRow(s, i + 1);
            })
            .join("") +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderStores() {
    var groups = filteredStoreGroups();
    return (
      '<div class="head"><div><div class="page-title">我的店铺</div>' +
      '<div class="sub">共 ' +
      state.stores.length +
      " 次到访 · " +
      groups.length +
      " 家店</div></div>" +
      '<button class="icon-btn add-btn" data-action="new-store" aria-label="记录店铺">＋</button></div>' +
      '<div class="search-row">' +
      '<div class="search-box">' +
      '<span class="search-icon" aria-hidden="true">🔍</span>' +
      '<input class="input" id="store-search" type="search" placeholder="搜索店名 / 类型 / 地址" value="' +
      esc(state.storeSearch) +
      '">' +
      "</div>" +
      "</div>" +
      '<div class="chips" id="store-filter" style="margin:10px 0 4px;">' +
      renderStoreFilterChips() +
      "</div>" +
      '<div id="store-list">' +
      storeListHtml() +
      "</div>"
    );
  }

  function renderStoreFilterChips() {
    var cats = [];
    state.stores.forEach(function (s) {
      if (s.category && cats.indexOf(s.category) < 0) cats.push(s.category);
    });
    cats.sort();
    var html =
      '<button type="button" class="chip' +
      (!state.storeCat ? " on" : "") +
      '" data-action="store-cat" data-value="">全部</button>';
    html += cats
      .map(function (c) {
        return (
          '<button type="button" class="chip' +
          (state.storeCat === c ? " on" : "") +
          '" data-action="store-cat" data-value="' +
          esc(c) +
          '">' +
          esc(c) +
          "</button>"
        );
      })
      .join("");
    return html;
  }

  function newStore() {
    state.editingStore = {
      id: null,
      name: "",
      category: "",
      emoji: "🏪",
      photo: null,
      rating: 0,
      recommend: "",
      price: "",
      totalSpend: "",
      people: "",
      latitude: null,
      longitude: null,
      address: "",
      comment: "",
      status: "using"
    };
    return state.editingStore;
  }

  function renderStoreRecord() {
    var e = state.editingStore || newStore();
    return (
      '<div class="topbar">' +
      '<button class="icon-btn" data-action="goto" data-to="#/stores" aria-label="返回">‹</button>' +
      "<h2>记录店铺</h2></div>" +
      '<label class="label" for="store-name">店名 *</label>' +
      '<input class="input" id="store-name" data-bind="name" value="' +
      esc(e.name) +
      '" placeholder="比如：老张牛肉面">' +
      '<div class="label">类型</div>' +
      '<div class="chips" id="store-cats"></div>' +
      '<div class="label">推荐吗（可选）</div>' +
      '<div class="chips" id="store-recommend"></div>' +
      '<div class="label">我的评分</div>' +
      '<div id="store-stars"></div>' +
      '<div class="label">消费与人数</div>' +
      '<div class="store-spend-row">' +
      '<div style="position:relative;flex:1;min-width:0;">' +
      '<span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);">¥</span>' +
      '<input class="input" id="store-total" data-bind="totalSpend" inputmode="decimal" placeholder="总消费" style="padding-left:28px;" value="' +
      esc(e.totalSpend == null ? "" : e.totalSpend) +
      '">' +
      "</div>" +
      '<input class="input" id="store-people" data-bind="people" inputmode="numeric" placeholder="人数" style="width:96px;flex:none;" value="' +
      esc(e.people == null ? "" : e.people) +
      '">' +
      "</div>" +
      '<div class="hint" id="store-avg" style="text-align:left;margin-top:6px;">人均 ¥—</div>' +
      '<div class="label">地点</div>' +
      (typeof WUJI_AMAP_KEY !== "undefined" && WUJI_AMAP_KEY
        ? '<div class="location-search-card">' +
          '<div class="location-search-hint">输入店名或地址，从结果中选择；需要时再开启附近搜索。</div>' +
          '<div class="search-row" style="margin-top:0;">' +
          '<div class="search-box">' +
          '<span class="search-icon" aria-hidden="true">🔍</span>' +
          '<input class="input" id="store-loc-search" type="search" placeholder="搜索地点或店铺">' +
          "</div>" +
          '<button class="btn btn-ghost map-search-btn" data-action="store-loc-search">查找</button>' +
          "</div>" +
          '<button type="button" class="location-near-btn ' + (locSearchNearMe ? "on" : "") + '" data-action="store-loc-use">' +
          (locSearchNearMe ? "✓ 附近搜索已开启" : "⌖ 使用当前位置缩小范围") +
          "</button>" +
          '<div id="store-loc-results"></div>' +
          '<div id="store-loc-selected"></div>' +
          "</div>"
        : '<input class="input" id="store-address" data-bind="address" value="' +
          esc(e.address) +
          '" placeholder="比如：幸福路 88 号">') +
      '<label class="label" for="store-comment">一句话短评（可选）</label>' +
      '<textarea class="textarea" id="store-comment" data-bind="comment" placeholder="比如：面劲道，汤底浓，会再来。">' +
      esc(e.comment || "") +
      "</textarea>" +
      '<div class="label">照片（可选）</div>' +
      '<div class="photo-actions" id="store-upload">' +
      '<button type="button" class="photo-btn" data-action="pick-store-photo" data-mode="camera">' +
      '<span class="tool-icon" aria-hidden="true">📸</span><span>拍照</span></button>' +
      '<button type="button" class="photo-btn" data-action="pick-store-photo">' +
      '<span class="tool-icon" aria-hidden="true">🖼️</span><span>从相册选择</span></button>' +
      "</div>" +
      '<div id="store-photo"></div>' +
      '<button class="btn btn-primary" data-action="save-store">保存店铺</button>'
    );
  }

  function renderStoreControls() {
    renderStoreStars();
    renderStoreCats();
    renderStoreRecommend();
    renderStorePhoto();
    updateStoreAvg();
    renderStoreSelected();
  }

  var storeLocResults = null;
  var userLoc = null;
  var locUsedForSearch = false;
  var locSearchNearMe = false;
  var locRequested = false;

  function fmtDist(m) {
    if (m == null || isNaN(m)) return "";
    if (m < 1000) return Math.round(m) + " 米";
    return (m / 1000).toFixed(1) + " 公里";
  }

  function getUserLoc(cb) {
    if (userLoc) {
      cb(userLoc);
      return;
    }
    if (!navigator.geolocation) {
      cb(null);
      return;
    }
    toast("正在定位，请允许位置权限");
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        userLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        cb(userLoc);
      },
      function () {
        cb(null);
      },
      { timeout: 8000, maximumAge: 600000 }
    );
  }

  function storeMapLink(s) {
    if (!s || s.latitude == null || s.longitude == null) return "";
    return (
      "https://uri.amap.com/marker?position=" +
      s.longitude +
      "," +
      s.latitude +
      "&name=" +
      encodeURIComponent(s.name || "我的位置")
    );
  }

  function updateStoreAvg() {
    var el = document.getElementById("store-avg");
    if (!el) return;
    var e = state.editingStore;
    var total = parseFloat(
      String(e.totalSpend == null ? "" : e.totalSpend).replace(/[^\d.]/g, "")
    );
    var people = parseInt(
      String(e.people == null ? "" : e.people).replace(/\D/g, ""),
      10
    );
    if (isNaN(total) || isNaN(people) || people <= 0) {
      el.textContent = "人均 ¥—";
      return;
    }
    el.textContent = "人均 ¥" + Math.round((total / people) * 100) / 100;
  }

  function ensureAmap(cb) {
    if (typeof WUJI_AMAP_KEY === "undefined" || !WUJI_AMAP_KEY) return;
    function whenReady() {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (window.AMap && window.AMap.PlaceSearch) {
          clearInterval(iv);
          cb();
        } else if (tries > 40) {
          clearInterval(iv);
          toast("地图组件加载失败，请检查网络");
        }
      }, 200);
    }
    if (window.AMap && window.AMap.PlaceSearch) {
      cb();
      return;
    }
    if (document.getElementById("amap-script")) {
      whenReady();
      return;
    }
    if (
      typeof WUJI_AMAP_JSCODE !== "undefined" &&
      WUJI_AMAP_JSCODE
    ) {
      window._AMapSecurityConfig = {
        securityJsCode: WUJI_AMAP_JSCODE
      };
    }
    var s = document.createElement("script");
    s.id = "amap-script";
    s.src =
      "https://webapi.amap.com/maps?v=1.4.15&key=" +
      encodeURIComponent(WUJI_AMAP_KEY) +
      "&plugin=AMap.PlaceSearch";
    s.onload = function () {
      whenReady();
    };
    s.onerror = function () {
      toast("地图组件加载失败，请检查网络");
    };
    document.head.appendChild(s);
  }

  function runStoreLocSearch() {
    try {
      var kw = document.getElementById("store-loc-search");
      if (!kw) return;
      var keyword = String(kw.value || "").trim();
      if (!keyword) {
        toast("请输入要搜索的地点或店铺");
        return;
      }
      var search = function (loc) {
        var place = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: "",
          citylimit: false
        });
        var done = function (status, result) {
          if (
            status === "complete" &&
            result.poiList &&
            result.poiList.pois.length
          ) {
            storeLocResults = result.poiList.pois;
            renderStoreLocResults();
          } else {
            toast("未找到该地点或店铺");
          }
        };
        if (loc && locSearchNearMe) {
          locUsedForSearch = true;
          place.searchNearBy(keyword, [loc.lng, loc.lat], 5000, done);
        } else {
          locUsedForSearch = false;
          place.search(keyword, done);
        }
      };
      if (locSearchNearMe) getUserLoc(search);
      else search(userLoc);
    } catch (e) {}
  }

  function renderStoreLocResults() {
    var el = document.getElementById("store-loc-results");
    if (!el) return;
    if (!storeLocResults || !storeLocResults.length) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML =
      '<div class="card" style="margin-top:8px;">' +
      (locUsedForSearch
        ? '<div class="hint" style="text-align:left;padding:8px 12px 0;">已按距你 5 公里内排序</div>'
        : '<div class="hint" style="text-align:left;padding:8px 12px 0;">未获取到位置，显示全国结果</div>') +
      storeLocResults
        .map(function (poi, i) {
          return (
            '<button type="button" class="loc-result" data-action="store-loc-pick" data-index="' +
            i +
            '">' +
            "<b>" +
            esc(poi.name) +
            "</b>" +
            (poi.address
              ? "<span>" +
                esc(poi.address) +
                (poi.distance != null
                  ? " · " + fmtDist(poi.distance)
                  : "") +
                "</span>"
              : "") +
            "</button>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderStoreSelected() {
    var el = document.getElementById("store-loc-selected");
    if (!el) return;
    var e = state.editingStore;
    var link = storeMapLink(e);
    if (!e.address && !link) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML =
      '<div class="loc-selected">📍 ' +
      esc(e.address || "已选择位置") +
      (link
        ? ' <a class="link-btn" target="_blank" rel="noopener" href="' +
          link +
          '">打开地图 ›</a>'
        : "") +
      "</div>";
  }

  function renderStoreCats() {
    var el = document.getElementById("store-cats");
    if (!el) return;
    el.innerHTML = STORE_CATS.map(function (c) {
      return (
        '<button type="button" class="chip' +
        (state.editingStore.category === c.value ? " on" : "") +
        '" data-action="store-cat-set" data-value="' +
        c.value +
        '">' +
        c.emoji +
        " " +
        c.label +
        "</button>"
      );
    }).join("");
  }

  function renderStoreRecommend() {
    var el = document.getElementById("store-recommend");
    if (!el) return;
    el.innerHTML =
      '<button type="button" class="chip' +
      (state.editingStore.recommend === "yes" ? " on" : "") +
      '" data-action="store-recommend" data-value="yes">👍 推荐</button>' +
      '<button type="button" class="chip' +
      (state.editingStore.recommend === "no" ? " on" : "") +
      '" data-action="store-recommend" data-value="no">👎 不推荐</button>';
  }

  function renderStoreStars() {
    var el = document.getElementById("store-stars");
    if (!el) return;
    var html = '<div class="star-row">';
    for (var i = 1; i <= 5; i++) {
      html +=
        '<button type="button" class="star-btn' +
        (state.editingStore.rating >= i ? " on" : "") +
        '" data-action="store-star" data-value="' +
        i +
        '">★</button>';
    }
    html += "</div>";
    el.innerHTML = html;
  }

  function renderStorePhoto() {
    var el = document.getElementById("store-photo");
    var upload = document.getElementById("store-upload");
    if (!el) return;
    if (state.editingStore.photo) {
      el.innerHTML =
        '<img class="photo-preview" data-action="view-photo" data-src="' +
        state.editingStore.photo +
        '" src="' +
        state.editingStore.photo +
        '" alt="店铺照片" style="cursor:zoom-in;">' +
        '<button class="link-btn" data-action="clear-store-photo" style="margin-top:6px;">移除照片</button>';
      if (upload) upload.style.display = "none";
    } else {
      el.innerHTML = "";
      if (upload) upload.style.display = "";
    }
  }

  function saveStore() {
    var e = state.editingStore;
    var nameInput = document.getElementById("store-name");
    if (e && nameInput) e.name = nameInput.value;
    if (!e || !e.name.trim()) {
      toast("请填写店名");
      return;
    }
    var total = parseFloat(
      String(e.totalSpend == null ? "" : e.totalSpend).replace(/[^\d.]/g, "")
    );
    var people = parseInt(
      String(e.people == null ? "" : e.people).replace(/\D/g, ""),
      10
    );
    e.totalSpend = isNaN(total) ? null : Math.round(total * 100) / 100;
    e.people = !isNaN(people) && people > 0 ? people : null;
    e.price =
      e.totalSpend != null && e.people
        ? Math.round((e.totalSpend / e.people) * 100) / 100
        : null;
    var now = new Date().toISOString();
    var saved = null;
    if (e.id) {
      var idx = state.stores.findIndex(function (s) {
        return s.id === e.id;
      });
      if (idx >= 0) {
        state.stores[idx] = Object.assign({}, state.stores[idx], e, {
          updatedAt: now
        });
        saved = state.stores[idx];
      }
    } else {
      saved = Object.assign({}, e, {
        id: uid(),
        createdAt: now,
        updatedAt: now,
        emoji: e.emoji || storeEmoji(e.category)
      });
      state.stores.push(saved);
    }
    saveStores();
    if (saved) upsertStoreToCloud(saved);
    state.editingStore = null;
    toast("已保存");
    location.hash = "#/stores";
  }

  function renderStoreDetail(id) {
    if (id.indexOf("r-") === 0) {
      var s = state.stores.find(function (x) {
        return x.id === id.slice(2);
      });
      if (!s) return renderStores();
      var key = storeKey(s);
      var visits = storesByKey(key);
      var idx = visits.findIndex(function (x) {
        return x.id === s.id;
      }) + 1;
      var recommend =
        s.recommend === "yes"
          ? "👍 推荐"
          : s.recommend === "no"
            ? "👎 不推荐"
            : "未标记";
      return (
        '<div class="topbar">' +
        '<button class="icon-btn" data-action="goto" data-to="#/stores" aria-label="返回">‹</button>' +
        "<h2>" +
        esc(s.name) +
        "</h2>" +
        '<button class="icon-btn" data-action="edit-store" data-id="' +
        esc(s.id) +
        '" aria-label="编辑">✎</button></div>' +
        (s.photo
          ? '<button class="big-thumb big-photo" data-action="view-photo" data-src="' +
            s.photo +
            '"><img src="' +
            s.photo +
            '" alt="店铺照片" style="width:100%;height:auto;max-height:460px;object-fit:contain;border-radius:16px;display:block;"></button>'
          : '<div class="big-thumb" aria-hidden="true">' +
            esc(s.emoji || storeEmoji(s.category)) +
            "</div>") +
        '<div style="margin-top:12px;"><div style="font-size:18px;font-weight:600;">' +
        esc(s.name) +
        (s.recommend === "yes" ? " 👍" : s.recommend === "no" ? " 👎" : "") +
        "</div>" +
        '<div style="font-size:12px;color:var(--muted);margin-top:2px;">' +
        esc(s.category || "") +
        (s.address ? " · " + esc(s.address) : "") +
        (s.latitude != null && s.longitude != null
          ? ' <a class="link-btn" target="_blank" rel="noopener" href="https://uri.amap.com/marker?position=' +
            s.longitude +
            "," +
            s.latitude +
            "&name=" +
            encodeURIComponent(s.name) +
            '">打开地图</a>'
          : "") +
        "</div></div>" +
        '<div class="label">到访信息</div>' +
        '<div class="card kv-grid">' +
        '<div><div class="kv-label">类型</div><div class="kv-value">' +
        esc(s.category || "未填") +
        "</div></div>" +
        '<div><div class="kv-label">推荐</div><div class="kv-value">' +
        recommend +
        "</div></div>" +
        '<div><div class="kv-label">人均消费</div><div class="kv-value">' +
        (s.price != null ? "¥" + fmtMoney(s.price) : "未填") +
        "</div></div>" +
        (s.totalSpend != null
          ? '<div><div class="kv-label">总消费 / 人数</div><div class="kv-value">¥' +
            fmtMoney(s.totalSpend) +
            (s.people ? " · " + s.people + " 人" : "") +
            "</div></div>"
          : "") +
        '<div><div class="kv-label">评分</div><div class="kv-value">' +
        (s.rating ? s.rating + " ★" : "未评分") +
        "</div></div>" +
        '<div><div class="kv-label">到访次数</div><div class="kv-value">' +
        visits.length +
        " 次</div></div>" +
        '<div><div class="kv-label">本次</div><div class="kv-value">第 ' +
        idx +
        " 次</div></div>" +
        "</div>" +
        (s.comment
          ? '<div class="label">我的短评</div><div class="quote">' +
            esc(s.comment) +
            "</div>"
          : "") +
        '<div class="label">全部到访</div>' +
        '<div class="card">' +
        visits
          .map(function (v, i) {
            return storeVisitRow(v, i + 1);
          })
          .join("") +
        "</div>" +
        '<button class="btn btn-ghost" data-action="re-visit" data-id="' +
        esc(s.id) +
        '">再访一次</button>' +
        '<button class="btn btn-primary" data-action="edit-store" data-id="' +
        esc(s.id) +
        '">编辑这次记录</button>' +
        '<button class="btn btn-danger" data-action="delete-store" data-id="' +
        esc(s.id) +
        '">删除这次记录</button>'
      );
    }
    return renderStores();
  }

  function renderProfile() {
    var m = monthStats();
    var loggedIn = authed();
    var avatar = state.profile.avatar || "";
    return (
      '<div class="head"><div><div class="page-title">我的</div>' +
      '<div class="sub">' +
      (loggedIn ? "" : "未登录 · ") +
      "共记录 " +
      state.records.length +
      " 件 · 连续 " +
      streakDays() +
      " 天</div></div>" +
      (loggedIn
        ? '<button class="link-btn" data-action="logout">退出登录</button></div>'
        : '<button class="link-btn" data-action="open-auth">登录 / 注册</button></div>') +
      '<div class="avatar-block">' +
      (loggedIn
        ? '<button class="avatar avatar-lg avatar-edit" data-action="pick-avatar" aria-label="更换头像">' +
          (avatar
            ? '<img src="' + esc(avatar) + '" alt="头像">'
            : esc((state.profile.name || "物").charAt(0))) +
          '<span class="avatar-cam" aria-hidden="true">📷</span>' +
          "</button>"
        : '<div class="avatar avatar-lg" aria-hidden="true">👤</div>') +
      (loggedIn
        ? state.editingNick
          ? '<div class="nick-edit">' +
            '<input class="input" id="nick-input" maxlength="12" value="' +
            esc(state.profile.name) +
            '">' +
            '<button class="btn btn-primary nick-save" data-action="save-nick">保存</button>' +
            "</div>" +
            '<div class="hint" style="margin-top:6px;">回车或点保存确认</div>'
          : '<button class="avatar-name" data-action="edit-nick">' +
            esc(state.profile.name) +
            "</button>"
        : '<div class="avatar-name">未登录</div>' +
          '<div class="avatar-phone">登录后记录自动同步到云端</div>') +
      "</div>" +
      (loggedIn
        ? ""
        : '<div class="card auth-entry">' +
          '<div class="auth-entry-text">登录后，记录会自动同步到云端，换设备登录同一账号也能查看</div>' +
          '<button class="btn btn-primary" data-action="open-auth">登录 / 注册</button>' +
          "</div>") +
      '<div class="section">数据</div>' +
      '<div class="card">' +
      '<a class="row" href="#/review" style="cursor:pointer;">' +
      '<span class="thumb" style="width:36px;height:36px;font-size:16px;" aria-hidden="true">📊</span>' +
      '<span class="row-main"><span class="row-name">月度复盘</span><span class="row-meta">本月 ' +
      m.count +
      " 件 · 均分 " +
      (m.avg ? m.avg.toFixed(1) : "—") +
      "</span></span><span>›</span></a>" +
      '<button class="row" data-action="export" style="cursor:pointer;">' +
      '<span class="thumb" style="width:36px;height:36px;font-size:16px;" aria-hidden="true">⬇️</span>' +
      '<span class="row-main"><span class="row-name">导出我的数据</span><span class="row-meta">下载 JSON 文件</span></span><span>›</span></button>' +
      '<button class="row" data-action="export-excel" style="cursor:pointer;">' +
      '<span class="thumb" style="width:36px;height:36px;font-size:16px;" aria-hidden="true">📊</span>' +
      '<span class="row-main"><span class="row-name">导出 Excel 报表</span><span class="row-meta">下载 .xlsx 表格文件</span></span><span>›</span></button>' +
      "</div>" +
      '<div class="hint" style="margin-top:18px;">' +
      (loggedIn ? syncTip() : "未登录：数据只保存在本机浏览器，登录后自动同步到云端") +
      "</div>"
    );
  }

  function renderCart() {
    var items = pendingCart();
    var high = items.filter(function (item) { return item.priority === "high"; }).length;
    return (
      '<div class="head"><div><div class="page-title">购物车</div>' +
      '<div class="sub">' + items.length + ' 件待购买' + (high ? ' · ' + high + ' 件优先' : '') + '</div></div>' +
      '<button class="icon-btn add-btn" data-action="cart-new" aria-label="新增待购">＋</button></div>' +
      '<div class="cart-toolbar"><input class="input" id="cart-search" type="search" placeholder="在待购清单中搜索" value="' + esc(state.cartSearch) + '"></div>' +
      (items.length ? '<div class="cart-list">' + items.filter(function (item) {
        return !state.cartSearch || (item.name + ' ' + item.note).toLowerCase().indexOf(state.cartSearch.toLowerCase()) >= 0;
      }).map(cartItemHtml).join('') + '</div>' :
        '<div class="empty"><span class="e">🛒</span>购物车还是空的，看到想买的物品就加入吧</div>') +
      ''
    );
  }

  function cartItemHtml(item) {
    var thumb = item.image && /^(https?:|data:image)/.test(item.image)
      ? '<img src="' + esc(item.image) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">'
      : esc(item.image || "🛒");
    return '<div class="card cart-item">' +
      '<span class="thumb">' + thumb + '</span>' +
      '<div class="row-main"><div class="row-name">' + esc(item.name) + '</div>' +
      (item.category ? '<div class="cart-meta">' + esc(item.category) + '</div>' : '') +
      (item.note ? '<div class="cart-note">' + esc(item.note) + '</div>' : '') + '</div>' +
      '<div class="cart-actions"><button class="btn btn-primary btn-small" data-action="cart-purchased" data-id="' + esc(item.id) + '">已买到</button>' +
      '<button class="cart-icon-action" data-action="cart-edit" data-id="' + esc(item.id) + '" aria-label="编辑待购" title="编辑待购">✎</button>' +
      '<button class="cart-icon-action danger" data-action="cart-delete" data-id="' + esc(item.id) + '" aria-label="删除待购" title="删除待购">×</button></div></div>';
  }

  function renderCartForm() {
    var d = state.cartDraft || { name: "", note: "", priority: "normal" };
    return '<div class="topbar"><button class="icon-btn" data-action="cart-cancel" aria-label="返回">‹</button><h2>' +
      (d.id ? "编辑待购" : "添加待购") + '</h2></div>' +
      '<label class="label" for="cart-name">想买什么 *</label><input class="input" id="cart-name" data-cart-bind="name" maxlength="80" placeholder="比如：防晒霜" value="' + esc(d.name) + '">' +
      '<label class="label" for="cart-note">备注（可选）</label><textarea class="textarea" id="cart-note" data-cart-bind="note" placeholder="规格、颜色、想买的原因……">' + esc(d.note) + '</textarea>' +
      '<div class="label">优先级</div><div class="chips">' +
      [{v:"high",t:"优先购买"},{v:"normal",t:"想买"},{v:"low",t:"不着急"}].map(function (x) {
        return '<button type="button" class="chip ' + (d.priority === x.v ? 'on' : '') + '" data-action="cart-priority" data-value="' + x.v + '">' + x.t + '</button>';
      }).join('') + '</div><button class="btn btn-primary" data-action="cart-save">保存待购</button>';
  }

  function renderRecord() {
    var e = state.editing || newRecord();
    return (
      '<div class="topbar">' +
      '<button class="icon-btn" data-action="goto" data-to="#/home" aria-label="返回">‹</button>' +
      "<h2>记录物品</h2></div>" +
      '<button type="button" class="tool-btn" data-action="goto" data-to="#/scan">' +
      '<span class="tool-icon" aria-hidden="true">📷</span>' +
      '<span class="tool-main"><span class="tool-title">扫码自动填写</span>' +
      '<span class="tool-sub">扫条码自动带出商品信息</span></span>' +
      '<span class="tool-chevron" aria-hidden="true">›</span>' +
      "</button>" +
      (e.barcode
        ? '<div class="hint" style="text-align:left;margin-top:8px;">已识别条码：' +
          esc(e.barcode) +
          "</div>"
        : "") +
      '<label class="label" for="rec-name">物品名称 *</label>' +
      '<input class="input" id="rec-name" data-bind="name" value="' +
      esc(e.name) +
      '" placeholder="比如：逐本 清欢洁面乳">' +
      '<label class="label" for="rec-brand">品牌（可选）</label>' +
      '<input class="input" id="rec-brand" data-bind="brand" value="' +
      esc(e.brand) +
      '">' +
      '<div class="label">品类（可选）</div>' +
      '<button type="button" class="select-field" id="rec-cat-field" data-action="open-cat-picker">' +
      '<span class="select-field-value" id="rec-cat-value">未选择</span>' +
      '<span class="select-field-chevron" aria-hidden="true">▾</span>' +
      "</button>" +
      '<div class="label">购买途径（可选）</div>' +
      '<button type="button" class="select-field" id="rec-purch-field" data-action="open-purch-picker">' +
      '<span class="select-field-value" id="rec-purch-value">未选择</span>' +
      '<span class="select-field-chevron" aria-hidden="true">▾</span>' +
      "</button>" +
      '<label class="label" for="rec-price">购买价格（可选）</label>' +
      '<div style="position:relative;">' +
      '<span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);">¥</span>' +
      '<input class="input" id="rec-price" data-bind="price" inputmode="decimal" placeholder="0.00" style="padding-left:28px;" value="' +
      esc(e.price == null ? "" : e.price) +
      '">' +
      "</div>" +
      '<div class="expiry-wrap" id="rec-expiry-wrap" style="display:none;">' +
      '<div class="label">保质期（可选）</div>' +
      '<div class="label" style="margin:0 0 6px;">生产日期</div>' +
      '<input class="input" id="rec-produced" type="date" data-bind="producedDate" value="' +
      esc(e.producedDate || "") +
      '">' +
      '<div class="label" style="margin:12px 0 6px;">保质期时长</div>' +
      '<div class="chips" id="rec-shelf-chips"></div>' +
      '<div class="label" style="margin:12px 0 6px;">到期日</div>' +
      '<input class="input" id="rec-expiry-date" type="date" data-bind="expiryDate" value="' +
      esc(e.expiryDate || "") +
      '">' +
      '<div class="hint" style="text-align:left;margin-top:6px;">到期日 = 生产日期 + 时长；未填生产日期则按今天算。到期前 7 天出现在主页「临期提醒」</div>' +
      "</div>" +
      '<div class="label">我的评分</div>' +
      '<div id="rec-stars"></div>' +
      '<div class="label">推荐吗（可选）</div>' +
      '<div class="chips" id="rec-recommend"></div>' +
      '<label class="label" for="rec-comment">一句话短评（可选）</label>' +
      '<textarea class="textarea" id="rec-comment" data-bind="comment" placeholder="比如：泡沫细腻，不假滑，会回购。">' +
      esc(e.comment || "") +
      "</textarea>" +
      '<div class="label">照片（可选）</div>' +
      '<div class="photo-actions" id="rec-upload">' +
      '<button type="button" class="photo-btn" data-action="pick-photo" data-mode="camera">' +
      '<span class="tool-icon" aria-hidden="true">📸</span><span>拍照</span></button>' +
      '<button type="button" class="photo-btn" data-action="pick-photo">' +
      '<span class="tool-icon" aria-hidden="true">🖼️</span><span>从相册选择</span></button>' +
      "</div>" +
      '<div id="rec-photo"></div>' +
      '<button class="btn btn-primary" data-action="save-record">保存记录</button>'
    );
  }

  function newRecord() {
    state.pendingCartId = null;
    state.editing = {
      id: null,
      name: "",
      brand: "",
      category: "",
      subcategory: "",
      emoji: "📦",
      barcode: "",
      photo: null,
      price: "",
      expiryDate: "",
      purchaseType: null,
      purchaseChannel: null,
      rating: 0,
      repurchase: "unsure",
      recommend: "",
      status: "using",
      comment: "",
      method: "manual"
    };
    return state.editing;
  }

  function renderStars() {
    var el = document.getElementById("rec-stars");
    if (!el) return;
    var e = state.editing;
    var html = '<div class="star-row">';
    for (var i = 1; i <= 5; i++) {
      html +=
        '<button type="button" class="star-btn ' +
        (e.rating >= i ? "on" : "") +
        '" data-action="star" data-value="' +
        i +
        '" aria-label="' +
        i +
        ' 星">★</button>';
    }
    html += "</div>";
    el.innerHTML = html;
  }

  function renderRecordControls() {
    renderStars();
    renderCatField();
    renderPurchField();
    renderExpiry();
    renderRecommend();
    renderPhoto();
  }

  function renderRecommend() {
    var el = document.getElementById("rec-recommend");
    if (!el) return;
    el.innerHTML =
      '<button type="button" class="chip' +
      (state.editing.recommend === "yes" ? " on" : "") +
      '" data-action="recommend-set" data-value="yes">👍 推荐</button>' +
      '<button type="button" class="chip' +
      (state.editing.recommend === "no" ? " on" : "") +
      '" data-action="recommend-set" data-value="no">👎 不推荐</button>';
  }

  function renderExpiry() {
    var wrap = document.getElementById("rec-expiry-wrap");
    if (!wrap) return;
    var cat = state.editing.category;
    var has =
      !!state.editing.expiryDate ||
      !!state.editing.producedDate ||
      !!state.editing.shelfDays;
    var show = has || EXPIRY_CATS.indexOf(cat) >= 0;
    wrap.style.display = show ? "" : "none";
    var chips = document.getElementById("rec-shelf-chips");
    if (chips) {
      var opts = [
        [7, "7 天"],
        [30, "1 个月"],
        [90, "3 个月"],
        [180, "6 个月"],
        [365, "1 年"],
        [730, "2 年"]
      ];
      chips.innerHTML =
        opts
          .map(function (o) {
            return (
              '<button type="button" class="chip' +
              (state.editing.shelfDays === o[0] ? " on" : "") +
              '" data-action="expiry-preset" data-days="' +
              o[0] +
              '">' +
              o[1] +
              "</button>"
            );
          })
          .join("") +
        (has
          ? '<button type="button" class="chip" data-action="expiry-clear">清除</button>'
          : "");
    }
  }

  function recomputeExpiry() {
    var days = state.editing.shelfDays;
    if (!days) return;
    var base = state.editing.producedDate || todayStr();
    var d = new Date(base + "T00:00:00");
    d.setDate(d.getDate() + days);
    var pad2 = function (n) {
      return String(n).padStart(2, "0");
    };
    state.editing.expiryDate =
      d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
    var el = document.getElementById("rec-expiry-date");
    if (el) el.value = state.editing.expiryDate;
  }

  function renderCatField() {
    var el = document.getElementById("rec-cat-value");
    if (!el) return;
    var c = state.editing.category;
    if (!c) {
      el.textContent = "未选择";
      return;
    }
    var emoji = CATEGORY_EMOJI[c] || "📦";
    var text =
      state.editing.subcategory && state.editing.subcategory !== "其他"
        ? c + " · " + state.editing.subcategory
        : c;
    el.textContent = emoji + " " + text;
  }

  function renderPurchField() {
    var el = document.getElementById("rec-purch-value");
    if (!el) return;
    var t = state.editing.purchaseType;
    if (!t) {
      el.textContent = "未选择";
      return;
    }
    var meta = PURCHASE_TYPES.find(function (x) {
      return x.value === t;
    });
    var emoji = PURCHASE_EMOJI[t] || "🛍️";
    var label = meta ? meta.label : "";
    var channel = state.editing.purchaseChannel;
    el.textContent = emoji + " " + (channel ? label + " · " + channel : label);
  }

  function openSheet(cfg) {
    var overlay = document.getElementById(cfg.id);
    if (overlay) {
      overlay.style.display = "flex";
    } else {
      var sheet = document.createElement("div");
      sheet.id = cfg.id;
      sheet.className = "sheet-overlay";
      sheet.setAttribute("data-action", "sheet-close");
      sheet.innerHTML =
        '<div class="sheet" data-action="sheet-noop">' +
        '<div class="sheet-head">' +
        '<div class="sheet-title">' +
        cfg.title +
        "</div>" +
        '<div class="sheet-actions">' +
        '<button type="button" class="link-btn" data-action="' +
        cfg.clearAction +
        '">清除</button>' +
        '<button type="button" class="icon-btn" data-action="sheet-close" aria-label="关闭">✕</button>' +
        "</div></div>" +
        '<div class="cat-grid" id="' +
        cfg.gridId +
        '"></div>' +
        '<div id="' +
        cfg.subId +
        '"></div>' +
        "</div>";
      document.getElementById("app").appendChild(sheet);
    }
    cfg.render();
  }

  function closeSheets() {
    ["cat-sheet", "purch-sheet", "auth-sheet", "filter-sheet"].forEach(function (id) {
      var overlay = document.getElementById(id);
      if (overlay) overlay.style.display = "none";
    });
  }

  function openCatPicker() {
    openSheet({
      id: "cat-sheet",
      title: "选择品类",
      clearAction: "cat-clear",
      gridId: "cat-main",
      subId: "cat-sub",
      render: renderCatSheet
    });
  }

  function openPurchPicker() {
    openSheet({
      id: "purch-sheet",
      title: "选择购买途径",
      clearAction: "purch-clear",
      gridId: "purch-main",
      subId: "purch-sub",
      render: renderPurchSheet
    });
  }

  function renderCatSheet() {
    var main = document.getElementById("cat-main");
    if (!main) return;
    main.innerHTML = CATEGORIES.map(function (c) {
      return (
        '<button type="button" class="cat-tile ' +
        (state.editing.category === c ? "on" : "") +
        '" data-action="cat-main" data-value="' +
        c +
        '">' +
        '<span class="cat-tile-emoji" aria-hidden="true">' +
        (CATEGORY_EMOJI[c] || "📦") +
        "</span>" +
        "<span>" +
        c +
        "</span></button>"
      );
    }).join("");
    var sub = document.getElementById("cat-sub");
    if (!sub) return;
    var list = state.editing.category
      ? CATEGORY_SUBS[state.editing.category]
      : null;
    if (!list) {
      sub.innerHTML =
        '<div class="hint" style="text-align:left;margin-top:14px;">点选大类后，可再选小类</div>';
      return;
    }
    sub.innerHTML =
      '<div class="label" style="margin-top:14px;">小类（可选）</div>' +
      '<div class="chips">' +
      list
        .map(function (o) {
          return (
            '<button type="button" class="chip ' +
            (state.editing.subcategory === o ? "on" : "") +
            '" data-action="cat-sub" data-value="' +
            o +
            '">' +
            o +
            "</button>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderPurchSheet() {
    var main = document.getElementById("purch-main");
    if (!main) return;
    main.innerHTML = PURCHASE_TYPES.map(function (t) {
      return (
        '<button type="button" class="cat-tile ' +
        (state.editing.purchaseType === t.value ? "on" : "") +
        '" data-action="purch-main" data-value="' +
        t.value +
        '">' +
        '<span class="cat-tile-emoji" aria-hidden="true">' +
        (PURCHASE_EMOJI[t.value] || "🛍️") +
        "</span><span>" +
        t.label +
        "</span></button>"
      );
    }).join("");
    var sub = document.getElementById("purch-sub");
    if (!sub) return;
    var list = state.editing.purchaseType
      ? PURCHASE_CHANNELS[state.editing.purchaseType]
      : null;
    if (!list) {
      sub.innerHTML =
        '<div class="hint" style="text-align:left;margin-top:14px;">' +
        (state.editing.purchaseType === "gift"
          ? "选好了，点其他区域或 ✕ 关闭即可"
          : "先选线上 / 线下，再选具体渠道") +
        "</div>";
      return;
    }
    sub.innerHTML =
      '<div class="label" style="margin-top:14px;">具体渠道</div>' +
      '<div class="chips">' +
      list
        .map(function (o) {
          return (
            '<button type="button" class="chip ' +
            (state.editing.purchaseChannel === o.value ? "on" : "") +
            '" data-action="purch-channel" data-value="' +
            o.value +
            '">' +
            o.label +
            "</button>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderPhoto() {
    var el = document.getElementById("rec-photo");
    var upload = document.getElementById("rec-upload");
    if (!el) return;
    if (state.editing.photo) {
      el.innerHTML =
        '<img class="photo-preview" data-action="view-photo" data-src="' +
        state.editing.photo +
        '" src="' +
        state.editing.photo +
        '" alt="物品照片" style="cursor:zoom-in;">' +
        '<button class="link-btn" data-action="clear-photo" style="margin-top:6px;">移除照片</button>';
      if (upload) upload.style.display = "none";
    } else {
      el.innerHTML = "";
      if (upload) upload.style.display = "";
    }
  }

  function renderDetail(id) {
    if (id.indexOf("r-") === 0) {
      var r = state.records.find(function (x) {
        return x.id === id.slice(2);
      });
      if (!r) return renderHome();
      var key0 = itemKey(r);
      var same = recordsByKey(key0);
      var idx = same.findIndex(function (x) {
        return x.id === r.id;
      }) + 1;
      return (
        '<div class="topbar">' +
        '<button class="icon-btn" data-action="goto" data-to="#/home" aria-label="返回">‹</button>' +
        "<h2>我的记录</h2>" +
        '<button class="icon-btn" data-action="edit-record" data-id="' +
        esc(r.id) +
        '" aria-label="编辑">✎</button></div>' +
        (r.photo
          ? '<button class="big-thumb big-photo" data-action="view-photo" data-src="' +
            r.photo +
            '" aria-label="查看大图"><img src="' +
            r.photo +
            '" alt="物品照片" style="width:100%;height:auto;max-height:460px;object-fit:contain;border-radius:16px;display:block;"></button>'
          : '<div class="big-thumb" aria-hidden="true">' +
            esc(recordEmoji(r)) +
            "</div>") +
        '<div style="margin-top:12px;"><div style="font-size:18px;font-weight:600;">' +
        esc(r.name) +
        "</div>" +
        '<div style="font-size:12px;color:var(--muted);margin-top:2px;">' +
        esc(r.brand || "") +
        (r.brand ? " · " : "") +
        esc(categoryLabel(r)) +
        "</div>" +
        (same.length > 1
          ? '<div style="font-size:12px;color:var(--accent);margin-top:4px;">已买 ' +
            same.length +
            " 次 · 这是第 " +
            idx +
            " 次</div>"
          : "") +
        "</div>" +
        '<div class="label">我的记录</div>' +
        '<div class="card kv-grid">' +
        '<div><div class="kv-label">我的评分</div><div class="kv-value">' +
        (r.rating ? r.rating + " ★" : "未评分") +
        "</div></div>" +
        (r.recommend
          ? '<div><div class="kv-label">推荐</div><div class="kv-value">' +
            (r.recommend === "yes" ? "👍 推荐" : "👎 不推荐") +
            "</div></div>"
          : "") +
        '<div><div class="kv-label">品类</div><div class="kv-value">' +
        esc(categoryLabel(r)) +
        "</div></div>" +
        '<div><div class="kv-label">购买途径</div><div class="kv-value">' +
        esc(purchaseLabel(r) || "未填写") +
        "</div></div>" +
        '<div><div class="kv-label">价格</div><div class="kv-value">' +
        (r.price != null ? "¥" + fmtMoney(r.price) : "未填") +
        "</div></div>" +
        '<div><div class="kv-label">回购</div><div class="kv-value">' +
        esc(repurchaseText(r)) +
        "</div></div>" +
        '<div><div class="kv-label">记录时间</div><div class="kv-value">' +
        esc(fmtDate(r.createdAt)) +
        "</div></div>" +
        (r.producedDate
          ? '<div><div class="kv-label">生产日期</div><div class="kv-value">' +
            esc(r.producedDate) +
            "</div></div>"
          : "") +
        (r.expiryDate
          ? '<div><div class="kv-label">保质期</div><div class="kv-value">' +
            esc(r.expiryDate) +
            (r.status === "using"
              ? ' <span class="tag ' +
                expiryBadgeClass(daysLeft(r.expiryDate)) +
                '">' +
                expiryLabel(daysLeft(r.expiryDate)) +
                "</span>"
              : "") +
            "</div></div>"
          : "") +
        "</div>" +
        (r.expiryDate
          ? '<div class="label">使用状态</div>' +
            '<div class="status-chips">' +
            [
              ["using", "使用中"],
              ["finished", "已用完"],
              ["abandoned", "已处理"]
            ]
              .map(function (o) {
                return (
                  '<button type="button" class="chip ' +
                  (r.status === o[0] ? "on" : "") +
                  '" data-action="set-status" data-id="' +
                  esc(r.id) +
                  '" data-value="' +
                  o[0] +
                  '">' +
                  o[1] +
                  "</button>"
                );
              })
              .join("") +
            "</div>" +
            '<div class="hint" style="text-align:left;margin-top:6px;">标记「已用完」后不再进入临期提醒</div>'
          : "") +
         (r.comment
           ? '<div class="label">我的短评</div><div class="quote">' +
            esc(r.comment) +
            "</div>"
           : "") +
        '<button class="btn btn-ghost" data-action="cart-add-record" data-id="' + esc(r.id) + '">' +
        (cartItemForRecord(r) ? "已在购物车 · 移出" : "加入购物车") +
        '</button>' +
        '<button class="btn btn-ghost" data-action="re-buy" data-id="' +
        esc(r.id) +
        '">再买一次</button>' +
        '<button class="btn btn-primary" data-action="edit-record" data-id="' +
        esc(r.id) +
        '">编辑这条记录</button>' +
        '<button class="btn btn-danger" data-action="delete-record" data-id="' +
        esc(r.id) +
        '">删除这条记录</button>'
      );
    }
    if (id.indexOf("c-") === 0) {
      var c2 = WUJI_CATALOG.find(function (x) {
        return x.id === id.slice(2);
      });
      if (!c2) return renderHome();
      var mine = recordsForCatalog(c2);
      return (
        '<div class="topbar">' +
        '<button class="icon-btn" data-action="goto" data-to="#/discover" aria-label="返回">‹</button>' +
        "<h2>商品详情</h2>" +
        '<button class="icon-btn" data-action="record-catalog" data-id="' +
        esc(c2.id) +
        '" aria-label="记录">＋</button></div>' +
        '<div class="big-thumb" aria-hidden="true">' +
        esc(c2.emoji) +
        "</div>" +
        '<div style="margin-top:12px;"><div style="font-size:18px;font-weight:600;">' +
        esc(c2.name) +
        "</div>" +
        '<div style="font-size:12px;color:var(--muted);margin-top:2px;">' +
        esc(c2.brand) +
        " · " +
        esc(c2.category) +
        "</div></div>" +
        (mine.length
          ? '<div class="label">我记录过</div><div class="card">' +
            mine
              .map(function (r) {
                return itemRow(r, "#/detail/r-" + r.id);
              })
              .join("") +
            "</div>"
          : "") +
        '<button class="btn btn-primary" data-action="record-catalog" data-id="' +
        esc(c2.id) +
        '">记录这件物品</button>'
      );
    }
    return renderHome();
  }

  function renderReview() {
    var m = monthStats();
    var catMax = m.cats.length
      ? Math.max.apply(
          null,
          m.cats.map(function (c) {
            return c.count;
          })
        )
      : 1;
    return (
      '<div class="topbar">' +
      '<button class="icon-btn" data-action="goto" data-to="#/profile" aria-label="返回">‹</button>' +
      "<h2>" +
      monthPrefix().replace("-", " 年 ") +
      " 月复盘</h2>" +
      '<button class="icon-btn" data-action="goto" data-to="#/home" aria-label="关闭">×</button></div>' +
      '<div class="stat-grid">' +
      '<div class="stat"><b>' +
      m.count +
      "</b><span>件记录</span></div>" +
      '<div class="stat"><b>' +
      m.activeDays +
      "</b><span>记录天数</span></div>" +
      '<div class="stat"><b>' +
      (m.totalSpend ? "¥" + fmtMoney(m.totalSpend) : "—") +
      "</b><span>本月花费</span></div>" +
      '<div class="stat"><b>' +
      Math.round(m.repurchaseRate * 100) +
      "%</b><span>回购率</span></div></div>" +
      (m.best
        ? '<div class="card" style="margin-top:12px;">' +
          '<div style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;">🏆 本月最佳</div>' +
          '<div class="row" style="cursor:default;">' +
          '<span class="thumb" aria-hidden="true">' +
          esc(recordEmoji(m.best)) +
          "</span>" +
          '<span class="row-main"><span class="row-name">' +
          esc(m.best.name) +
          '</span><span class="row-meta">' +
          m.best.rating +
          " 分 · " +
          repurchaseText(m.best) +
          "</span></span>" +
          '<span class="tag green">推荐</span></div>' +
          (m.worst && m.worst.id !== m.best.id
            ? '<div style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;margin-top:10px;">💣 本月踩雷</div>' +
              '<div class="row" style="cursor:default;">' +
              '<span class="thumb" aria-hidden="true">' +
              esc(recordEmoji(m.worst)) +
              "</span>" +
              '<span class="row-main"><span class="row-name">' +
              esc(m.worst.name) +
              '</span><span class="row-meta">' +
              m.worst.rating +
              " 分 · " +
              repurchaseText(m.worst) +
              "</span></span>" +
              '<span class="tag red">踩雷</span></div>'
            : "") +
          "</div>"
        : '<div class="empty" style="margin-top:12px;"><span class="e">📝</span>本月还没有评分记录</div>') +
      '<div class="section">品类分布</div>' +
      '<div class="card">' +
      (m.cats.length
        ? m.cats
            .map(function (c) {
              return (
                '<div class="dist-row"><span>' +
                esc(c.name) +
                "</span><div class=\"bar\"><span style=\"width:" +
                Math.round((c.count / catMax) * 100) +
                '%"></span></div><span>' +
                c.count +
                "</span></div>"
              );
            })
            .join("")
        : "本月还没有记录") +
      "</div>" +
      '<div class="quote" style="margin-top:12px;">' +
      "<b>一句话总结：</b>" +
      (m.count
        ? "本月共记录 " +
          m.count +
          " 件物品，均分 " +
          (m.avg ? m.avg.toFixed(1) : "—") +
          "。" +
          (m.best ? "最值得的是「" + m.best.name + "」。" : "") +
          (m.worst && m.worst.id !== m.best.id
            ? "「" + m.worst.name + "」踩雷，已避雷。"
            : "")
        : "先记下第一件物品，下个月就有复盘啦。") +
      "</div>" +
      '<button class="btn btn-ghost" data-action="goto" data-to="#/home">回到首页</button>'
    );
  }

  function renderScan() {
    return (
      '<div class="topbar">' +
      '<button class="icon-btn" data-action="goto" data-to="#/record" aria-label="返回">‹</button>' +
      "<h2>扫码</h2>" +
      '<button class="link-btn" data-action="goto" data-to="#/record">手动填写</button></div>' +
      '<video class="scan-video" id="scan-video" muted playsinline></video>' +
      '<div class="hint" id="scan-tip">把条码对准摄像头</div>' +
      '<button class="link-btn" id="scan-retry" data-action="scan-retry" style="display:none;margin:8px auto 0;">重新打开摄像头</button>' +
      '<div class="label">或手动输入条码</div>' +
      '<div class="scan-row">' +
      '<input class="input" id="scan-manual" type="text" placeholder="输入 13 位条码">' +
      '<button class="btn btn-ghost" data-action="scan-lookup">查找</button></div>' +
      '<div class="hint">识别成功会自动带出商品信息；查不到就手动填写，录过的物品下次会秒识别。</div>'
    );
  }

  /* ---------- router ---------- */

  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    var parts = h.split("?")[0].split("/");
    return { path: parts[0] || "home", id: parts[1] || null };
  }

  if (!location.hash || location.hash === "#" || location.hash === "#/") {
    location.hash = "#/record";
  }

  var VIEWS = {
    home: renderHome,
    items: renderItems,
    cart: renderCart,
    "cart-form": renderCartForm,
    stores: renderStores,
    "store-record": renderStoreRecord,
    "store-detail": renderStoreDetail,
    profile: renderProfile,
    record: renderRecord,
    detail: renderDetail,
    review: renderReview,
    scan: renderScan
  };

  function route() {
    stopScanner();
    closeSheets();
    var r = parseHash();
    var fn = VIEWS[r.path] || renderHome;
    view.innerHTML = fn(r.id);
    var tab =
      r.path === "home" ||
      r.path === "items" ||
      r.path === "stores" ||
      r.path === "cart" ||
      r.path === "profile"
        ? r.path
        : state.lastTab;
    if (
      r.path === "home" ||
      r.path === "items" ||
      r.path === "stores" ||
      r.path === "cart" ||
      r.path === "profile"
    ) {
      state.lastTab = r.path;
    }
    document.querySelectorAll(".nav-btn").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-tab") === tab);
    });
    if (r.path === "record") {
      if (!state.editing) newRecord();
      renderRecordControls();
    }
    if (r.path === "store-record") {
      if (!state.editingStore) newStore();
      renderStoreControls();
      if (!locRequested) {
        locRequested = true;
        getUserLoc(function (loc) {
          if (loc) toast("已获取当前位置，可直接搜索附近店铺");
        });
      }
    }
    if (r.path === "scan") {
      startScanner();
    }
    updateCartBadge();
    window.scrollTo(0, 0);
  }

  /* ---------- photo ---------- */

  function readPhoto(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 640;
        var w = img.width;
        var h = img.height;
        if (w > max || h > max) {
          var ratio = Math.min(max / w, max / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        try {
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } catch (e) {
          resolve(null);
        }
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }

  /* ---------- scanner ---------- */

  function startScanner() {
    var video = document.getElementById("scan-video");
    var tip = document.getElementById("scan-tip");
    var retry = document.getElementById("scan-retry");
    if (!video) return;
    if (retry) retry.style.display = "none";
    if (!window.isSecureContext) {
      if (tip) {
        tip.textContent =
          "当前地址不是加密连接（https），摄像头无法使用，可手动输入条码";
      }
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (tip) {
        tip.textContent =
          "当前浏览器不支持摄像头（微信等内置浏览器常见）。请点右上角「···」选择在 Safari 中打开，或直接在下方输入条码。";
      }
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        state.scanTracks = stream.getTracks();
        video.srcObject = stream;
        return video.play();
      })
      .then(function () {
        if ("BarcodeDetector" in window) {
          var detector = new BarcodeDetector({
            formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "qr_code"]
          });
          function tick() {
            if (!state.scanRaf) return;
            detector
              .detect(video)
              .then(function (codes) {
                if (codes && codes.length) {
                  handleBarcode(codes[0].rawValue);
                  return;
                }
                state.scanRaf = requestAnimationFrame(tick);
              })
              .catch(function () {
                state.scanRaf = requestAnimationFrame(tick);
              });
          }
          state.scanRaf = requestAnimationFrame(tick);
        } else {
          loadZxing(video, tip);
        }
      })
      .catch(function (err) {
        if (tip) {
          tip.textContent =
            "无法打开摄像头（" +
            (err && err.message ? err.message : "权限被拒绝或设备不支持") +
            "）。可点“重新打开摄像头”重试，或手动输入条码";
        }
        if (retry) retry.style.display = "inline-block";
      });
  }

  function stopScanner() {
    if (state.scanRaf) {
      cancelAnimationFrame(state.scanRaf);
      state.scanRaf = null;
    }
    if (state.zxingReader) {
      try {
        state.zxingReader.reset();
      } catch (e) {}
      state.zxingReader = null;
    }
    if (state.scanTracks) {
      state.scanTracks.forEach(function (t) {
        t.stop();
      });
      state.scanTracks = null;
    }
  }

  function loadZxing(video, tip) {
    if (window.ZXing) {
      startZxing(video);
      return;
    }
    var s = document.createElement("script");
    s.src = "libs/zxing.min.js";
    s.onload = function () {
      if (window.ZXing) startZxing(video);
      else if (tip) tip.textContent = "识别组件加载失败，可手动输入条码";
    };
    s.onerror = function () {
      if (tip) tip.textContent = "识别组件加载失败，可手动输入条码";
    };
    document.head.appendChild(s);
  }

  function startZxing(video) {
    try {
      var codeReader = new ZXing.BrowserMultiFormatReader();
      state.zxingReader = codeReader;
      codeReader.decodeFromVideoDevice(undefined, video, function (result) {
        if (result) {
          try {
            codeReader.reset();
          } catch (e) {}
          state.zxingReader = null;
          handleBarcode(result.getText());
        }
      });
    } catch (e) {
      var tip = document.getElementById("scan-tip");
      if (tip) tip.textContent = "识别组件启动失败，可手动输入条码";
    }
  }

  function fillFromInfo(info) {
    if (info.name) state.editing.name = info.name;
    if (info.brand) state.editing.brand = info.brand;
    if (info.category) state.editing.category = info.category;
    if (info.emoji) state.editing.emoji = info.emoji;
    if (info.photo) state.editing.photo = info.photo;
    if (info.price != null && info.price !== "") state.editing.price = info.price;
  }

  function handleBarcode(raw) {
    stopScanner();
    if (!state.editing) newRecord();
    state.editing.barcode = String(raw || "").trim();
    if (!state.editing.barcode) {
      toast("未识别到条码");
      return;
    }
    var cached = state.barcodeCache[state.editing.barcode];
    if (cached && !cached.unknown) {
      fillFromInfo(cached);
      toast("已找到：" + (cached.name || "商品"));
      location.hash = "#/record";
      return;
    }
    toast("正在查询商品信息…");
    var code = state.editing.barcode;
    var apiUrl = "/api/barcode-lookup?barcode=" + encodeURIComponent(code);
    fetch(apiUrl)
      .then(function (res) {
        if (!res.ok) throw new Error("api-zero status " + res.status);
        return res.json();
      })
      .then(function (data) {
        var d = data && data.data;
        if (data && data.code === 0 && d && d.found && (d.name || d.brand)) {
          var info = {
            name: d.name || d.brand || "商品 " + code,
            brand: d.brand || "",
            category: d.category || "",
            emoji: "📦",
            price: d.price != null && d.price !== "" ? d.price : "",
            photo: d.image || null
          };
          if (
            d.name &&
            d.spec &&
            d.name.indexOf(String(d.spec)) < 0
          ) {
            info.name = info.name + " " + d.spec;
          }
          state.barcodeCache[code] = info;
          saveBarcodeCache();
          fillFromInfo(info);
          toast("已识别：" + info.name);
          location.hash = "#/record";
          return;
        }
        return lookupOpenFoodFacts(code);
      })
      .catch(function () {
        return lookupOpenFoodFacts(code);
      });
  }

  function lookupOpenFoodFacts(code) {
    return fetch(
      "https://world.openfoodfacts.org/api/v2/product/" +
        encodeURIComponent(code) +
        ".json"
    )
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data && data.status === 1 && data.product) {
          var p = data.product;
          var info = {
            name:
              p.product_name_zh ||
              p.product_name ||
              p.generic_name_zh ||
              p.generic_name ||
              "商品 " + code,
            brand: p.brands || "",
            category: "",
            emoji: "📦",
            photo: p.image_front_url || p.image_url || null
          };
          state.barcodeCache[code] = info;
          saveBarcodeCache();
          fillFromInfo(info);
          toast("已识别：" + info.name);
        } else {
          state.barcodeCache[code] = {
            name: "",
            brand: "",
            category: "",
            emoji: "📦",
            photo: null,
            price: "",
            unknown: true
          };
          saveBarcodeCache();
          toast("库中暂无此商品，请手动填写");
        }
        location.hash = "#/record";
      })
      .catch(function () {
        toast("查询失败，请手动填写");
        location.hash = "#/record";
      });
  }

  /* ---------- actions ---------- */

  function saveRecord() {
    var e = state.editing;
    if (!e || !e.name.trim()) {
      toast("请填写物品名称");
      return;
    }
    var price = parseFloat(
      String(e.price == null ? "" : e.price).replace(/[^\d.]/g, "")
    );
    e.price = isNaN(price) ? null : Math.round(price * 100) / 100;
    if (e.barcode) {
      state.barcodeCache[e.barcode] = {
        name: e.name,
        brand: e.brand || "",
        category: e.category || "",
        emoji: e.emoji || "📦",
        photo: e.photo || null,
        price: e.price == null || e.price === "" ? "" : e.price
      };
      saveBarcodeCache();
    }
    var now = new Date().toISOString();
    var savedRec = null;
    if (e.id) {
      var idx = state.records.findIndex(function (r) {
        return r.id === e.id;
      });
      if (idx >= 0) {
        state.records[idx] = Object.assign({}, state.records[idx], e, {
          updatedAt: now
        });
        savedRec = state.records[idx];
      }
    } else {
      savedRec = Object.assign({}, e, {
        id: uid(),
        createdAt: now,
        updatedAt: now
      });
      state.records.push(savedRec);
    }
    saveRecords();
    if (savedRec) upsertRecordToCloud(savedRec);
    if (savedRec && state.pendingCartId) {
      var purchasedItem = state.cart.find(function (item) { return item.id === state.pendingCartId; });
      if (purchasedItem) {
        purchasedItem.status = "purchased";
        purchasedItem.purchasedAt = now;
        purchasedItem.updatedAt = now;
        purchasedItem.sourceRecordId = savedRec.id;
        saveCart();
        upsertCartToCloud(purchasedItem);
      }
      state.pendingCartId = null;
    }
    state.editing = null;
    toast("已保存");
    location.hash = "#/home";
  }

  function addCartItemFromRecord(record) {
    if (!record || cartItemForRecord(record)) {
      toast("这件物品已经在购物车里");
      return;
    }
    var now = new Date().toISOString();
    var item = {
      id: "cart-" + uid(),
      name: record.name || "",
      note: "",
      priority: "normal",
      sourceRecordId: record.id,
      category: record.category || "",
      image: record.photo || record.emoji || "🛒",
      status: "pending",
      createdAt: now,
      purchasedAt: null,
      updatedAt: now
    };
    state.cart.push(item);
    saveCart();
    upsertCartToCloud(item);
    updateCartBadge();
    if (parseHash().path === "items") route();
    toast("已加入购物车");
  }

  function beginCartFromRecord(record) {
    if (!record) return;
    var existing = cartItemForRecord(record);
    if (existing) {
      state.cart = state.cart.filter(function (item) { return item.id !== existing.id; });
      saveCart();
      deleteCartInCloud(existing.id);
      updateCartBadge();
      route();
      toast("已移出购物车");
      return;
    }
    addCartItemFromRecord(record);
  }

  function purchaseCartItem(id) {
    var item = state.cart.find(function (x) { return x.id === id; });
    if (!item) return;
    newRecord();
    state.pendingCartId = item.id;
    state.editing.name = item.name;
    state.editing.category = item.category || "";
    state.editing.emoji = item.image && item.image.length <= 4 ? item.image : "📦";
    state.editing.comment = item.note || "";
    location.hash = "#/record";
    toast("已带入记录表单，补充购买信息后保存");
  }

  function saveCartDraft() {
    var d = state.cartDraft;
    if (!d || !String(d.name || "").trim()) {
      toast("请填写想买的物品名称");
      return;
    }
    var now = new Date().toISOString();
    if (d.id) {
      var idx = state.cart.findIndex(function (x) { return x.id === d.id; });
      if (idx >= 0) state.cart[idx] = Object.assign({}, state.cart[idx], d, { name: d.name.trim(), updatedAt: now });
    } else {
      state.cart.push(Object.assign({}, d, { id: "cart-" + uid(), name: d.name.trim(), status: "pending", createdAt: now, updatedAt: now }));
    }
    var saved = state.cart.find(function (x) { return x.id === d.id; }) || state.cart[state.cart.length - 1];
    saveCart();
    upsertCartToCloud(saved);
    state.cartDraft = null;
    updateCartBadge();
    location.hash = "#/cart";
    toast("已保存待购");
  }

  document.getElementById("app").addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-action]");
    if (!el) return;
    var action = el.getAttribute("data-action");
    var value = el.getAttribute("data-value");
    var key = el.getAttribute("data-key");

    if (action === "goto") {
      location.hash = el.getAttribute("data-to");
      return;
    }
    if (action === "auth-mode") {
      setAuthMode(value);
      return;
    }
    if (action === "open-auth") {
      openAuthSheet();
      return;
    }
    if (action === "auth-close") {
      closeAuthSheet();
      return;
    }
    if (action === "auth-submit") {
      submitAuth();
      return;
    }
    if (action === "logout") {
      signOut();
      return;
    }
    if (action === "new-record") {
      newRecord();
      location.hash = "#/record";
      return;
    }
    if (action === "cart-add-record" || action === "cart-remove") {
      var cartRecord = state.records.find(function (x) { return x.id === el.getAttribute("data-id"); });
      if (cartRecord) beginCartFromRecord(cartRecord);
      return;
    }
    if (action === "cart-new") {
      state.cartDraft = { id: null, name: "", note: "", priority: "normal" };
      location.hash = "#/cart-form";
      return;
    }
    if (action === "cart-edit") {
      var editCart = state.cart.find(function (x) { return x.id === el.getAttribute("data-id"); });
      if (editCart) {
        state.cartDraft = Object.assign({}, editCart);
        location.hash = "#/cart-form";
      }
      return;
    }
    if (action === "cart-cancel") {
      state.cartDraft = null;
      location.hash = "#/cart";
      return;
    }
    if (action === "cart-priority") {
      if (state.cartDraft) state.cartDraft.priority = value || "normal";
      route();
      return;
    }
    if (action === "cart-save") {
      saveCartDraft();
      return;
    }
    if (action === "cart-purchased") {
      purchaseCartItem(el.getAttribute("data-id"));
      return;
    }
    if (action === "cart-delete") {
      var deleteCartId = el.getAttribute("data-id");
      if (confirm("确定从购物车删除这件待购物品吗？")) {
        state.cart = state.cart.filter(function (x) { return x.id !== deleteCartId; });
        saveCart();
        deleteCartInCloud(deleteCartId);
        updateCartBadge();
        route();
        toast("已删除");
      }
      return;
    }
    if (action === "open-filter") {
      openFilterSheet();
      return;
    }
    if (action === "filter-set") {
      var grp = el.getAttribute("data-group");
      state.itemsFilter[grp] = value || "";
      refreshItemsAfterFilter();
      return;
    }
    if (action === "filter-reset") {
      Object.keys(state.itemsFilter).forEach(function (k) {
        state.itemsFilter[k] = "";
      });
      refreshItemsAfterFilter();
      return;
    }
    if (action === "filter-close" || action === "filter-done") {
      closeSheets();
      return;
    }
    if (action === "toggle-items") {
      var tkey = el.getAttribute("data-key");
      state.expandedItems[tkey] = !state.expandedItems[tkey];
      var tlist = document.getElementById("items-list");
      if (tlist) tlist.innerHTML = itemsListHtml();
      return;
    }
    if (action === "edit-record") {
      var r0 = state.records.find(function (x) {
        return x.id === el.getAttribute("data-id");
      });
      if (r0) {
        state.editing = Object.assign({}, r0);
        location.hash = "#/record";
      }
      return;
    }
    if (action === "re-buy") {
      var src = state.records.find(function (x) {
        return x.id === el.getAttribute("data-id");
      });
      if (src) {
        newRecord();
        state.editing.name = src.name;
        state.editing.brand = src.brand;
        state.editing.category = src.category || "";
        state.editing.subcategory = src.subcategory || "";
        state.editing.emoji = src.emoji || "📦";
        location.hash = "#/record";
      }
      return;
    }
    if (action === "record-catalog") {
      var c3 = WUJI_CATALOG.find(function (x) {
        return x.id === el.getAttribute("data-id");
      });
      if (c3) {
        newRecord();
        state.editing.name = c3.name;
        state.editing.brand = c3.brand;
        state.editing.category = c3.category;
        state.editing.emoji = c3.emoji;
        state.editing.barcode = c3.barcode;
        location.hash = "#/record";
      }
      return;
    }
    if (action === "delete-record") {
      var id0 = el.getAttribute("data-id");
      if (confirm("确定删除这条记录吗？删除后不可恢复。")) {
        var del = state.records.find(function (r) {
          return r.id === id0;
        });
        state.records = state.records.filter(function (r) {
          return r.id !== id0;
        });
        saveRecords();
        deleteRecordInCloud(id0);
        if (del) deleteStorageFile(del.photo);
        toast("已删除");
        location.hash = "#/home";
      }
      return;
    }
    if (action === "star") {
      if (state.editing) {
        state.editing.rating = Number(value);
        renderStars();
      }
      return;
    }
    if (action === "chip") {
      if (state.editing) {
        state.editing[key] = value;
      }
      return;
    }
    if (action === "open-cat-picker") {
      if (state.editing) openCatPicker();
      return;
    }
    if (action === "cat-main") {
      if (state.editing) {
        state.editing.category = value;
        state.editing.subcategory = "";
        state.editing.emoji = CATEGORY_EMOJI[value] || "📦";
        renderCatSheet();
        renderCatField();
        renderExpiry();
      }
      return;
    }
    if (action === "cat-sub") {
      if (state.editing) {
        state.editing.subcategory = value;
        renderCatField();
        closeSheets();
      }
      return;
    }
    if (action === "cat-clear") {
      if (state.editing) {
        state.editing.category = "";
        state.editing.subcategory = "";
        renderCatField();
        renderCatSheet();
      }
      return;
    }
    if (action === "open-purch-picker") {
      if (state.editing) openPurchPicker();
      return;
    }
    if (action === "purch-main") {
      if (state.editing) {
        state.editing.purchaseType = value;
        state.editing.purchaseChannel = null;
        renderPurchSheet();
        renderPurchField();
      }
      return;
    }
    if (action === "purch-channel") {
      if (state.editing) {
        state.editing.purchaseChannel = value;
        renderPurchField();
        closeSheets();
      }
      return;
    }
    if (action === "purch-clear") {
      if (state.editing) {
        state.editing.purchaseType = null;
        state.editing.purchaseChannel = null;
        renderPurchField();
        renderPurchSheet();
      }
      return;
    }
    if (action === "sheet-close") {
      closeSheets();
      return;
    }
    if (action === "sheet-noop") {
      return;
    }
    if (action === "expiry-preset") {
      if (!state.editing) return;
      state.editing.shelfDays = Number(el.getAttribute("data-days")) || 7;
      recomputeExpiry();
      renderExpiry();
      return;
    }
    if (action === "expiry-clear") {
      if (state.editing) {
        state.editing.producedDate = "";
        state.editing.shelfDays = null;
        state.editing.expiryDate = "";
        ["rec-produced", "rec-expiry-date"].forEach(function (id) {
          var el2 = document.getElementById(id);
          if (el2) el2.value = "";
        });
        renderExpiry();
      }
      return;
    }
    if (action === "expiry-done") {
      ev.preventDefault();
      var eid = el.getAttribute("data-id");
      var erec = state.records.find(function (r) {
        return r.id === eid;
      });
      if (erec) {
        erec.status = "finished";
        erec.updatedAt = new Date().toISOString();
        saveRecords();
        upsertRecordToCloud(erec);
        route();
        toast("已标记用完");
      }
      return;
    }
    if (action === "set-status") {
      var sid = el.getAttribute("data-id");
      var srec = state.records.find(function (r) {
        return r.id === sid;
      });
      if (srec) {
        srec.status = value || "using";
        srec.updatedAt = new Date().toISOString();
        saveRecords();
        upsertRecordToCloud(srec);
        route();
        toast("状态已更新");
      }
      return;
    }
    if (action === "recommend-set") {
      if (state.editing) {
        state.editing.recommend =
          state.editing.recommend === value ? "" : value;
        renderRecommend();
      }
      return;
    }
    if (action === "new-store") {
      newStore();
      location.hash = "#/store-record";
      return;
    }
    if (action === "store-cat-set") {
      if (state.editingStore) {
        state.editingStore.category = value;
        state.editingStore.emoji = storeEmoji(value);
        renderStoreCats();
      }
      return;
    }
    if (action === "store-recommend") {
      if (state.editingStore) {
        state.editingStore.recommend =
          state.editingStore.recommend === value ? "" : value;
        renderStoreRecommend();
      }
      return;
    }
    if (action === "store-star") {
      if (state.editingStore) {
        state.editingStore.rating = Number(value);
        renderStoreStars();
      }
      return;
    }
    if (action === "store-loc-search") {
      ensureAmap(runStoreLocSearch);
      return;
    }
    if (action === "store-loc-use") {
      locSearchNearMe = !locSearchNearMe;
      var nearButton = document.querySelector('[data-action="store-loc-use"]');
      if (nearButton) {
        nearButton.classList.toggle("on", locSearchNearMe);
        nearButton.textContent = locSearchNearMe
          ? "✓ 附近搜索已开启"
          : "⌖ 使用当前位置缩小范围";
      }
      if (locSearchNearMe) {
        getUserLoc(function () {
          toast("已开启附近搜索，点击查找即可使用当前位置");
        });
      }
      return;
    }
    if (action === "store-loc-pick") {
      var idx = Number(el.getAttribute("data-index"));
      if (storeLocResults && storeLocResults[idx]) {
        var poi = storeLocResults[idx];
        var pos = poi.location;
        state.editingStore.longitude = pos.getLng();
        state.editingStore.latitude = pos.getLat();
        state.editingStore.address =
          poi.name + (poi.address ? " · " + poi.address : "");
        storeLocResults = null;
        renderStoreLocResults();
        renderStoreSelected();
      }
      return;
    }
    if (action === "pick-store-photo") {
      var pInput = document.getElementById("photo-input");
      if (pInput) {
        pInput.removeAttribute("capture");
        if (el.getAttribute("data-mode") === "camera") {
          pInput.setAttribute("capture", "environment");
        }
        pInput.click();
      }
      return;
    }
    if (action === "clear-store-photo") {
      if (state.editingStore) {
        state.editingStore.photo = null;
        renderStorePhoto();
      }
      return;
    }
    if (action === "save-store") {
      saveStore();
      return;
    }
    if (action === "re-visit") {
      var srcStore = state.stores.find(function (s) {
        return s.id === el.getAttribute("data-id");
      });
      if (srcStore) {
        newStore();
        state.editingStore.name = srcStore.name;
        state.editingStore.category = srcStore.category;
        state.editingStore.emoji = srcStore.emoji || storeEmoji(srcStore.category);
        location.hash = "#/store-record";
      }
      return;
    }
    if (action === "edit-store") {
      var es = state.stores.find(function (s) {
        return s.id === el.getAttribute("data-id");
      });
      if (es) {
        state.editingStore = Object.assign({}, es);
        location.hash = "#/store-record";
      }
      return;
    }
    if (action === "delete-store") {
      var sid2 = el.getAttribute("data-id");
      if (confirm("确定删除这次到访记录吗？删除后不可恢复。")) {
        var delStore = state.stores.find(function (s) {
          return s.id === sid2;
        });
        state.stores = state.stores.filter(function (s) {
          return s.id !== sid2;
        });
        saveStores();
        deleteStoreInCloud(sid2);
        if (delStore) deleteStorageFile(delStore.photo);
        toast("已删除");
        location.hash = "#/stores";
      }
      return;
    }
    if (action === "store-cat") {
      state.storeCat = value || "";
      var sf = document.getElementById("store-filter");
      if (sf) sf.innerHTML = renderStoreFilterChips();
      var sl = document.getElementById("store-list");
      if (sl) sl.innerHTML = storeListHtml();
      return;
    }
    if (action === "toggle-store") {
      var skey = el.getAttribute("data-key");
      state.expandedStores[skey] = !state.expandedStores[skey];
      var sl2 = document.getElementById("store-list");
      if (sl2) sl2.innerHTML = storeListHtml();
      return;
    }
    if (action === "save-record") {
      saveRecord();
      return;
    }
    if (action === "pick-photo") {
      var input = document.getElementById("photo-input");
      input.removeAttribute("capture");
      if (el.getAttribute("data-mode") === "camera") {
        input.setAttribute("capture", "environment");
      }
      input.click();
      return;
    }
    if (action === "clear-photo") {
      if (state.editing) {
        state.editing.photo = null;
        renderPhoto();
      }
      return;
    }
    if (action === "view-photo") {
      var src = el.getAttribute("data-src");
      if (src && lightbox && lightboxImg) {
        lightboxImg.setAttribute("src", src);
        lightbox.removeAttribute("hidden");
      }
      return;
    }
    if (action === "scan-lookup") {
      var codeInput = document.getElementById("scan-manual");
      handleBarcode(codeInput ? codeInput.value : "");
      return;
    }
    if (action === "scan-retry") {
      startScanner();
      return;
    }
    if (action === "pick-avatar") {
      var avatarInput = document.getElementById("avatar-input");
      if (avatarInput) avatarInput.click();
      return;
    }
    if (action === "edit-nick") {
      state.editingNick = true;
      route();
      return;
    }
    if (action === "save-nick") {
      saveNick();
      return;
    }
    if (action === "export") {
      var blob = new Blob(
        [JSON.stringify({ profile: state.profile, records: state.records, stores: state.stores, cart: state.cart }, null, 2)],
        { type: "application/json" }
      );
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "wuji-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast("已导出");
      return;
    }
    if (action === "export-excel") {
      if (typeof XLSX === "undefined") {
        toast("导出组件加载失败，请刷新重试");
        return;
      }
      var rows = state.records.map(function (r) {
        return {
          "物品名称": r.name || "",
          "品牌": r.brand || "",
          "品类": r.category || "",
          "小类": r.subcategory || "",
          "购买来源":
            r.purchaseType === "gift"
              ? "别人送的"
              : r.purchaseType === "online"
                ? "线上"
                : r.purchaseType === "offline"
                  ? "线下"
                  : "",
          "购买渠道": r.purchaseChannel || "",
          "价格（元）": r.price == null ? "" : r.price,
          "评分": r.rating || "",
          "推荐":
            r.recommend === "yes"
              ? "推荐"
              : r.recommend === "no"
                ? "不推荐"
                : "",
          "购买日期": r.createdAt ? r.createdAt.slice(0, 10) : "",
          "短评": r.comment || ""
        };
      });
      var ws = XLSX.utils.json_to_sheet(rows);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "物记数据");
      var cartRows = state.cart.map(function (item) {
        return {
          "物品名称": item.name || "",
          "备注": item.note || "",
          "优先级": cartPriorityLabel(item.priority),
          "状态": item.status === "purchased" ? "已买到" : "待购买",
          "添加日期": item.createdAt ? item.createdAt.slice(0, 10) : "",
          "买到日期": item.purchasedAt ? item.purchasedAt.slice(0, 10) : ""
        };
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cartRows), "购物车");
      XLSX.writeFile(wb, "物记数据导出.xlsx");
      toast("已导出 Excel");
      return;
    }
  });

  document.getElementById("view").addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.id === "items-search") {
      state.itemsSearch = t.value;
      var listEl = document.getElementById("items-list");
      if (listEl) listEl.innerHTML = itemsListHtml();
      return;
    }
    if (t.id === "cart-search") {
      state.cartSearch = t.value;
      var cartList = document.querySelector(".cart-list");
      if (cartList) cartList.innerHTML = pendingCart().filter(function (item) {
        return !state.cartSearch || (item.name + " " + item.note).toLowerCase().indexOf(state.cartSearch.toLowerCase()) >= 0;
      }).map(cartItemHtml).join("");
      return;
    }
    if (t.id === "rec-produced") {
      if (state.editing) {
        state.editing.producedDate = t.value;
        if (state.editing.shelfDays) recomputeExpiry();
      }
      return;
    }
    if (t.id === "store-search") {
      state.storeSearch = t.value;
      var sl3 = document.getElementById("store-list");
      if (sl3) sl3.innerHTML = storeListHtml();
      return;
    }
    var bind = t.getAttribute("data-bind");
    var cartBind = t.getAttribute("data-cart-bind");
    if (state.cartDraft && cartBind) {
      state.cartDraft[cartBind] = t.value;
    } else if (state.editing && bind) {
      state.editing[bind] = t.value;
    } else if (state.editingStore && bind) {
      state.editingStore[bind] = t.value;
      if (bind === "totalSpend" || bind === "people") updateStoreAvg();
    }
  });

  document.getElementById("photo-input").addEventListener("change", function (ev) {
    var file = ev.target.files && ev.target.files[0];
    if (!file) return;
    if (state.editingStore) {
      readPhoto(file).then(function (dataUrl) {
        if (dataUrl) {
          var old = state.editingStore.photo;
          uploadImageToStorage(dataUrl).then(function (final) {
            state.editingStore.photo = final;
            if (isStorageUrl(old) && old !== final) deleteStorageFile(old);
            renderStorePhoto();
            toast(
              isStorageUrl(final) ? "已添加照片（云端）" : "已添加照片（本机）"
            );
          });
        } else {
          toast("照片读取失败");
        }
        ev.target.value = "";
      });
      return;
    }
    if (!state.editing) newRecord();
    readPhoto(file).then(function (dataUrl) {
      if (dataUrl) {
        var old = state.editing.photo;
        uploadImageToStorage(dataUrl).then(function (final) {
          state.editing.photo = final;
          if (isStorageUrl(old) && old !== final) deleteStorageFile(old);
          renderPhoto();
          toast(
            isStorageUrl(final) ? "已添加照片（云端）" : "已添加照片（本机）"
          );
        });
      } else {
        toast("照片读取失败");
      }
      ev.target.value = "";
    });
  });

  document.getElementById("avatar-input").addEventListener("change", function (ev) {
    var file = ev.target.files && ev.target.files[0];
    if (!file) return;
    readPhoto(file).then(function (dataUrl) {
      if (dataUrl) {
        var old = state.profile.avatar;
        uploadImageToStorage(dataUrl).then(function (final) {
          state.profile.avatar = final;
          saveProfile();
          upsertProfileToCloud();
          if (isStorageUrl(old) && old !== final) deleteStorageFile(old);
          route();
          toast(
            isStorageUrl(final) ? "头像已更新（云端）" : "头像已更新（本机）"
          );
        });
      } else {
        toast("图片读取失败");
      }
      ev.target.value = "";
    });
  });

  document.getElementById("view").addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && ev.target && ev.target.id === "nick-input") {
      ev.preventDefault();
      saveNick();
    }
    if (
      ev.key === "Enter" &&
      ev.target &&
      ev.target.id === "store-loc-search"
    ) {
      ev.preventDefault();
      ensureAmap(runStoreLocSearch);
    }
  });

  if (lightbox) {
    lightbox.addEventListener("click", function () {
      lightbox.setAttribute("hidden", "");
      if (lightboxImg) lightboxImg.removeAttribute("src");
    });
  }

  window.addEventListener("hashchange", route);

  loadAll();
  restoreSession();
  route();
  if (authed()) {
    var expired =
      state.session.expires_at && Date.now() > state.session.expires_at;
    var proceed = expired ? refreshSession() : Promise.resolve(true);
    proceed.then(function (ok) {
      if (!ok) {
        clearSession();
        route();
        return;
      }
      syncFromCloud();
    });
  }
})();
