from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    balance = db.Column(db.Float, default=10000.00, nullable=False)

    transactions = db.relationship("Transaction", back_populates="users")

class Transaction(db.Model):
    __tablename__ = "Transactions"
    id = db.Column(db.Integer, primary_key=True)
    stockSymbol = db.Column(db.String(128), index=True, nullable=False)
    stockName = db.Column(db.String(128), index=True)
    price = db.Column(db.Float, nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("Users.id"), index=True, nullable=False)

    users = db.relationship("User", back_populates="transactions")