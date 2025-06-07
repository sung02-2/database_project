# routes/feed_routes.py

from flask import Blueprint, jsonify
from models import FeedTable
from config import db

feed_bp = Blueprint('feed_bp', __name__)

# ✅ 所有飼料列表（對應 FeedInventory 前端）
@feed_bp.route("/inventory", methods=["GET"])
def all_feeds():
    feeds = FeedTable.query.all()
    result = [
        {
            "FeedID": f.FeedID,
            "FeedName": f.FeedName,
            "RemainingQuantity": round(f.RemainingQuantity, 2),
            "RestockThreshold": f.RestockThreshold
        }
        for f in feeds
    ]
    return jsonify(result)

# ✅ 低庫存飼料清單（額外功能）
@feed_bp.route("/low-stock", methods=["GET"])
def low_stock_feeds():
    feeds = FeedTable.query.filter(FeedTable.RemainingQuantity < FeedTable.RestockThreshold).all()
    result = [
        {
            "FeedID": f.FeedID,
            "FeedName": f.FeedName,
            "RemainingQuantity": round(f.RemainingQuantity, 2),
            "RestockThreshold": f.RestockThreshold
        }
        for f in feeds
    ]
    return jsonify(result)
