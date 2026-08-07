// Vercel 云函数：服务端转发条码查询
// 密钥从 Vercel 环境变量 WUJI_APIZERO_KEY 读取，不会暴露给浏览器
module.exports = async function (req, res) {
  var barcode = String(req.query.barcode || "").trim();
  if (!barcode) {
    res.status(200).json({ code: -1, msg: "缺少条码参数", data: null });
    return;
  }
  var key = process.env.WUJI_APIZERO_KEY || "";
  var url =
    "https://v1.apizero.cn/api/barcode-lookup?barcode=" +
    encodeURIComponent(barcode) +
    (key ? "&key=" + encodeURIComponent(key) : "");
  try {
    var resp = await fetch(url, { headers: { "User-Agent": "wuji-app/1.0" } });
    var data = await resp.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json({ code: -1, msg: "查询失败", data: null });
  }
};
