from fastapi import FastAPI

from orm.database import SQLiteDatabase
from users.user import User
from users.event import Event
from orm.relations import Relationships

app = FastAPI()
database : SQLiteDatabase = SQLiteDatabase()
#database.connect(':memory:')
database.connect('./db.sqlite')

User.init(database)
Event.init(database)

@app.get("/")
def read_root():
    result = User.get_all()
    events = Event.get_all()
    return {"users":result, "events":events}

@app.get("/search/{name}")
def read_item(name: str):
    users = User.filter(User,f"name={name}")
    return users

@app.get("/event/add/{creator}/{to}")
def read_item(creator: str,to: str):
    event = Event()
    event.type = 0
    event.data = "asd"
    event.creator = User.filter(f"name='{creator}'")[0].pk
    event.sendto = User.filter(f"name='{to}'")[0].pk
    event.save()

    return {"creator":event.creator, "to":event.sendto}

@app.get("/user/add/{name}/{age}")
def read_item(name: str, age: int):
    user = User()
    user.name = name
    user.age = age
    user.save()

    return {"name":user.name,"age":user.age}
