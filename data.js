// 物记 · 社区演示数据（后续接入真实服务后替换为接口数据）
var WUJI_CATALOG = [
  {
    id: "jm",
    name: "逐本 清欢洁面乳",
    brand: "逐本",
    category: "护肤美妆",
    emoji: "🧴",
    barcode: "6931234567890",
    rating: 4.5,
    repurchaseRate: 0.82,
    count: 128,
    avgDays: 41,
    reviews: [
      { user: "林**", days: 47, rating: 5, text: "回购第三次了，泡沫细腻不假滑，很温和，适合干皮。" },
      { user: "王**", days: 12, rating: 4, text: "清洁力日常够用，冬天保湿一般，夏天用刚好。" },
      { user: "陈**", days: 60, rating: 4.5, text: "温和不紧绷，按压泵设计用到最后也不浪费。" }
    ]
  },
  {
    id: "zb",
    name: "至本 舒颜修护洁面",
    brand: "至本",
    category: "护肤美妆",
    emoji: "🧴",
    barcode: "6912345678901",
    rating: 4.7,
    repurchaseRate: 0.91,
    count: 96,
    avgDays: 38,
    reviews: [
      { user: "赵**", days: 52, rating: 5, text: "敏感肌用了一瓶没过敏，会一直回购。" },
      { user: "刘**", days: 20, rating: 4, text: "起泡少，但洗完脸很舒服。" }
    ]
  },
  {
    id: "xf",
    name: "草木染 生姜洗发水",
    brand: "草木染",
    category: "个护洗护",
    emoji: "🧴",
    barcode: "6901234567892",
    rating: 2.3,
    repurchaseRate: 0.31,
    count: 64,
    avgDays: 24,
    reviews: [
      { user: "孙**", days: 18, rating: 2, text: "洗完头屑变多，有点失望。" },
      { user: "周**", days: 30, rating: 3, text: "味道好闻，但控油一般。" }
    ]
  },
  {
    id: "xix",
    name: "心相印 抽纸 3 层 100 抽",
    brand: "心相印",
    category: "日用清洁",
    emoji: "🧻",
    barcode: "6923456789012",
    rating: 4.2,
    repurchaseRate: 0.76,
    count: 210,
    avgDays: 30,
    reviews: [
      { user: "吴**", days: 40, rating: 4, text: "性价比高，纸张偏薄但够用。" },
      { user: "郑**", days: 25, rating: 4.5, text: "不掉屑，家里常年囤。" }
    ]
  },
  {
    id: "mk",
    name: "大白 陶瓷马克杯 420ml",
    brand: "大白",
    category: "家居",
    emoji: "☕",
    barcode: "6934567890123",
    rating: 4.9,
    repurchaseRate: 0.95,
    count: 58,
    avgDays: 210,
    reviews: [
      { user: "冯**", days: 300, rating: 5, text: "用了快一年，釉面还是很干净。" },
      { user: "褚**", days: 90, rating: 4.5, text: "容量刚好，握感舒服。" }
    ]
  },
  {
    id: "sdb",
    name: "三顿半 精品冻干咖啡",
    brand: "三顿半",
    category: "食品饮料",
    emoji: "☕",
    barcode: "6909876543210",
    rating: 4.4,
    repurchaseRate: 0.8,
    count: 150,
    avgDays: 25,
    reviews: [
      { user: "卫**", days: 30, rating: 4.5, text: "冷水也能冲开，办公室救星。" },
      { user: "蒋**", days: 15, rating: 4, text: "酸味比预想重，但胜在方便。" }
    ]
  },
  {
    id: "wd",
    name: "维达 湿厕纸",
    brand: "维达",
    category: "日用清洁",
    emoji: "🧻",
    barcode: "6910987654321",
    rating: 4.1,
    repurchaseRate: 0.72,
    count: 88,
    avgDays: 20,
    reviews: [
      { user: "沈**", days: 28, rating: 4, text: "用完就冲，不堵马桶，无限回购。" }
    ]
  },
  {
    id: "wn",
    name: "薇诺娜 舒敏保湿特护霜",
    brand: "薇诺娜",
    category: "护肤",
    emoji: "🧴",
    barcode: "6921098765432",
    rating: 4.6,
    repurchaseRate: 0.88,
    count: 173,
    avgDays: 45,
    reviews: [
      { user: "韩**", days: 70, rating: 5, text: "换季泛红靠它救回来的。" },
      { user: "杨**", days: 35, rating: 4, text: "质地轻薄，夏天用略油。" }
    ]
  }
];

// 首次打开时预置的示例记录，方便直接体验
function wujiSeedRecords() {
  var now = Date.now();
  var day = 86400000;
  return [
    {
      id: "seed1",
      name: "逐本 清欢洁面乳",
      brand: "逐本",
      emoji: "🧴",
      barcode: "6931234567890",
      photo: null,
      rating: 4,
      recommend: "yes",
      repurchase: "yes",
      status: "finished",
      category: "护肤美妆",
      subcategory: "洁面",
      purchaseType: "online",
      purchaseChannel: "淘宝/天猫",
      price: 89,
      comment: "泡沫细腻不假滑，会回购。",
      createdAt: new Date(now - 3 * day).toISOString(),
      updatedAt: new Date(now - 3 * day).toISOString()
    },
    {
      id: "seed2",
      name: "草木染 生姜洗发水",
      brand: "草木染",
      emoji: "🧴",
      barcode: "6901234567892",
      photo: null,
      rating: 2,
      repurchase: "no",
      status: "abandoned",
      category: "个护洗护",
      subcategory: "洗发",
      purchaseType: "offline",
      purchaseChannel: "超市/便利店",
      price: 45.9,
      comment: "洗完头屑变多，不会回购。",
      createdAt: new Date(now - 6 * day).toISOString(),
      updatedAt: new Date(now - 6 * day).toISOString()
    },
    {
      id: "seed3",
      name: "大白 陶瓷马克杯 420ml",
      brand: "大白",
      emoji: "☕",
      barcode: "6934567890123",
      photo: null,
      rating: 5,
      expiryDate: new Date(now + 12 * day).toISOString().slice(0, 10),
      repurchase: "yes",
      status: "using",
      category: "家居",
      subcategory: "杯具",
      purchaseType: "gift",
      purchaseChannel: null,
      price: 29.9,
      comment: "手感好，容量刚好。",
      createdAt: new Date(now - 20 * day).toISOString(),
      updatedAt: new Date(now - 2 * day).toISOString()
    }
  ];
}
