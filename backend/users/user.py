from orm.model import Model, DataField    

class User (Model):
    name = DataField("")
    
    def dict(self):
        return {
            "user":self.name,
        }
