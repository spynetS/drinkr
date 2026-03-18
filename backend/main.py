from fastapi import FastAPI

from database import SQLiteDatabase
from users.user import User

app = FastAPI()
database : SQLiteDatabase = SQLiteDatabase()
#database.connect(':memory:')
database.connect('./db.sqlite')

User.table_name = "users"
User.init(database)

@app.get("/")
def read_root():
    #result = database.query('SELECT * FROM users')
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
