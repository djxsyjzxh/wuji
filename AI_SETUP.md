# AI 识别配置

物记的 AI 商品识别由本地服务端转发，浏览器端不会保存或发送 API Key。默认关闭 AI，不配置也不影响手动记录、拍照和扫码流程。

## 本地开发

在 `wuji-source/.env.local` 中填写：

```env
WUJI_AI_API_KEY=你的服务端密钥
WUJI_AI_API_URL=https://api.openai.com/v1/chat/completions
WUJI_AI_MODEL=gpt-4.1-mini
```

然后在本地开发时将 `config.js` 中的 `WUJI_AI_ENABLED` 改为 `true`，启动：

```text
python server.py
```

生产环境建议通过平台的环境变量配置同名变量，不要把 `.env.local` 提交到 Git。`server.py` 会读取兼容 OpenAI Chat Completions 的接口，并只返回以下结构化字段：

```json
{
  "name": "逐本清欢洁面乳",
  "brand": "逐本",
  "category": "护肤美妆",
  "subcategory": "洁面"
}
```

AI 不负责猜测价格、购买渠道、评分、评价或回购意愿；这些内容只能来自用户输入。

## 接口约定

`POST /api/identify-product`

请求体：`{ "name": "用户输入的名称", "image": "可选的 data:image/... 图片" }`

未配置服务端 Key 时返回 HTTP 503；上游识别失败时返回 HTTP 502。前端会保留用户已经填写的内容，并允许继续手动填写。
