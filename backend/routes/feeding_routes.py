from flask import Blueprint, jsonify
from models import TankTable
from datetime import datetime, timedelta

feeding_bp = Blueprint("feeding_bp", __name__)

@feeding_bp.route("/reminder", methods=["GET"])
def feeding_reminder():
    # 固定現在時間為 2025-06-03 03:00
    now = datetime(2025, 6, 3, 14, 20, 0)
    reminders = []

    tanks = TankTable.query.all()
    for tank in tanks:
        if tank.LastFeedTime and tank.FeedIntervalHours:
            next_feed_time = tank.LastFeedTime + timedelta(hours=tank.FeedIntervalHours)
            if now >= next_feed_time:
                reminders.append({
                    "TankID": tank.TankID,
                    "LastFeedTime": tank.LastFeedTime.isoformat(),
                    "FeedIntervalHours": tank.FeedIntervalHours,
                    "NextFeedTime": next_feed_time.isoformat(),
                    "Status": "Needs Feeding"
                })

    return jsonify(reminders)
