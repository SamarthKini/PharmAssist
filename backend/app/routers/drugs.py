from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Medicine, MedicineRead, MedicineAlternatives
from sqlalchemy import or_, and_


router = APIRouter()

@router.get("/search", response_model=MedicineAlternatives)
async def search_medicines(name: str, session: Session = Depends(get_session)):
    medicine = session.exec(
        select(Medicine).where(Medicine.name.ilike(f"{name}%"))
        .where(Medicine.status == True)
    ).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    
    alternatives = []
    # if medicine.salt:
    #     primary_salt = medicine.salt.split()[0].strip()
    #     alternatives = session.exec(
    #         select(Medicine)
    #         .where(Medicine.salt.contains(primary_salt))
    #         .where(Medicine.id != medicine.id)
    #         .where(Medicine.status == True)
    #         .limit(5)
    #     ).all()

    # return MedicineAlternatives(
    #     main_medicine = MedicineRead(**medicine.dict()),
    #     alternatives = [MedicineRead(**alternative.dict())for alternative in alternatives]
    # )
    if medicine.salt:
    #     salt_components = [s.strip() for s in medicine.salt.split("+") if s.strip()]
    #     if salt_components:
    #         query = select(Medicine).where(Medicine.id != medicine.id).where(Medicine.status == True)
    #         or_conditions = []
    #         for comp in salt_components:
    #             or_conditions.append(Medicine.salt.contains(comp))
            
    #         query = query.where(or_(*or_conditions) if or_conditions else query)
    #         # alternatives = session.exec(query.limit(10)).all()
    #         alternatives = session.exec(query).all()
    
    # return MedicineAlternatives(
    #     main_medicine=MedicineRead(**medicine.dict()),
    #     alternatives=[MedicineRead(**alt.dict()) for alt in alternatives]
    # )
        normalized_salt = medicine.salt.lower().strip()
        
        salt_components = sorted([comp.strip() for comp in normalized_salt.split("+")])
        
        normalized_salt = " + ".join(salt_components)
        
        alternatives = session.exec(
            select(Medicine)
            .where(Medicine.id != medicine.id)
            .where(Medicine.status == True)
            .where(Medicine.salt != None)  
            .where(Medicine.salt.ilike(f"{normalized_salt}"))
        ).all()
    
    return MedicineAlternatives(
        main_medicine=MedicineRead(**medicine.dict()),
        alternatives=[MedicineRead(**alt.dict()) for alt in alternatives]
    )