from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.database import Base, engine
from app.routes import router

app = FastAPI(
    title="Cab Booking API",
    description=(
        "Production-ready backend for cab booking, profile management, "
        "booking lifecycle, wallet ledger, and dashboard analytics."
    ),
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(router)


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(
    request: Request,
    exc: SQLAlchemyError,
):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "A database error occurred while processing the request."
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected server error occurred."
        },
    )


@app.get("/")
def root():
    return {
        "message": "Cab Booking API Running",
        "docs": "/docs",
    }