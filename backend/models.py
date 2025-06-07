from config import db
from datetime import datetime

class FeedTable(db.Model):
    __tablename__ = 'FeedTable'
    FeedID = db.Column(db.Integer, primary_key=True)
    FeedName = db.Column(db.String(100), nullable=False)
    RemainingQuantity = db.Column(db.Float, nullable=False)
    RestockThreshold = db.Column(db.Float, nullable=False)

class TankTable(db.Model):
    __tablename__ = 'TankTable'
    TankID = db.Column(db.Integer, primary_key=True)
    Capacity = db.Column(db.Integer, nullable=False)
    Habitat = db.Column(db.Enum('freshwater', 'brackish', 'marine'), nullable=False)
    Salinity = db.Column(db.Float, nullable=False)
    CrowdingLevel = db.Column(db.Enum('low', 'medium', 'high'), nullable=False)
    CleanlinessLevel = db.Column(db.Float, nullable=False)
    LastFeedTime = db.Column(db.DateTime)
    FeedIntervalHours = db.Column(db.Integer, nullable=False)

class FishSpecies(db.Model):
    __tablename__ = 'FishSpecies'

    SpeciesID = db.Column(db.Integer, primary_key=True)
    SpeciesName = db.Column(db.String(100), nullable=False)
    Size = db.Column(db.Float, nullable=False)  # ✅ 將欄位名稱與 DB 對齊
    BelongTank = db.Column(db.Integer, db.ForeignKey('TankTable.TankID'), nullable=False)

    tank = db.relationship("TankTable", backref="fish_list")

class FeedingPreferences(db.Model):
    __tablename__ = "feedingpreferences"
    SpeciesID = db.Column(db.Integer, primary_key=True)
    FeedID = db.Column(db.Integer, primary_key=True)