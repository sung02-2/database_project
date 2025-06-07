from .feed_routes import feed_bp
from .feeding_routes import feeding_bp
from .fish_routes import fish_bp
from .dashboard_routes import dashboard_bp
from .tank_routes import tank_bp  # ✅ 補這行

def register_routes(app):
    app.register_blueprint(feed_bp, url_prefix="/api/feeds")
    app.register_blueprint(feeding_bp, url_prefix="/api/feeding")
    app.register_blueprint(fish_bp, url_prefix="/api/fish")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(tank_bp, url_prefix="/api/tank")  # ✅ 補這行
