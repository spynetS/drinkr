from orm.model import Model, DataField    

class User (Model):

    name = DataField("")
    age = DataField("","INTEGER")
    
    def dict(self):
        return {
            "user":self.name,
            "age":self.age
        }
