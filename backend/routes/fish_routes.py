from flask import Blueprint, jsonify, request
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
    species = data.get("species")
    size = data.get("size")

    if not species or not isinstance(size, int):
        return jsonify([])

    # 查出該魚種的棲息生態（假設取第一筆作代表）
    example = FishSpecies.query.filter_by(SpeciesName=species).first()
    if not example:
        return jsonify([])

    target_habitat = example.tank.Habitat

    # 查詢所有符合棲息地的魚缸
    suitable_tanks = TankTable.query.filter_by(Habitat=target_habitat).all()
    result = []

    for tank in suitable_tanks:
        total_fish = 0
        for f in tank.fish_list:
            try:
                total_fish += int(f.Size)
            except (ValueError, TypeError):
                continue

        remaining_capacity = tank.Capacity - total_fish
        if remaining_capacity >= size:
            result.append({
                "TankID": tank.TankID,
                "RemainingCapacity": remaining_capacity
            })

    return jsonify(result)
