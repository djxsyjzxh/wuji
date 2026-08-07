(function () {
  "use strict";

  var LS_RECORDS = "wuji.records.v1";
  var LS_PROFILE = "wuji.profile.v1";
  var LS_SEEDED = "wuji.seeded.v1";
  var LS_BARCODE = "wuji.barcode.v1";

  var REPURCHASE_META = {
    yes: "会回购",
    no: "不会",
    unsure: "不确定"
  };

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
    profile: { name: "小禾" },
    editing: null,
    barcodeCache: {},
    lastTab: "home",
    scanRaf: null,
    scanTracks: null,
    zxingReader: null,
    toastTimer: null
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
    return "未选";
  }

  function categoryLabel(r) {
    if (!r.category) return "未选";
    if (r.subcategory && r.subcategory !== "其他") {
      return r.category + " · " + r.subcategory;
    }
    return r.category;
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

  function purchaseRow(r, i) {
    var rep =
      r.repurchase !== "unsure" ? REPURCHASE_META[r.repurchase] : "";
    return (
      '<a class="row purchase-row" href="#/detail/r-' +
      r.id +
      '">' +
      '<span class="purchase-badge" aria-hidden="true">' +
      i +
      "</span>" +
      '<span class="row-main">' +
      '<span class="purchase-head">' +
      '<span class="purchase-date">' +
      esc(fmtDate(r.createdAt)) +
      "</span>" +
      (r.price != null
        ? '<span class="purchase-price">¥' + esc(fmtMoney(r.price)) + "</span>"
        : "") +
      "</span>" +
      '<span class="purchase-meta">' +
      '<span class="mini-tag">' +
      esc(purchaseLabel(r)) +
      "</span>" +
      (rep
        ? '<span class="mini-tag rep-' +
          r.repurchase +
          '">' +
          rep +
          "</span>"
        : "") +
      "</span>" +
      "</span>" +
      (r.rating ? starText(r.rating) : "") +
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

  function saveBarcodeCache() {
    try {
      localStorage.setItem(LS_BARCODE, JSON.stringify(state.barcodeCache));
    } catch (e) {
      // 缓存失败不影响主功能
    }
  }

  function saveProfile() {
    localStorage.setItem(LS_PROFILE, JSON.stringify(state.profile));
  }

  function loadAll() {
    try {
      var rec = localStorage.getItem(LS_RECORDS);
      state.records = rec ? JSON.parse(rec) : [];
    } catch (e) {
      state.records = [];
    }
    try {
      var prof = localStorage.getItem(LS_PROFILE);
      if (prof) state.profile = Object.assign({ name: "小禾" }, JSON.parse(prof));
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
    var yes = recs.filter(function (r) {
      return r.repurchase === "yes";
    }).length;
    var decided = recs.filter(function (r) {
      return r.repurchase !== "unsure";
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
      repurchaseRate: decided ? yes / decided : 0,
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
    return (
      '<a class="row" href="' +
      href +
      '">' +
      '<span class="thumb" aria-hidden="true">' +
      esc(r.emoji || "📦") +
      "</span>" +
      '<span class="row-main">' +
      '<span class="row-name">' +
      esc(r.name) +
      "</span>" +
      "</span>" +
      '<span style="text-align:right;flex:none;">' +
      (r.rating ? starText(r.rating) : "") +
      '<span style="display:block;font-size:11px;color:var(--muted);margin-top:2px;">' +
      esc(fmtDate(r.updatedAt || r.createdAt)) +
      "</span>" +
      "</span>" +
      "</a>"
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
      '<div class="head">' +
      "<div><div class=\"page-title\">你好，" +
      esc(state.profile.name) +
      "</div>" +
      '<div class="sub">连续记录 ' +
      streakDays() +
      " 天 · 本月 " +
      m.count +
      " 件</div></div>" +
      '<div class="avatar" aria-hidden="true">' +
      esc((state.profile.name || "禾").charAt(0)) +
      "</div></div>" +
      '<div class="overview">' +
      '<div class="overview-top"><span style="font-size:12px;color:var(--muted);">' +
      monthPrefix().replace("-", " 年 ") +
      " 月概览</span>" +
      '<button class="link-btn" data-action="goto" data-to="#/review">看复盘 ›</button></div>' +
      '<div class="nums">' +
      m.count +
      " 件 · 均分 <em>" +
      (m.avg ? m.avg.toFixed(1) : "—") +
      "</em> · 回购 <em>" +
      Math.round(m.repurchaseRate * 100) +
      "%</em></div>" +
      '<div class="note">本月记录 ' +
      m.activeDays +
      " 天" +
      (m.totalSpend ? " · 花费 ¥" + fmtMoney(m.totalSpend) : "") +
      "</div></div>" +
      '<div class="section">最近记录</div>' +
      '<div class="card">' +
      (recs.length
        ? recs
            .map(function (r) {
              return itemRow(r, "#/detail/r-" + r.id);
            })
            .join("")
        : '<div class="empty"><span class="e">📦</span>还没有记录，点上面按钮记下第一件物品吧</div>') +
      "</div>" +
      '<button class="btn btn-primary" data-action="new-record">+ 记录一件物品</button>'
    );
  }

  function renderItems() {
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
    var body = groupList
      .map(function (g) {
        var latest = g.list[g.list.length - 1];
        return (
          '<div class="card item-card">' +
          '<div class="item-head">' +
          '<span class="thumb" aria-hidden="true">' +
          esc(latest.emoji || "📦") +
          "</span>" +
          '<span class="row-main">' +
          '<span class="row-name">' +
          esc(latest.name) +
          "</span>" +
          '<span class="row-meta">' +
          "已买 " +
          g.list.length +
          " 次</span>" +
          "</span>" +
          '<button class="link-btn" data-action="re-buy" data-id="' +
          esc(latest.id) +
          '">＋ 再买一次</button>' +
          "</div>" +
          g.list
            .map(function (r, i) {
              return purchaseRow(r, i + 1);
            })
            .join("") +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="head"><div><div class="page-title">我的物品</div>' +
      '<div class="sub">共 ' +
      state.records.length +
      " 件记录 · " +
      groupList.length +
      " 种物品</div></div>" +
      '<button class="icon-btn" data-action="new-record" aria-label="新增记录">＋</button></div>' +
      (groupList.length
        ? body
        : '<div class="empty"><span class="e">🗂️</span>还没有物品，先记录一件吧</div>')
    );
  }

  function renderProfile() {
    var m = monthStats();
    return (
      '<div class="head"><div><div class="page-title">我的</div>' +
      '<div class="sub">' +
      esc(state.profile.name) +
      " · 共记录 " +
      state.records.length +
      " 件 · 连续 " +
      streakDays() +
      " 天</div></div>" +
      '<div class="avatar" aria-hidden="true">' +
      esc((state.profile.name || "禾").charAt(0)) +
      "</div></div>" +
      '<div class="card">' +
      '<label class="label" for="profile-name">昵称</label>' +
      '<input class="input" id="profile-name" type="text" value="' +
      esc(state.profile.name) +
      '">' +
      '<button class="btn btn-primary" data-action="save-profile">保存</button>' +
      "</div>" +
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
      '<button class="row" data-action="reset-demo" style="cursor:pointer;">' +
      '<span class="thumb" style="width:36px;height:36px;font-size:16px;" aria-hidden="true">🔄</span>' +
      '<span class="row-main"><span class="row-name">重置演示数据</span><span class="row-meta">恢复示例记录</span></span><span>›</span></button>' +
      '<button class="row" data-action="clear-all" style="cursor:pointer;">' +
      '<span class="thumb" style="width:36px;height:36px;font-size:16px;" aria-hidden="true">🗑️</span>' +
      '<span class="row-main"><span class="row-name" style="color:var(--danger);">清空全部记录</span><span class="row-meta">不可恢复，请先导出</span></span><span>›</span></button>' +
      "</div>" +
      '<div class="hint" style="margin-top:18px;">数据只保存在这台设备浏览器里，不会上传。</div>'
    );
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
      '<div class="label">我的评分</div>' +
      '<div id="rec-stars"></div>' +
      '<div class="label">还会回购吗</div>' +
      '<div class="seg3" id="rec-rebuy"></div>' +
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
      purchaseType: null,
      purchaseChannel: null,
      rating: 0,
      repurchase: "unsure",
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
    html +=
      "</div>" +
      '<span style="font-size:13px;color:var(--muted);margin-top:6px;display:inline-block;">' +
      (e.rating ? e.rating + " 星" : "点击评分") +
      "</span>";
    el.innerHTML = html;
  }

  function renderRecordControls() {
    renderStars();
    renderCatField();
    renderPurchField();
    renderRepurchase();
    renderPhoto();
  }

  function renderRepurchase() {
    var el = document.getElementById("rec-rebuy");
    if (!el) return;
    var opts = [
      { value: "yes", emoji: "👍", label: "会回购" },
      { value: "no", emoji: "👎", label: "不会" },
      { value: "unsure", emoji: "🤔", label: "不确定" }
    ];
    el.innerHTML = opts
      .map(function (o) {
        return (
          '<button type="button" class="seg ' +
          (state.editing.repurchase === o.value ? "on" : "") +
          '" data-action="chip" data-key="repurchase" data-value="' +
          o.value +
          '">' +
          '<span class="seg-emoji" aria-hidden="true">' +
          o.emoji +
          "</span><span>" +
          o.label +
          "</span></button>"
        );
      })
      .join("");
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
    ["cat-sheet", "purch-sheet"].forEach(function (id) {
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
          ? '<button class="big-thumb" data-action="view-photo" data-src="' +
            r.photo +
            '" aria-label="查看大图"><img src="' +
            r.photo +
            '" alt="物品照片" style="width:100%;height:100%;border-radius:16px;object-fit:cover;"></button>'
          : '<div class="big-thumb" aria-hidden="true">' +
            esc(r.emoji || "📦") +
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
        '<div><div class="kv-label">品类</div><div class="kv-value">' +
        esc(categoryLabel(r)) +
        "</div></div>" +
        '<div><div class="kv-label">购买途径</div><div class="kv-value">' +
        esc(purchaseLabel(r)) +
        "</div></div>" +
        '<div><div class="kv-label">价格</div><div class="kv-value">' +
        (r.price != null ? "¥" + fmtMoney(r.price) : "未填") +
        "</div></div>" +
        '<div><div class="kv-label">回购</div><div class="kv-value">' +
        (REPURCHASE_META[r.repurchase] || "不确定") +
        "</div></div>" +
        '<div><div class="kv-label">记录时间</div><div class="kv-value">' +
        esc(fmtDate(r.createdAt)) +
        "</div></div>" +
        "</div>" +
        (r.comment
          ? '<div class="label">我的短评</div><div class="quote">' +
            esc(r.comment) +
            "</div>"
          : "") +
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
      "</b><span>本月花费</span></div></div>" +
      (m.best
        ? '<div class="card" style="margin-top:12px;">' +
          '<div style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;">🏆 本月最佳</div>' +
          '<div class="row" style="cursor:default;">' +
          '<span class="thumb" aria-hidden="true">' +
          esc(m.best.emoji || "📦") +
          "</span>" +
          '<span class="row-main"><span class="row-name">' +
          esc(m.best.name) +
          '</span><span class="row-meta">' +
          m.best.rating +
          " 分 · " +
          (REPURCHASE_META[m.best.repurchase] || "—") +
          "</span></span>" +
          '<span class="tag green">推荐</span></div>' +
          (m.worst && m.worst.id !== m.best.id
            ? '<div style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;margin-top:10px;">💣 本月踩雷</div>' +
              '<div class="row" style="cursor:default;">' +
              '<span class="thumb" aria-hidden="true">' +
              esc(m.worst.emoji || "📦") +
              "</span>" +
              '<span class="row-main"><span class="row-name">' +
              esc(m.worst.name) +
              '</span><span class="row-meta">' +
              m.worst.rating +
              " 分 · " +
              (REPURCHASE_META[m.worst.repurchase] || "—") +
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
      '<button class="icon-btn" data-action="goto" data-to="#/home" aria-label="返回">‹</button>' +
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

  var VIEWS = {
    home: renderHome,
    items: renderItems,
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
      r.path === "home" || r.path === "items" || r.path === "profile"
        ? r.path
        : state.lastTab;
    if (
      r.path === "home" ||
      r.path === "items" ||
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
    if (r.path === "scan") {
      startScanner();
    }
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
    s.src = "https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js";
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
    fetch(
      "https://v1.apizero.cn/api/barcode-lookup?barcode=" +
        encodeURIComponent(code)
    )
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
    if (e.id) {
      var idx = state.records.findIndex(function (r) {
        return r.id === e.id;
      });
      if (idx >= 0) {
        state.records[idx] = Object.assign({}, state.records[idx], e, {
          updatedAt: now
        });
      }
    } else {
      state.records.push(
        Object.assign({}, e, {
          id: uid(),
          createdAt: now,
          updatedAt: now
        })
      );
    }
    saveRecords();
    state.editing = null;
    toast("已保存");
    location.hash = "#/home";
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
    if (action === "new-record") {
      newRecord();
      location.hash = "#/record";
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
        state.records = state.records.filter(function (r) {
          return r.id !== id0;
        });
        saveRecords();
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
        if (key === "repurchase")
          renderRepurchase();
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
        renderCatSheet();
        renderCatField();
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
    if (action === "save-profile") {
      var nameEl = document.getElementById("profile-name");
      var name = nameEl ? nameEl.value.trim() : "";
      if (!name) name = "小禾";
      state.profile.name = name;
      saveProfile();
      toast("已保存");
      route();
      return;
    }
    if (action === "export") {
      var blob = new Blob(
        [JSON.stringify({ profile: state.profile, records: state.records }, null, 2)],
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
    if (action === "reset-demo") {
      if (confirm("确定恢复示例数据吗？当前记录会被覆盖。")) {
        state.records = wujiSeedRecords();
        saveRecords();
        toast("已恢复示例数据");
        route();
      }
      return;
    }
    if (action === "clear-all") {
      if (confirm("确定清空全部记录吗？此操作不可恢复，建议先导出数据。")) {
        state.records = [];
        saveRecords();
        toast("已清空");
        route();
      }
      return;
    }
  });

  document.getElementById("view").addEventListener("input", function (ev) {
    var t = ev.target;
    var bind = t.getAttribute("data-bind");
    if (state.editing && bind) {
      state.editing[bind] = t.value;
    }
  });

  document.getElementById("photo-input").addEventListener("change", function (ev) {
    var file = ev.target.files && ev.target.files[0];
    if (!file) return;
    if (!state.editing) newRecord();
    readPhoto(file).then(function (dataUrl) {
      if (dataUrl) {
        state.editing.photo = dataUrl;
        toast("已添加照片");
      } else {
        toast("照片读取失败");
      }
      renderPhoto();
      ev.target.value = "";
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function () {
      lightbox.setAttribute("hidden", "");
      if (lightboxImg) lightboxImg.removeAttribute("src");
    });
  }

  window.addEventListener("hashchange", route);

  loadAll();
  route();
})();
