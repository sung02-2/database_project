# app.py
from flask import Flask
from flask_cors import CORS
from config import init_app
from routes import register_routes  # ✅ 不要個別引用 dashboard_bp

app = Flask(__name__)
CORS(app)
init_app(app)

register_routes(app)  # ✅ 統一註冊所有 blueprint

if __name__ == "__main__":
    app.run(debug=True)
