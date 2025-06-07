from flask import Blueprint, jsonify
from models import TankTable, FishSpecies
from config import db

tank_bp = Blueprint("tank_bp", __name__)

@tank_bp.route("/<int:tank_id>", methods=["GET"])
def get_tank_detail(tank_id):
    tank = TankTable.query.get(tank_id)
    if not tank:
        return jsonify({"error": "Tank not found"}), 404

    fish_list = FishSpecies.query.filter_by(BelongTank=tank_id).all()

    fish_info = []
    for f in fish_list:
        try:
            count = int(f.Size)
        except (ValueError, TypeError):
            count = None

        fish_info.append({
            "SpeciesName": f.SpeciesName,
            "Size": count
        })

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
