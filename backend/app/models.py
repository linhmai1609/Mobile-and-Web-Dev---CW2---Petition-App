import datetime 
import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    dob: datetime.date
    password: str = Field(min_length=8, max_length=40)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    # created_at: float = Field(default=datetime.datetime.now().replace(tzinfo=datetime.timezone.utc).timestamp())
    # updated_at: float = Field(default=datetime.datetime.now().replace(tzinfo=datetime.timezone.utc).timestamp())


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int

# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# ----------------------------------------------------------------------------------------------------------------------------------------------------------------
# Dim_Petition

# Shared properties
class Dim_PetitionBase(SQLModel):
    status: str = Field(min_length=1, max_length=255)
    petition_title: str | None = Field(default=None)
    petition_text: str | None = Field(default=None)
    petitioner: EmailStr = Field(max_length=255)
    response: str | None = Field(default=None)

# Database model, database table inferred from class name
class Dim_Petition(Dim_PetitionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    # created_at: float = Field(default=datetime.datetime.now().replace(tzinfo=datetime.timezone.utc).timestamp())
    # updated_at: float = Field(default=datetime.datetime.now().replace(tzinfo=datetime.timezone.utc).timestamp())
    # facts: list["Facts_Petition"] = Relationship(back_populates="facts_petition")

# Properties to return via API, id is always required
class Dim_PetitionPublic(Dim_PetitionBase):
    id: uuid.UUID
    # status: str = Field(min_length=1, max_length=255)
    # petition_title: str | None = Field(default=None)
    # petition_text: str | None = Field(default=None)
    # petitioner: EmailStr = Field(max_length=255)
    # response: str | None = Field(default=None)
    signatures: int

class Dim_PetitionsPublic(SQLModel):
    petitions: list[Dim_PetitionPublic]

# Properties to receive on item creation
class Dim_PetitionCreate(Dim_PetitionBase):
    pass


# ----------------------------------------------------------------------------------------------------------------------------------------------------------------
# Dim_BioID
# Shared properties
class Dim_BioIDBase(SQLModel):
    user_id: uuid.UUID = Field(
        nullable=True, index=True, unique=True
        , foreign_key="dim_user.id"
    )

# Database model, database table inferred from class name
class Dim_BioID(Dim_BioIDBase, table=True):
    bioid: str| None = Field(
        min_length=10, 
        max_length=10, 
        primary_key=True
    )

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------
# Dim_User
# Shared properties
class Dim_UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    dob: datetime.date | None = Field(default=None)
    is_active: bool = True
    is_superuser: bool = False

# Properties to receive via API on creation
class Dim_UserCreate(Dim_UserBase):
    password: str = Field(min_length=8, max_length=40)

class Dim_UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    dob: datetime.date
    bioid: str | None = Field(
        unique=True
        , index=True
        , max_length=10
    )
    password: str = Field(min_length=8, max_length=40)

# Properties to receive via API on update, all are optional
class Dim_UserUpdate(Dim_UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)

class Dim_UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)

class Dim_UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)

# Database model, database table inferred from class name
class Dim_User(Dim_UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    # created_at: float = Field(default=datetime.datetime.now().replace(tzinfo=datetime.timezone.utc).timestamp())
    # updated_at: float = Field(default=datetime.datetime.now().replace(tzinfo=datetime.timezone.utc).timestamp())

# Properties to return via API, id is always required
class Dim_UserPublic(Dim_UserBase):
    id: uuid.UUID

class Dim_UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int
# ----------------------------------------------------------------------------------------------------------------------------------------------------------------
# Facts_Petition
# Shared properties
class Facts_PetitionBase(SQLModel):
    action: str = Field(min_length=1, max_length=255, index=True)
    message: str | None = Field(default=None)

# Properties to receive via API on creation
class Facts_PetitionCreate(Facts_PetitionBase):
    action: str = Field(min_length=1, max_length=255)
    message: str | None = Field(default=None)
    
# Database model, database table inferred from class name
class Facts_Petition(Facts_PetitionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    petition_id: uuid.UUID = Field(
        foreign_key="dim_petition.id", nullable=True, index=True
    )
    petition_affector_id: uuid.UUID = Field(
        foreign_key="dim_user.id", nullable=True, index=True
    )
    # created_at: float = Field(default=datetime.datetime.now().replace(tzinfo=datetime.timezone.utc).timestamp())
