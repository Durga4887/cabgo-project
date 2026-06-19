from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
	__tablename__ = "users"

	id = Column(Integer, primary_key=True, index=True)
	full_name = Column(String(100), nullable=False)
	email = Column(String(255), unique=True, nullable=False, index=True)
	phone_number = Column(String(20), unique=True, nullable=True, index=True)
	hashed_password = Column(String(255), nullable=False)
	is_active = Column(Boolean, default=True, nullable=False)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
	wallet = relationship("Wallet", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Booking(Base):
	__tablename__ = "bookings"

	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
	pickup_location = Column(String(255), nullable=False)
	dropoff_location = Column(String(255), nullable=False)
	booking_time = Column(DateTime, default=datetime.utcnow, nullable=False)
	ride_date = Column(DateTime, nullable=False)
	status = Column(String(30), default="pending", nullable=False)
	fare_amount = Column(Float, default=0.0, nullable=False)
	notes = Column(Text, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	user = relationship("User", back_populates="bookings")


class Wallet(Base):
	__tablename__ = "wallets"

	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
	balance = Column(Float, default=0.0, nullable=False)
	currency = Column(String(10), default="INR", nullable=False)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	user = relationship("User", back_populates="wallet")
	transactions = relationship("WalletTransactionRecord", back_populates="wallet", cascade="all, delete-orphan")


class WalletTransactionRecord(Base):
	__tablename__ = "wallet_transactions"

	id = Column(Integer, primary_key=True, index=True)
	wallet_id = Column(Integer, ForeignKey("wallets.id", ondelete="CASCADE"), nullable=False, index=True)
	user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
	amount = Column(Float, nullable=False)
	transaction_type = Column(String(20), nullable=False)
	description = Column(Text, nullable=True)
	reference_type = Column(String(50), nullable=True)
	reference_id = Column(Integer, nullable=True)
	balance_after = Column(Float, nullable=False)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

	wallet = relationship("Wallet", back_populates="transactions")
