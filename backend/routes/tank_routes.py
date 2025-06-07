from flask import Blueprint, jsonify
from models import TankTable, FishSpecies

tank_bp = Blueprint("tank_bp", __name__)

# ✅ 查詢單一魚缸詳細資訊（含魚群）
@tank_bp.route("/<int:tank_id>", methods=["GET"])
def get_tank_detail(tank_id):
    tank = TankTable.query.get(tank_id)
    if not tank:
        return jsonify({"error": "Tank not found"}), 404

    # 查詢該缸所有魚群
    fish_list = FishSpecies.query.filter_by(BelongTank=tank_id).all()
    fish_info = [
        {"SpeciesName": f.SpeciesName, "Size": round(float(f.Size), 2)}
        for f in fish_list
    ]

    return jsonify({
        "TankID": tank.TankID,
        "Capacity": tank.Capacity,
        "Habitat": tank.Habitat,
        "Salinity": tank.Salinity,
        "CleanlinessLevel": tank.CleanlinessLevel,
        "CrowdingLevel": tank.CrowdingLevel,
        "LastFeedTime": tank.LastFeedTime.isoformat() if tank.LastFeedTime else None,
        "FeedIntervalHours": tank.FeedIntervalHours,
        "FishSpecies": fish_info
    })
