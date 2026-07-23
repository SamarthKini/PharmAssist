from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func
from app.database import get_session
from app.models import Medicine, MedicineRead, MedicineAlternatives

router = APIRouter()

@router.get("/search")  
async def search_medicines(
    name: str,
    skip: int = Query(0, ge=0, description="Number of alternatives to skip"),
    limit: int = Query(None, ge=1, description="Number of alternatives to return"),
    session: Session = Depends(get_session)
):
    medicine = session.exec(
        select(Medicine)
        .where(Medicine.name.ilike(f"{name}%"))
        .where(Medicine.status == 1)
        # change here
    ).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    alternatives_query = select(Medicine).where(
        Medicine.id != medicine.id,
        Medicine.status == True,
        Medicine.salt.isnot(None)
    )

    if medicine.salt:
        salt_components = sorted([comp.strip() for comp in medicine.salt.lower().split("+") if comp.strip()])
        normalized_salt = " + ".join(salt_components)
        alternatives_query = alternatives_query.where(Medicine.salt.ilike(normalized_salt))

    total = session.exec(
        select(func.count()).select_from(alternatives_query.subquery())
    ).one()

    alternatives = session.exec(
        alternatives_query.offset(skip).limit(limit)
    ).all()

    return {
        "main_medicine": MedicineRead(**medicine.dict()),
        "alternatives": [MedicineRead(**alt.dict()) for alt in alternatives],
        "total": total,
        "skip": skip,
        "limit": limit,
    }