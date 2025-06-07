import os
import pandas as pd
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# 設定資料夾路徑
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# 設定 Flask 與資料庫連線
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:ewymerej1@localhost/aquariumdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ---------- 模型定義 ----------
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
    Habitat = db.Column(db.Enum('freshwater', 'brackish', 'marine'), nullable=False)
    Size = db.Column(db.Float, nullable=False)
    BelongTank = db.Column(db.Integer, db.ForeignKey('TankTable.TankID'))

class FeedingPreferences(db.Model):
    __tablename__ = 'FeedingPreferences'
    SpeciesID = db.Column(db.Integer, db.ForeignKey('FishSpecies.SpeciesID'), primary_key=True)
    FeedID = db.Column(db.Integer, db.ForeignKey('FeedTable.FeedID'), primary_key=True)

# ---------- 匯入 CSV 檔 ----------
def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        print(f"📥 匯入：{filename}")
        return pd.read_csv(path)
    else:
        print(f"⚠️ 找不到 {filename}，略過。")
        return None

# ---------- 匯入資料 ----------
def load_all_data():
    # FeedTable
    df_feed = read_csv('feed_table.csv')
    if df_feed is not None:
        count = 0
        for _, row in df_feed.iterrows():
            db.session.add(FeedTable(**row))
            count += 1
        db.session.commit()
        print(f"✅ FeedTable 匯入成功：{count} 筆")

    # TankTable
    df_tank = read_csv('fish_tanks_table.csv')
    if df_tank is not None:
        if 'LastFeedTime' in df_tank.columns:
            df_tank['LastFeedTime'] = pd.to_datetime(df_tank['LastFeedTime'])
        count = 0
        for _, row in df_tank.iterrows():
            db.session.add(TankTable(**row))
            count += 1
        db.session.commit()
        print(f"✅ TankTable 匯入成功：{count} 筆")

    # FishSpecies
    df_species = read_csv('fish_species_table.csv')
    if df_species is not None:
        count = 0
        for _, row in df_species.iterrows():
            db.session.add(FishSpecies(**row))
            count += 1
        db.session.commit()
        print(f"✅ FishSpecies 匯入成功：{count} 筆")

    # FeedingPreferences
    df_pref = read_csv('food_records_table.csv')
    if df_pref is not None:
        df_pref['SpeciesID'] = df_pref['SpeciesID'].astype(int)
        df_pref['FeedID'] = df_pref['FeedID'].astype(int)

        success, fail = 0, 0
        for _, row in df_pref.iterrows():
            try:
                db.session.add(FeedingPreferences(**row))
                success += 1
            except Exception as e:
                print(f"❌ 匯入失敗（SpeciesID={row['SpeciesID']}, FeedID={row['FeedID']}）: {e}")
                fail += 1
        db.session.commit()
        print(f"✅ FeedingPreferences 匯入成功：{success} 筆，❌ 失敗：{fail} 筆")

# ---------- 主程式 ----------
if __name__ == '__main__':
    with app.app_context():
        load_all_data()
