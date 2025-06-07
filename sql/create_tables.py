from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:ewymerej1@localhost/aquariumdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ----------- Feed Table -----------
class FeedTable(db.Model):
    __tablename__ = 'FeedTable'
    FeedID = db.Column(db.Integer, primary_key=True)
    FeedName = db.Column(db.String(100), nullable=False)
    RemainingQuantity = db.Column(db.Float, nullable=False)
    RestockThreshold = db.Column(db.Float, nullable=False)

# ----------- Tank Table -----------
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

# ----------- Fish Species Table -----------
class FishSpecies(db.Model):
    __tablename__ = 'FishSpecies'
    SpeciesID = db.Column(db.Integer, primary_key=True)
    SpeciesName = db.Column(db.String(100), nullable=False)
    Habitat = db.Column(db.Enum('freshwater', 'brackish', 'marine'), nullable=False)
    Size = db.Column(db.Float, nullable=False)
    BelongTank = db.Column(db.Integer, db.ForeignKey('TankTable.TankID'))

# ----------- Feeding Preferences Table -----------
class FeedingPreferences(db.Model):
    __tablename__ = 'FeedingPreferences'
    SpeciesID = db.Column(db.Integer, db.ForeignKey('FishSpecies.SpeciesID'), primary_key=True)
    FeedID = db.Column(db.Integer, db.ForeignKey('FeedTable.FeedID'), primary_key=True)

# ----------- Food Records Table (optional, not used for now) -----------
class FoodRecords(db.Model):
    __tablename__ = 'FoodRecords'
    RecordID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    TankID = db.Column(db.Integer, db.ForeignKey('TankTable.TankID'), nullable=False)
    FeedID = db.Column(db.Integer, db.ForeignKey('FeedTable.FeedID'), nullable=False)
    Quantity = db.Column(db.Float, nullable=False)
    FeedTime = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    RecordedBy = db.Column(db.String(100))

# ----------- 建立所有資料表 -----------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("✅ 所有資料表已成功建立！")
