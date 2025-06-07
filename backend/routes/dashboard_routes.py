from flask import Blueprint, jsonify
from models import FeedTable, TankTable
from config import db
from datetime import datetime, timedelta


dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route("/summary", methods=["GET"])
def dashboard_summary():
    num_tanks = TankTable.query.count()

    # 飼料總量 (kg)
    feeds = FeedTable.query.all()
    total_feed_kg = round(sum(f.RemainingQuantity for f in feeds) / 1000, 2)  # 假設單位是 g → kg

    # 異常魚缸數量（如 cleanliness < 0.3, crowding 高）
    warning_tanks = TankTable.query.filter(
        (TankTable.CleanlinessLevel < 0.3) |
        (TankTable.CrowdingLevel == 'high')
    ).count()

    return jsonify({
        "numberOfTanks": num_tanks,
        "totalFeedKg": total_feed_kg,
        "warningCount": warning_tanks
    })


@dashboard_bp.route("/tanks", methods=["GET"])
def dashboard_tanks():
    tanks = TankTable.query.all()
    result = []
    for t in tanks:
        result.append({
            "TankID": t.TankID,
            "CleanlinessLevel": "GOOD" if t.CleanlinessLevel >= 0.4 else "BAD",
            "CrowdingLevel": t.CrowdingLevel.capitalize(),
        })
    return jsonify(result)


@dashboard_bp.route("/abnormal-tanks", methods=["GET"])
def abnormal_tanks():
    now = datetime.now()
    tanks = TankTable.query.all()
    abnormal = []
    for t in tanks:
        # Cleanliness 過低、擁擠、超過餵食間隔時間
        feed_due = False
        if t.LastFeedTime and t.FeedIntervalHours:
            next_feed = t.LastFeedTime + timedelta(hours=t.FeedIntervalHours)
            feed_due = now > next_feed

        if t.CleanlinessLevel < 0.3 or t.CrowdingLevel == 'high' or feed_due:
            abnormal.append({
                "TankID": t.TankID,
                "CleanlinessLevel": t.CleanlinessLevel,
                "CrowdingLevel": t.CrowdingLevel,
                "FeedStatus": "Overdue" if feed_due else "OK"
            })

    return jsonify(abnormal)
