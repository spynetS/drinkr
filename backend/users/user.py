
class DataField:
    def __init__(self, default="", type="TEXT"):
        self.default = default
        self.type = type

    def __str__(self):
        return self.value
        
class Model:

    migrated = False
    pk = 0
    database = None
    table_name = ""

    @classmethod
    def init(cls, database):
        cls.database = database
        cls.__migrate__()
        

    def __init__(self):
        self._exists = False

    def load(self, data) -> Model:
        """OVER THIS"""
        pass

    @classmethod
    def get(cls, pk=None):
        """
        Fetch a single record by primary key.
        Returns None if not found.
        """
        cls.__migrate__()  # ensure table exists
        if pk is None:
            return None

        result = cls.database.query(f"SELECT * FROM {cls.table_name} WHERE pk={pk} LIMIT 1")
        if result:
            return cls.load(result[0])  # convert row to dict and load instance
        return None

    @classmethod
    def get_all(cls):
        """
        Fetch all records from the table.
        Returns a list of model instances.
        """
        cls.__migrate__()  # ensure table exists
        result = cls.database.query(f"SELECT * FROM {cls.table_name}")
        if not result:
            return []

        return [cls.load(row) for row in result]
    
    @classmethod
    def load(cls, values: dict):
        obj = cls()
        obj._exists = True
        fields = {k: v for k, v in cls.__dict__.items() if isinstance(v, DataField)}
        print(values)

        setattr(obj, "pk", values[0])
        
        index = 1
        for key in fields.keys():
            setattr(obj, key, values[index])
            index += 1
        
        print(obj)
        return obj
    
    def save(self):
        self.__migrate__()
        if self._exists:
            self.database.update(self)
        else:
            self.database.insert(self)
            self._exists = True    

    @classmethod
    def __migrate__(cls):
        if cls.migrated: return
        cls.migrated = True
        cls.database.create(cls)

    

class User (Model):

    name = DataField("")
    age = DataField("","INTEGER")

    def dict(self):
        return {
            "user":self.name,
            "age":self.age
        }
