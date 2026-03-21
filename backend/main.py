from fastapi import FastAPI

from orm.database import SQLiteDatabase
from users.user import User
from orm.relations import Relationships
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from events.views import Event, router as event_router

app = FastAPI()

origins = "*"

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database : SQLiteDatabase = SQLiteDatabase()
#database.connect(':memory:')
database.connect('./db.sqlite')

User.init(database)
Event.init(database)

app.include_router(event_router)

@app.get("/")
def read_root():
    return { "users":User.get_all() } 

class UserCreate(BaseModel):
    name: str

@app.post("/user/")
async def user_create(userReq: UserCreate):
    user: User = User()
    user.name = userReq.name
    user.save()
    return user 

@app.delete("/user/{pk}")
async def user_create(pk: int):
    user: User = User.get(pk=pk)
    user.delete()
    return True

@app.get("/users")
async def user_create():
    return User.get_all()
