from orm.model import Model, DataField, ForeignKey

from users.user import User

class Event(Model):
    type = DataField("", "INTEGER")
    data = DataField("","TEXT")
    creator = ForeignKey(User(), "own_events")
    sendto = ForeignKey(User(), "events")
   
    def __str__(self):
        return f"{self.type} {self.data} {self.creator} {self.sendto}"
