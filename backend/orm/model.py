from orm.relations import Relationships

class DataField:

    def __init__(self, default="", type="TEXT"):
        self.default = default
        self.type = type
        
    def parse(self):
        return self.default

    def get_type(self, key):
        type = self.type if self.type else "TEXT"
        return f"{key} {type}"

class ForeignKey(DataField):
    def __init__(self, model: type, related_name: str = None):
        self.model = model

        val = f"FOREIGN KEY (KEY_NAME) REFERENCES {model.get_table_name()}(pk)"
        self.key = val
        self.type = "INTEGER"
        
        self.related_name = related_name or f"{model.get_table_name()}_set"

    def get_for(self, key):
        return f"{self.key.replace('KEY_NAME',key)}"
        
class Model:

    migrated = False
    database = None
    table_name = ""
    max_pk = 0
    
    pk = DataField("","INTEGER PRIMARY KEY AUTOINCREMENT")

    @classmethod
    def init(cls, database):
        cls.database = database
        cls.__migrate__()

    @classmethod
    def get_table_name(cls) -> str:
        return cls.__name__.lower()        

    def __init__(self):
        self._exists = False
        self._reverse_relations = {}

    def get_related(self,name):
        if name not in Relationships.relations:
            raise Exception(f"no related name called '{name}'")

        related = Relationships.relations[name]
        search = Relationships.keys[name]
        return related.filter(f"{search}=1")

    @classmethod
    def filter(cls,search):
        result = cls.database.query(f"SELECT * FROM {cls.get_table_name()} where {search}")
        if not result:
            return []

        return [cls.load(row) for row in result]


    @classmethod
    def get_fields(cls):
        fields = {}
        for base in reversed(cls.__mro__):
            for k, v in base.__dict__.items():
                if isinstance(v, DataField):
                    fields[k] = v
        return fields
    
    @classmethod
    def get(cls, pk=None):
        """
        Fetch a single record by primary key.
        Returns None if not found.
        """
        cls.__migrate__()  # ensure table exists
        if pk is None:
            return None

        result = cls.database.query(f"SELECT * FROM {cls.get_table_name()} WHERE pk={pk} LIMIT 1")
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
        result = cls.database.query(f"SELECT * FROM {cls.get_table_name()}")
        if not result:
            return []

        return [cls.load(row) for row in result]
    
    @classmethod
    def load(cls, values: dict):
        obj = cls()
        obj._exists = True
        fields = {k: v for k, v in cls.__dict__.items() if isinstance(v, DataField)}

        setattr(obj, "pk", values[0])
        
        index = 1
        print(values)
        for key in fields.keys():
            if isinstance(fields[key], ForeignKey):
                try:
                    model = fields[key].model.get(pk=values[index])
                    setattr(obj, key, model)
                except:
                    pass
            else:
                setattr(obj, key, values[index])
            index += 1
        
        return obj

    def delete(self):
        if self._exists:
            self.database.delete(self)
            self._exists = False

    def save(self):
        self.__migrate__()
        if self._exists:
            result = self.database.update(self)
        else:
            result = self.database.insert(self)
            self.max_pk += 1
            self.pk = self.max_pk
            self._exists = True
            

    @classmethod
    def __migrate__(cls):
        if cls.migrated: return
        cls.migrated = True
        cls.database.create(cls)

