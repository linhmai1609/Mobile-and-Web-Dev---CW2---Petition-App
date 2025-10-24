import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import ( 
    Dim_Petition
    , Dim_PetitionPublic
    , Dim_PetitionsPublic
    , Dim_PetitionPublicMe
    , Dim_PetitionsPublicMe
    , Dim_PetitionCreate
    , Dim_PetitionUpdate
    , Dim_PetitionPrivate
    , Dim_PetitionThreshold
    , Message
    , Facts_Petition
    , Facts_PetitionCreate
)

router = APIRouter()
import logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

@router.get("/", response_model=Dim_PetitionsPublic)
def read_items(
    session: SessionDep, status: str = "" , skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve all petitions.
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
            .offset(skip).limit(limit)
        )
    else: 
        end_statement = (
            select(Dim_Petition, func.coalesce(statement.c.signatures, 0).label('signatures'))
            .outerjoin(statement, Dim_Petition.id == statement.c.petition_id)
            .where(Dim_Petition.status == status)
            .offset(skip).limit(limit)
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

@router.get("/me", response_model=Dim_PetitionsPublicMe)
def read_items(
    session: SessionDep, current_user: CurrentUser, status: str = "" , skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve petitions for current user.
    """
    sum_statement = (
        select(Facts_Petition.petition_id, func.count(Facts_Petition.action).label('signatures'))
        .select_from(Facts_Petition)
        .where(Facts_Petition.action == "SIGNED")
        .group_by(Facts_Petition.petition_id)
    ).subquery()

    total_data_statement = (
        select(Dim_Petition, func.coalesce(sum_statement.c.signatures, 0).label('signatures'))
        .outerjoin(sum_statement, Dim_Petition.id == sum_statement.c.petition_id)
        .offset(skip).limit(limit)
    ).subquery()

    user_sign_statement = (
        select(Facts_Petition.petition_id, Facts_Petition.action)
        .select_from(Facts_Petition)
        .outerjoin(sum_statement, Facts_Petition.petition_id == sum_statement.c.petition_id)
        .where(Facts_Petition.action == "SIGNED")
        .where(Facts_Petition.petition_affector_id == current_user.id)
        .group_by(Facts_Petition.petition_id, Facts_Petition.action)
    ).subquery()

    if status == "":
        end_statement = (
            select(total_data_statement, func.coalesce(user_sign_statement.c.action, "NOT_SIGNED").label('action'))
            .outerjoin(user_sign_statement, total_data_statement.c.id == user_sign_statement.c.petition_id)
            .offset(skip).limit(limit)
        )
    else: 
        end_statement = (
            select(total_data_statement, func.coalesce(user_sign_statement.c.action, "NOT_SIGNED").label('action'))
            .outerjoin(user_sign_statement, total_data_statement.c.id == user_sign_statement.c.petition_id)
            .where(Dim_Petition.status == status)
            .offset(skip).limit(limit)
        )

    petitions = session.exec(end_statement).all()
    petition_modelised = []

    for petition in petitions:
        tmp = Dim_PetitionPublicMe(
            id=petition.id
            , status=petition.status
            , petition_title=petition.petition_title
            , petition_text=petition.petition_text
            , petitioner=petition.petitioner
            , response=petition.response
            , signatures=petition.signatures
            , vote_threshold=petition.vote_threshold
            , action=petition.action
        )
        petition_modelised.append(tmp)

    return Dim_PetitionsPublicMe(petitions=petition_modelised)


@router.get("/{id}", response_model=Dim_PetitionsPublic)
def read_item(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get petition by ID.
    """
    petition = session.get(Dim_Petition, id)
    if not petition:
        raise HTTPException(status_code=404, detail="Petition not found")
    # if not current_user.is_superuser and (petition.owner_id != current_user.id):
    #     raise HTTPException(status_code=400, detail="Not enough permissions")
    return petition


@router.post("/", response_model=Dim_PetitionPrivate)
def create_item(
    *, session: SessionDep, current_user: CurrentUser, petition_in: Dim_PetitionCreate
) -> Any:
    """
    Create new Petition.
    """
    threshold = session.get(Dim_PetitionThreshold, "1")

    petition = Dim_Petition.model_validate(petition_in, update={"petitioner": current_user.email, "vote_threshold": threshold.vote_threshold})
    session.add(petition)
    session.commit()
    session.refresh(petition)
    return petition


@router.patch("/{id}", response_model=Dim_PetitionPrivate)
def update_item(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    petition_in: Dim_PetitionUpdate,
) -> Any:
    """
    Update a petition's response and status.
    """
    petition = session.get(Dim_Petition, id)
    if not petition:
        raise HTTPException(status_code=404, detail="Petition not found")
    if not current_user.is_superuser and (petition.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = petition_in.model_dump(exclude_unset=True)
    petition.sqlmodel_update(update_dict)
    session.add(petition)
    session.commit()
    session.refresh(petition)
    return petition

@router.post("/vote/{id}", response_model=Facts_Petition)
def update_item(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    vote_in: Facts_PetitionCreate,
) -> Any:
    """
    Vote a petition.
    """

    # Get the petition from id
    petition = session.get(Dim_Petition, id)
    if not petition:
        raise HTTPException(status_code=404, detail="Petition not found")
    
    # Generate fact for voting action
    voting_fact = Facts_Petition.model_validate(vote_in, update={
        "petition_id": petition.id
        , "petition_affector_id": current_user.id
    })
    session.add(voting_fact)
    session.commit()
    session.refresh(voting_fact)
    return voting_fact

@router.post("/threshold")
def update_item(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    threshold: int,
) -> Message:
    """
    Update all open petition's vote threshold
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    threshold_data = session.get(Dim_PetitionThreshold, "1")

    threshold_data.vote_threshold = threshold

    session.add(threshold_data)
    session.commit()
    session.refresh(threshold_data)
    
    petition_statement = (
        select(Dim_Petition)
        .where(Dim_Petition.status == "open")
    )
    petitions = session.exec(petition_statement).all()

    for petition in petitions:
        petition.vote_threshold = threshold
        session.add(petition)
        session.commit()
        session.refresh(petition)

    return Message(message="Vote threshold update successfully")
    
    