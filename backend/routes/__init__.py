from .feed_routes import feed_bp
from .tank_routes import tank_bp
from .feeding_routes import feeding_bp  # ✅ 這行才是正確的
from .fish_routes import fish_bp

def register_routes(app):
    app.register_blueprint(feed_bp, url_prefix="/api/feeds")
    app.register_blueprint(tank_bp, url_prefix="/api/tanks")
    app.register_blueprint(feeding_bp, url_prefix="/api/feeding")  # ✅ 加這行註冊 feeding API
    app.register_blueprint(fish_bp, url_prefix="/api/fish") 