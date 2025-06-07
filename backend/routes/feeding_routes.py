from flask import Blueprint, jsonify
from models import TankTable
from datetime import datetime, timedelta

feeding_bp = Blueprint("feeding_bp", __name__)

@feeding_bp.route("/reminder", methods=["GET"])
def feeding_reminder():
    now = datetime.now()
    reminders = []

    for tank in TankTable.query.all():
        if tank.LastFeedTime and tank.FeedIntervalHours:
            next_feed_time = tank.LastFeedTime + timedelta(hours=tank.FeedIntervalHours)
            status = "Needs Feeding" if now > next_feed_time else "On Schedule"
            if status == "Needs Feeding":
                reminders.append({
                    "TankID": tank.TankID,
                    "LastFeedTime": tank.LastFeedTime.isoformat(),
                    "FeedIntervalHours": tank.FeedIntervalHours,
                    "Status": status
                })

    return jsonify(reminders)
