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


# user = User()
# user.name = "roos"
# user.age = 11
# user.save()

# event = Event()
# event.type = 0
# event.data = "BLA bla"
# event.creator = 1
# event.save()

print(Relationships.relations)
user = User.get(pk=1)


event = Event.get(pk=1)
event.creator = None
event.save()

if user: 
   for event in user.get_related("own_events"):
       print("own:",event)
   for event in user.get_related("events"):
       print("to:",event)

@app.get("/")
def read_root():
    result = User.get_all()
    return {"users":result}

@app.get("/search/{name}")
def read_item(name: str):
    users = User.database.filter(User,name=name)
    return users
    

@app.get("/add/{name}/{age}")
def read_item(name: str, age: int):
    user = User()
    
    user.name = name
    user.age = age
    user.save()

    return {"name":user.name,"age":user.age}
