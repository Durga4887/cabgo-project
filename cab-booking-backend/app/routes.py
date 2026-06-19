import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
)
from app.database import get_db
from app.models import Booking, User, Wallet, WalletTransactionRecord
from app.schemas import (
    BookingStatusUpdate,
    BookingCreate,
    BookingOut,
    DashboardOut,
    Token,
    UserProfileOut,
    UserProfileUpdate,
    UserLogin,
    UserOut,
    UserRegister,
    WalletOut,
    WalletStatementOut,
    WalletTransaction,
    WalletTransactionRecordOut,
    WalletTransactionOut,
)

router = APIRouter(tags=["cab-booking"])

ACTIVE_BOOKING_STATUSES = {"pending", "confirmed", "ongoing"}
TERMINAL_BOOKING_STATUSES = {"completed", "cancelled"}
VALID_BOOKING_STATUSES = ACTIVE_BOOKING_STATUSES | TERMINAL_BOOKING_STATUSES


def _get_or_create_wallet(db: Session, user_id: int) -> Wallet:
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()

    if wallet is None:
        wallet = Wallet(
            user_id=user_id,
            balance=0.0,
            currency="INR"
        )
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    return wallet


def _get_user_or_404(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


def _get_booking_or_404(db: Session, booking_id: int, user_id: int) -> Booking:
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id,
            Booking.user_id == user_id,
        )
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    return booking


def _transaction_type_sign(transaction_type: str) -> int:
    if transaction_type in {"deposit", "refund"}:
        return 1

    if transaction_type in {"withdraw", "payment"}:
        return -1

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unsupported transaction type",
    )


def _record_wallet_transaction(
    db: Session,
    wallet: Wallet,
    user_id: int,
    amount: float,
    transaction_type: str,
    description: str | None = None,
    reference_type: str | None = None,
    reference_id: int | None = None,
) -> WalletTransactionRecord:
    sign = _transaction_type_sign(transaction_type)
    balance_after = wallet.balance + (amount * sign)

    if balance_after < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient wallet balance",
        )

    wallet.balance = balance_after

    transaction = WalletTransactionRecord(
        wallet_id=wallet.id,
        user_id=user_id,
        amount=amount,
        transaction_type=transaction_type,
        description=description,
        reference_type=reference_type,
        reference_id=reference_id,
        balance_after=balance_after,
    )

    db.add(wallet)
    db.add(transaction)
    db.commit()
    db.refresh(wallet)
    db.refresh(transaction)

    return transaction


def _wallet_transaction_to_out(
    transaction: WalletTransactionRecord,
) -> WalletTransactionRecordOut:
    return WalletTransactionRecordOut.model_validate(transaction)


@router.post(
    "/auth/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    payload: UserRegister,
    db: Session = Depends(get_db),
) -> User:

    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    if (
        payload.phone_number
        and db.query(User)
        .filter(User.phone_number == payload.phone_number)
        .first()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        phone_number=payload.phone_number,
        hashed_password=get_password_hash(payload.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    _get_or_create_wallet(db, user.id)

    return user


@router.post("/auth/login", response_model=Token)
def login_user(
    payload: UserLogin,
    db: Session = Depends(get_db),
) -> Token:

    user = authenticate_user(
        db,
        payload.email,
        payload.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(
        {"sub": str(user.id)}
    )

    return Token(access_token=token)


@router.get(
    "/profile",
    response_model=UserProfileOut,
)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserProfileOut:

    wallet = _get_or_create_wallet(db, current_user.id)

    total_rides = db.query(func.count(Booking.id)).filter(Booking.user_id == current_user.id).scalar() or 0
    active_bookings = (
        db.query(func.count(Booking.id))
        .filter(
            Booking.user_id == current_user.id,
            Booking.status.in_(ACTIVE_BOOKING_STATUSES),
        )
        .scalar()
        or 0
    )
    completed_rides = (
        db.query(func.count(Booking.id))
        .filter(
            Booking.user_id == current_user.id,
            Booking.status == "completed",
        )
        .scalar()
        or 0
    )

    return UserProfileOut(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        phone_number=current_user.phone_number,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        wallet_balance=wallet.balance,
        total_rides=total_rides,
        active_bookings=active_bookings,
        completed_rides=completed_rides,
    )


@router.put(
    "/profile",
    response_model=UserOut,
)
def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:

    if payload.email and payload.email != current_user.email:
        existing_user = db.query(User).filter(User.email == payload.email).first()

        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

    if payload.phone_number and payload.phone_number != current_user.phone_number:
        existing_phone = db.query(User).filter(User.phone_number == payload.phone_number).first()

        if existing_phone and existing_phone.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered",
            )

    if payload.full_name is not None:
        current_user.full_name = payload.full_name

    if payload.email is not None:
        current_user.email = payload.email

    if payload.phone_number is not None:
        current_user.phone_number = payload.phone_number

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user


@router.post(
    "/bookings",
    response_model=BookingOut,
    status_code=status.HTTP_201_CREATED,
)
def create_booking(
    payload: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Booking:

    booking = Booking(
        user_id=current_user.id,
        pickup_location=payload.pickup_location,
        dropoff_location=payload.dropoff_location,
        ride_date=payload.ride_date,
        notes=payload.notes,
        status="pending",
        fare_amount=150.0,
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


@router.get(
    "/bookings/history",
    response_model=list[BookingOut],
)
def ride_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Booking]:

    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )


@router.get(
    "/bookings/{booking_id}",
    response_model=BookingOut,
)
def get_booking_by_id(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Booking:

    return _get_booking_or_404(db, booking_id, current_user.id)


@router.patch(
    "/bookings/{booking_id}/status",
    response_model=BookingOut,
)
def update_booking_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Booking:

    booking = _get_booking_or_404(db, booking_id, current_user.id)

    if payload.status not in VALID_BOOKING_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported booking status",
        )

    if booking.status in TERMINAL_BOOKING_STATUSES and payload.status != booking.status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Terminal bookings cannot be updated",
        )

    booking.status = payload.status
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


@router.post(
    "/bookings/{booking_id}/cancel",
    response_model=BookingOut,
)
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Booking:

    booking = _get_booking_or_404(db, booking_id, current_user.id)

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled",
        )

    if booking.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Completed bookings cannot be cancelled",
        )

    booking.status = "cancelled"
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


