from flask import Blueprint, jsonify
from models import TankTable, FishSpecies, FeedTable, FeedingPreferences
from config import db
from datetime import datetime, timedelta

feeding_bp = Blueprint("feeding_bp", __name__)

@feeding_bp.route("/reminder", methods=["GET"])
def feeding_reminder():
    now = datetime(2025, 6, 3, 14, 20, 0)
    reminders = []

    tanks = TankTable.query.all()
    for tank in tanks:
        if not tank.LastFeedTime or not tank.FeedIntervalHours:
            continue

        next_feed_time = tank.LastFeedTime + timedelta(hours=tank.FeedIntervalHours)
        if now < next_feed_time:
            continue  # 還不需要餵

        # 取得魚缸裡所有魚種 ID
        fish_list = FishSpecies.query.filter_by(BelongTank=tank.TankID).all()
        species_ids = [f.SpeciesID for f in fish_list]

        if not species_ids:
            continue  # 沒魚就跳過

        # 查這些魚種需要的 FeedID
        feed_ids = (
            db.session.query(FeedingPreferences.FeedID)
            .filter(FeedingPreferences.SpeciesID.in_(species_ids))
            .distinct()
            .all()
        )
        feed_ids = [fid[0] for fid in feed_ids]

        # 撈出 Feed 資訊
        feeds = FeedTable.query.filter(FeedTable.FeedID.in_(feed_ids)).all()
        feed_info = [
            {
                "FeedID": f.FeedID,
                "FeedName": f.FeedName,
                "RemainingQuantity": round(f.RemainingQuantity, 2),
                "RestockThreshold": f.RestockThreshold
            }
            for f in feeds
        ]

        reminders.append({
            "TankID": tank.TankID,
            "LastFeedTime": tank.LastFeedTime.isoformat(),
            "FeedIntervalHours": tank.FeedIntervalHours,
            "NextFeedTime": next_feed_time.isoformat(),
            "Status": "Needs Feeding",
            "Feeds": feed_info  # ⬅️ 額外餵食清單
        })

    return jsonify(reminders)
