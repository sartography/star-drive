from sqlalchemy import func

from app import db


class Investigator(db.Model):
    __tablename__ = 'investigator'
    id = db.Column(db.Integer, primary_key=True)
    last_updated = db.Column(db.DateTime(timezone=True), default=func.now())
    name = db.Column(db.String)
    title = db.Column(db.String)
    organization_name = db.Column(db.String)
    bio_link = db.Column(db.String)
