import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Item, ItemCreate, ItemPublic, ItemsPublic, Dim_Petition, Dim_PetitionPublic, Dim_PetitionsPublic, ItemUpdate, Message, Facts_Petition

router = APIRouter()


@router.get("/petitions", response_model=Dim_PetitionsPublic)
def read_items(
    session: SessionDep, status: str = "" #, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve petitions.
    """
    
    statement = (
        select(Facts_Petition.petition_id, func.count(Facts_Petition.action).label('signatures'))
        .select_from(Facts_Petition)
        .where(Facts_Petition.action == "SIGNED")
        .group_by(Facts_Petition.petition_id)
    ).subquery()

    if status == "":
        end_statement = (
            select(Dim_Petition, func.coalesce(statement.c.signatures, 0).label('signatures'))
            .outerjoin(statement, Dim_Petition.id == statement.c.petition_id)
        )
    else: 
        end_statement = (
            select(Dim_Petition, func.coalesce(statement.c.signatures, 0).label('signatures'))
            .outerjoin(statement, Dim_Petition.id == statement.c.petition_id)
            .where(Dim_Petition.status == status)
        )

    petitions = session.exec(end_statement).all()
    petition_modelised = []

    for petition in petitions:
        tmp = Dim_PetitionPublic(
            id=petition.Dim_Petition.id
            , status=petition.Dim_Petition.status
            , petition_title=petition.Dim_Petition.petition_title
            , petition_text=petition.Dim_Petition.petition_text
            , petitioner=petition.Dim_Petition.petitioner
            , response=petition.Dim_Petition.response
            , signatures=petition.signatures
        )
        petition_modelised.append(tmp)

    return Dim_PetitionsPublic(petitions=petition_modelised)