@router.get(
    "/bookings/history",
    response_model=list[BookingOut],
)
def ride_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Booking]:

    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
def wallet_statement(
    current_user: User,
    db: Session,
) -> WalletStatementOut:

    wallet = _get_or_create_wallet(
        db,
        current_user.id,
    )

    transactions = (
        db.query(WalletTransactionRecord)
        .filter(
            WalletTransactionRecord.wallet_id == wallet.id
        )
        .order_by(
            WalletTransactionRecord.created_at.desc()
        )
        .all()
    )

    total_credits = (
        db.query(
            func.coalesce(
                func.sum(WalletTransactionRecord.amount),
                0.0,
            )
        )
        .filter(
            WalletTransactionRecord.wallet_id == wallet.id,
            WalletTransactionRecord.transaction_type.in_(
                ["deposit", "refund"]
            ),
        )
        .scalar()
        or 0.0
    )

    total_debits = (
        db.query(
            func.coalesce(
                func.sum(WalletTransactionRecord.amount),
                0.0,
            )
        )
        .filter(
            WalletTransactionRecord.wallet_id == wallet.id,
            WalletTransactionRecord.transaction_type.in_(
                ["withdraw", "payment"]
            ),
        )
        .scalar()
        or 0.0
    )

    return WalletStatementOut(
        wallet=wallet,
        transactions=[
            _wallet_transaction_to_out(t)
            for t in transactions
        ],
        total_credits=float(total_credits),
        total_debits=float(total_debits),
    )
@router.get(
    "/wallet/history",
    response_model=WalletStatementOut,
)
def wallet_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WalletStatementOut:

    return wallet_statement(
        current_user=current_user,
        db=db,
    )
@router.get(
    "/wallet",
    response_model=WalletOut,
)
def get_wallet(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Wallet:

    return _get_or_create_wallet(
        db,
        current_user.id,
    )


@router.post(
    "/wallet/transaction",
    response_model=WalletTransactionOut,
)
def wallet_transaction(
    payload: WalletTransaction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WalletTransactionOut:

    wallet = _get_or_create_wallet(
        db,
        current_user.id,
    )

    transaction = _record_wallet_transaction(
        db=db,
        wallet=wallet,
        user_id=current_user.id,
        amount=payload.amount,
        transaction_type=payload.transaction_type,
        description=payload.description,
        reference_type=payload.reference_type,
        reference_id=payload.reference_id,
    )

    return WalletTransactionOut(
        message="Wallet updated successfully",
        wallet=wallet,
        transaction_type=payload.transaction_type,
        amount=payload.amount,
    )


@router.get(
    "/dashboard",
    response_model=DashboardOut,
)
def dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DashboardOut:

    wallet = _get_or_create_wallet(db, current_user.id)

    total_rides = db.query(func.count(Booking.id)).filter(Booking.user_id == current_user.id).scalar() or 0
    completed_rides = (
        db.query(func.count(Booking.id))
        .filter(
            Booking.user_id == current_user.id,
            Booking.status == "completed",
        )
        .scalar()
        or 0
    )
    active_bookings = (
        db.query(func.count(Booking.id))
        .filter(
            Booking.user_id == current_user.id,
            Booking.status.in_(ACTIVE_BOOKING_STATUSES),
        )
        .scalar()
        or 0
    )
    cancelled_rides = (
        db.query(func.count(Booking.id))
        .filter(
            Booking.user_id == current_user.id,
            Booking.status == "cancelled",
        )
        .scalar()
        or 0
    )
    total_spent = (
        db.query(func.coalesce(func.sum(WalletTransactionRecord.amount), 0.0))
        .filter(
            WalletTransactionRecord.user_id == current_user.id,
            WalletTransactionRecord.transaction_type == "payment",
        )
        .scalar()
        or 0.0
    )
    recent_bookings = (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .limit(5)
        .all()
    )

    return DashboardOut(
        total_bookings=total_rides,
        total_rides=total_rides,
        completed_rides=completed_rides,
        active_bookings=active_bookings,
        cancelled_rides=cancelled_rides,
        total_spent=float(total_spent),
        wallet_balance=wallet.balance,
        currency=wallet.currency,
        recent_bookings=recent_bookings,
    )