#!/usr/bin/env python3
# 物记本地服务器：托管静态页面 + 服务端转发条码查询
# API Key 只保存在 .env.local（已被 git 忽略），浏览器永远看不到
import json
import mimetypes
import os
import sys
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "8000"))
APIZERO_URL = "https://v1.apizero.cn/api/barcode-lookup"
AI_API_URL = "https://api.openai.com/v1/chat/completions"
AI_MODEL = "gpt-4.1-mini"


def load_key():
    return load_env_value("WUJI_APIZERO_KEY")


def load_env_value(name, fallback=""):
    path = os.path.join(ROOT, ".env.local")
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith(name + "="):
                    return line.split("=", 1)[1].strip().strip('"')
    except OSError:
        pass
    return os.environ.get(name, fallback)


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/identify-product":
            self.handle_ai_identify()
            return
        self.send_error(404)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/barcode-lookup":
            self.handle_barcode(parsed.query)
            return
        self.serve_static(parsed.path)

    def handle_barcode(self, query):
        qs = urllib.parse.parse_qs(query)
        barcode = (qs.get("barcode") or [""])[0].strip()
        if not barcode:
            self.send_json({"code": -1, "msg": "缺少条码参数", "data": None})
            return
        url = APIZERO_URL + "?barcode=" + urllib.parse.quote(barcode)
        key = load_key()
        if key:
            url += "&key=" + urllib.parse.quote(key)
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": "wuji-app/1.0"}
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read().decode("utf-8", "replace")
                self.send_json(json.loads(body))
        except Exception as e:
            self.send_json(
                {"code": -1, "msg": "查询失败", "data": None, "error": str(e)}
            )

    def handle_ai_identify(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, json.JSONDecodeError):
            self.send_json({"code": -1, "msg": "请求格式不正确", "data": None}, 400)
            return

        name = str(payload.get("name") or "").strip()
        if not name:
            self.send_json({"code": -1, "msg": "缺少物品名称", "data": None}, 400)
            return

        key = load_env_value("WUJI_AI_API_KEY")
        if not key:
            self.send_json({"code": -1, "msg": "AI 服务未配置", "data": None}, 503)
            return

        api_url = load_env_value("WUJI_AI_API_URL", AI_API_URL)
        model = load_env_value("WUJI_AI_MODEL", AI_MODEL)
        instruction = (
            "你是个人物品记录应用的商品信息标准化助手。只根据用户提供的名称或图片识别商品信息。"
            "必须返回 JSON，不要返回 Markdown。允许返回的字段只有 name、brand、category、subcategory。"
            "无法确认的字段返回空字符串。绝对不要猜测价格、购买渠道、评分、评价或回购意愿。"
        )
        user_content = "请识别这个物品：" + name
        image = payload.get("image")
        if image and isinstance(image, str) and image.startswith("data:image/"):
            user_content = [
                {"type": "text", "text": user_content},
                {"type": "image_url", "image_url": {"url": image}},
            ]
        request_body = {
            "model": model,
            "temperature": 0,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": instruction},
                {"role": "user", "content": user_content},
            ],
        }
        try:
            req = urllib.request.Request(
                api_url,
                data=json.dumps(request_body, ensure_ascii=False).encode("utf-8"),
                headers={
                    "Authorization": "Bearer " + key,
                    "Content-Type": "application/json",
                    "User-Agent": "wuji-app/1.0",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=35) as resp:
                result = json.loads(resp.read().decode("utf-8", "replace"))
            content = ((result.get("choices") or [{}])[0].get("message") or {}).get("content")
            if isinstance(content, list):
                content = "".join(str(item.get("text") or "") for item in content if isinstance(item, dict))
            if not content:
                content = result.get("output_text", "")
            info = json.loads(content)
            data = {
                "name": str(info.get("name") or name).strip(),
                "brand": str(info.get("brand") or "").strip(),
                "category": str(info.get("category") or "").strip(),
                "subcategory": str(info.get("subcategory") or "").strip(),
            }
            self.send_json({"code": 0, "msg": "ok", "data": data})
        except Exception as e:
            self.send_json({"code": -1, "msg": "AI 识别失败", "data": None, "error": str(e)}, 502)

    def serve_static(self, path):
        rel = path.lstrip("/")
        if not rel:
            rel = "index.html"
        lower = rel.lower()
        if (
            lower.startswith(".env")
            or lower.endswith(".py")
            or lower.startswith(".git")
            or "/." in "/" + lower
        ):
            self.send_error(404)
            return
        full = os.path.normpath(os.path.join(ROOT, rel))
        if not full.startswith(ROOT) or not os.path.isfile(full):
            self.send_error(404)
            return
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        if rel.lower().endswith(".webmanifest"):
            ctype = "application/manifest+json"
        with open(full, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header(
            "Content-Type",
            ctype + ("; charset=utf-8" if ctype.startswith("text/") else ""),
        )
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def send_json(self, obj, status=200):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
