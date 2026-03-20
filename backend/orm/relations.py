class Relationships:
    
    relations = {}
    keys = {}

    @classmethod
    def init_relationship(cls, name, key, to):
        cls.relations[name] = to
        cls.keys[name] = key
