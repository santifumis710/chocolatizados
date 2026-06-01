import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.auth import require_admin
from app.db import get_db, DiscountCodeModel


class DiscountCodeCreate(BaseModel):
    code: str
    discount_type: str  # "percentage" or "fixed"
    discount_value: float
    max_uses: Optional[int] = None
    expires_at: Optional[datetime] = None
    is_active: bool = True


class DiscountCodeUpdate(DiscountCodeCreate):
    pass


class DiscountCodeOut(BaseModel):
    id: str
    code: str
    discount_type: str
    discount_value: float
    max_uses: Optional[int]
    uses_count: int
    expires_at: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True


class ValidateRequest(BaseModel):
    code: str
    order_total: float


router = APIRouter(prefix="/api/discount-codes", tags=["discount_codes"])


@router.post("/validate")
@router.post("/validate/")
async def validate_discount_code(body: ValidateRequest, db: Session = Depends(get_db)):
    dc = db.query(DiscountCodeModel).filter(
        DiscountCodeModel.code == body.code.strip().upper()
    ).first()

    if not dc:
        raise HTTPException(status_code=404, detail="Código no encontrado")
    if not dc.is_active:
        raise HTTPException(status_code=400, detail="El código está inactivo")
    if dc.expires_at and dc.expires_at < datetime.now():
        raise HTTPException(status_code=400, detail="El código expiró")
    if dc.max_uses is not None and dc.uses_count >= dc.max_uses:
        raise HTTPException(status_code=400, detail="El código alcanzó el límite de usos")

    if dc.discount_type == "percentage":
        discount_amount = round(body.order_total * dc.discount_value / 100, 2)
    else:
        discount_amount = min(dc.discount_value, body.order_total)

    final_total = round(body.order_total - discount_amount, 2)

    dc.uses_count += 1
    db.commit()

    return {
        "valid": True,
        "code": dc.code,
        "discount_type": dc.discount_type,
        "discount_value": dc.discount_value,
        "discount_amount": discount_amount,
        "final_total": final_total,
    }


@router.get("", response_model=List[DiscountCodeOut], dependencies=[Depends(require_admin)])
@router.get("/", response_model=List[DiscountCodeOut], dependencies=[Depends(require_admin)])
async def get_discount_codes(db: Session = Depends(get_db)):
    return db.query(DiscountCodeModel).all()


@router.post("", response_model=DiscountCodeOut, dependencies=[Depends(require_admin)])
@router.post("/", response_model=DiscountCodeOut, dependencies=[Depends(require_admin)])
async def create_discount_code(body: DiscountCodeCreate, db: Session = Depends(get_db)):
    existing = db.query(DiscountCodeModel).filter(
        DiscountCodeModel.code == body.code.strip().upper()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un código con ese nombre")

    if body.discount_type not in ("percentage", "fixed"):
        raise HTTPException(status_code=400, detail="discount_type debe ser 'percentage' o 'fixed'")
    if body.discount_value <= 0:
        raise HTTPException(status_code=400, detail="El valor del descuento debe ser positivo")
    if body.discount_type == "percentage" and body.discount_value > 100:
        raise HTTPException(status_code=400, detail="El porcentaje no puede superar 100")

    dc = DiscountCodeModel(
        id=str(uuid.uuid4()),
        code=body.code.strip().upper(),
        discount_type=body.discount_type,
        discount_value=body.discount_value,
        max_uses=body.max_uses,
        uses_count=0,
        expires_at=body.expires_at,
        is_active=body.is_active,
    )
    db.add(dc)
    db.commit()
    db.refresh(dc)
    return dc


@router.put("/{code_id}", response_model=DiscountCodeOut, dependencies=[Depends(require_admin)])
async def update_discount_code(code_id: str, body: DiscountCodeUpdate, db: Session = Depends(get_db)):
    dc = db.query(DiscountCodeModel).filter(DiscountCodeModel.id == code_id).first()
    if not dc:
        raise HTTPException(status_code=404, detail="Código no encontrado")

    if body.discount_type not in ("percentage", "fixed"):
        raise HTTPException(status_code=400, detail="discount_type debe ser 'percentage' o 'fixed'")

    dc.code = body.code.strip().upper()
    dc.discount_type = body.discount_type
    dc.discount_value = body.discount_value
    dc.max_uses = body.max_uses
    dc.expires_at = body.expires_at
    dc.is_active = body.is_active
    db.commit()
    db.refresh(dc)
    return dc


@router.delete("/{code_id}", dependencies=[Depends(require_admin)])
async def delete_discount_code(code_id: str, db: Session = Depends(get_db)):
    dc = db.query(DiscountCodeModel).filter(DiscountCodeModel.id == code_id).first()
    if not dc:
        raise HTTPException(status_code=404, detail="Código no encontrado")
    db.delete(dc)
    db.commit()
    return {"message": "Código eliminado"}
