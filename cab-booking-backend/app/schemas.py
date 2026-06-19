from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, PositiveFloat


class UserRegister(BaseModel):
	full_name: str = Field(min_length=1, max_length=100)
	email: EmailStr
	phone_number: str | None = Field(
    default=None,
    min_length=10,
    max_length=15
)
	password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
	email: EmailStr
	password: str = Field(min_length=8, max_length=128)


class ForgotPasswordRequest(BaseModel):
	email: EmailStr


class ForgotPasswordOut(BaseModel):
	message: str
	otp: str = Field(min_length=6, max_length=6)


class VerifyOtpRequest(BaseModel):
	email: EmailStr
	otp: str = Field(min_length=6, max_length=6)


class VerifyOtpOut(BaseModel):
	message: str


class ResetPasswordRequest(BaseModel):
	email: EmailStr
	otp: str = Field(min_length=6, max_length=6)
	new_password: str = Field(min_length=8, max_length=128)


class ResetPasswordOut(BaseModel):
	message: str


class UserProfileUpdate(BaseModel):
	full_name: str | None = Field(default=None, min_length=1, max_length=100)
	email: EmailStr | None = None
	phone_number: str | None = Field(default=None, min_length=10, max_length=15)


class BookingCreate(BaseModel):
	pickup_location: str = Field(min_length=1, max_length=255)
	dropoff_location: str = Field(min_length=1, max_length=255)
	ride_date: datetime
	notes: str | None = Field(default=None, max_length=1000)


class WalletTransaction(BaseModel):
	amount: PositiveFloat
	transaction_type: Literal["deposit", "withdraw", "payment", "refund"]
	description: str | None = Field(default=None, max_length=500)
	reference_type: str | None = Field(default=None, max_length=50)
	reference_id: int | None = Field(default=None, ge=1)


class BookingStatusUpdate(BaseModel):
	status: Literal["pending", "confirmed", "ongoing", "completed", "cancelled"]


class WalletTransactionRecordOut(BaseModel):
	id: int
	wallet_id: int
	user_id: int
	amount: float
	transaction_type: Literal["deposit", "withdraw", "payment", "refund"]
	description: str | None = None
	reference_type: str | None = None
	reference_id: int | None = None
	balance_after: float
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
	access_token: str
	token_type: str = "bearer"


class UserOut(BaseModel):
	id: int
	full_name: str
	email: EmailStr
	phone_number: str | None = None
	is_active: bool
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)


class UserProfileOut(UserOut):
	wallet_balance: float = Field(ge=0)
	total_rides: int = Field(ge=0)
	active_bookings: int = Field(ge=0)
	completed_rides: int = Field(ge=0)


class BookingOut(BaseModel):
	id: int
	user_id: int
	pickup_location: str
	dropoff_location: str
	ride_date: datetime
	booking_time: datetime
	status: str = Field(min_length=1, max_length=30)
	fare_amount: float = Field(ge=0)
	notes: str | None = None
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)


class WalletOut(BaseModel):
	id: int
	user_id: int
	balance: float = Field(ge=0)
	currency: str = Field(min_length=1, max_length=10)
	updated_at: datetime
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)


class WalletTransactionOut(BaseModel):
	message: str
	wallet: WalletOut
	transaction_type: Literal["deposit", "withdraw", "payment", "refund"]
	amount: float = Field(gt=0)

	model_config = ConfigDict(from_attributes=True)


class WalletStatementOut(BaseModel):
	wallet: WalletOut
	transactions: list[WalletTransactionRecordOut]
	total_credits: float = Field(ge=0)
	total_debits: float = Field(ge=0)

	model_config = ConfigDict(from_attributes=True)


class DashboardOut(BaseModel):
	total_bookings: int = Field(ge=0)
	total_rides: int = Field(ge=0)
	completed_rides: int = Field(ge=0)
	active_bookings: int = Field(ge=0)
	cancelled_rides: int = Field(ge=0)
	total_spent: float = Field(ge=0)
	wallet_balance: float = Field(ge=0)
	currency: str = Field(min_length=1, max_length=10)
	recent_bookings: list[BookingOut] = Field(default_factory=list)

	model_config = ConfigDict(from_attributes=True)
