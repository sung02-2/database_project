from flask import Blueprint, request, jsonify
from models import TankTable, FishSpecies
from config import db

fish_bp = Blueprint("fish_bp", __name__)

@fish_bp.route("/species", methods=["GET"])
def get_species_list():
    results = db.session.query(FishSpecies.SpeciesName).distinct().all()
    species = [row[0] for row in results]
    return jsonify(species)

@fish_bp.route("/suggestions", methods=["POST"])
def suggest_tanks():
    data = request.get_json()
    name = data.get("name")
    size = data.get("size")
    habitat = data.get("habitat")

    if not name or not isinstance(size, int) or not habitat:
        return jsonify({"error": "Missing or invalid input"}), 400

    suitable_tanks = TankTable.query.filter_by(Habitat=habitat).all()
    suggestions = []

    def get_crowding_level(ratio):
        if ratio > 0.15:
            return "high"
        elif ratio > 0.05:
            return "medium"
        else:
            return "low"

    for tank in suitable_tanks:
        try:
            current_total = sum(float(f.Size) for f in tank.fish_list)
        except Exception:
            current_total = 0.0

        if tank.Capacity <= 0:
            continue  # 避免除以 0

        before_ratio = current_total / tank.Capacity
        after_ratio = (current_total + size) / tank.Capacity

        suggestions.append({
            "TankID": tank.TankID,
            "CrowdingBefore": get_crowding_level(before_ratio),
            "CrowdingAfter": get_crowding_level(after_ratio)
        })

    level_order = {"low": 0, "medium": 1, "high": 2}
    suggestions.sort(key=lambda s: level_order[s["CrowdingAfter"]])

    return jsonify(suggestions)

@fish_bp.route("/add", methods=["POST"])
def add_fish_group():
    data = request.get_json()
    name = data.get("name")
    size = data.get("size")
    habitat = data.get("habitat")
    tank_id = data.get("tank_id")

    if not name or not habitat or not isinstance(size, int) or not isinstance(tank_id, int):
        return jsonify({"error": "Missing or invalid input"}), 400

    new_group = FishSpecies(
        SpeciesName=name,
        Size=size,
        BelongTank=tank_id
    )
    db.session.add(new_group)
    db.session.commit()

    return jsonify({"message": f"Fish group '{name}' added to tank {tank_id}."}), 200

@fish_bp.route("/tanks", methods=["GET"])
def get_all_tanks():
    tanks = TankTable.query.with_entities(TankTable.TankID).all()
    return jsonify([{"TankID": t.TankID} for t in tanks])

@fish_bp.route("/tank-fish/<int:tank_id>", methods=["GET"])
def get_fish_in_tank(tank_id):
    fishes = FishSpecies.query.filter_by(BelongTank=tank_id).all()
    result = [{"FishID": f.SpeciesID, "Name": f.SpeciesName, "Size": f.Size} for f in fishes]
    return jsonify(result)

@fish_bp.route("/remove/<int:fish_id>", methods=["DELETE"])
def remove_fish_group(fish_id):
    fish = FishSpecies.query.get(fish_id)
    if not fish:
        return jsonify({"error": "Fish group not found"}), 404
    db.session.delete(fish)
    db.session.commit()
    return jsonify({"message": "Fish group removed."})