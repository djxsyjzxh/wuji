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


def load_key():
    path = os.path.join(ROOT, ".env.local")
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("WUJI_APIZERO_KEY="):
                    return line.split("=", 1)[1].strip().strip('"')
    except OSError:
        pass
    return ""


class Handler(BaseHTTPRequestHandler):
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

    def serve_static(self, path):
        rel = path.lstrip("/")
        if not rel:
            rel = "index.html"
        lower = rel.lower()
        if (
            lower.startswith(".env")
            or lower.endswith((".py", ".local.js"))
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

    def send_json(self, obj):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
