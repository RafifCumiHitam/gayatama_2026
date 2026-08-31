from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(tags=["Health"])


@router.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """Application status check endpoint."""
    return {"status": "ok"}


@router.get("/health/db", status_code=status.HTTP_200_OK)
def db_health_check(db: Session = Depends(get_db)):
    """Database connection status check endpoint."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}
