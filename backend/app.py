from flask import Flask
from flask_cors import CORS
from config import init_app
from routes import register_routes
from routes.dashboard_routes import dashboard_bp

app = Flask(__name__)
CORS(app)
init_app(app)

# 註冊 Blueprint
register_routes(app)
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

if __name__ == "__main__":
    app.run(debug=True)
