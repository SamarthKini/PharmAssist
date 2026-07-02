from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class Medicine(SQLModel, table=True):
    # id: int | None = Field(default=None, primary_key=True)
    # name: str
    # price: float | None
    # status: bool
    # salt: str | None
    # description: str | None
    # side_effects: str | None
    # interaction: list | None

    id: Optional[int] = Field(default=None, primary_key=True)    
    name: str
    price: Optional[float] = None
    status: bool
    salt: Optional[str] = None
    description: Optional[str] = None
    side_effects: Optional[str] = None
    interaction: Optional[str] = None


class MedicineRead(SQLModel):
    id: int
    name: str
    price: Optional[float] = None
    salt: Optional[str] = None
    description: Optional[str] = None
    side_effects: Optional[str] = None
    interaction: Optional[str] = None


class MedicineAlternatives(SQLModel):
    main_medicine: MedicineRead
    alternatives: List[MedicineRead]


class ChatQuery(SQLModel):
    message: str
    prescription: List[str] = []
