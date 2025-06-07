# routes/dashboard_routes.py

from flask import Blueprint, jsonify, request
from models import TankTable, FeedTable
from config import db
from datetime import datetime
from sqlalchemy import func

dashboard_bp = Blueprint("dashboard_bp", __name__)

CLEANLINESS_THRESHOLD = 0.5

# ✅ 總覽資訊
@dashboard_bp.route("/summary", methods=["GET"])
def get_summary():
    # 固定測試時間（實際部署可改成 datetime.now()）
    now = datetime(2025, 6, 3, 14, 20, 0)
    now_str = now.strftime("%Y-%m-%d %H:%M")

    tank_count = TankTable.query.count()
    total_feed = db.session.query(func.sum(FeedTable.RemainingQuantity)).scalar() or 0

    return jsonify({
        "currentTime": now_str,
        "numberOfTanks": tank_count,
        "totalFeedKg": round(total_feed, 2)
    })

# ✅ 所有魚缸狀態
@dashboard_bp.route("/tanks", methods=["GET"])
def get_tanks():
    tanks = TankTable.query.all()
    result = [{
        "TankID": tank.TankID,
        "CrowdingLevel": tank.CrowdingLevel,
        "CleanlinessLevel": "GOOD" if tank.CleanlinessLevel >= CLEANLINESS_THRESHOLD else "BAD"
    } for tank in tanks]
    return jsonify(result)

# ✅ 異常魚缸列表
@dashboard_bp.route("/abnormal-tanks", methods=["GET"])
def abnormal_tanks():
    tanks = TankTable.query.filter(TankTable.CleanlinessLevel < CLEANLINESS_THRESHOLD).all()
    result = [{
        "TankID": tank.TankID,
        "CleanlinessLevel": tank.CleanlinessLevel,
        "Status": "BAD"
    } for tank in tanks]
    return jsonify(result)
