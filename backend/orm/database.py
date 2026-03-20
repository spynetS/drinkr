import sqlite3
import threading
from users.user import Model, DataField
from orm.model import ForeignKey
from orm.relations import Relationships

class Database:
    def connect(self, path: str, ) -> bool:
        """Connecting to database"""
        pass

    def query (self, query: str):
        """query database"""
        pass

    def disconnect(self, full_file_name: str) -> dict:
        """Extract text from the currently loaded file."""
        pass

class SQLiteDatabase(Database):
    
    def connect(self, path: str):
        self.conn = sqlite3.connect(path, check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.lock = threading.Lock()

    def insert(self,model:Model):
        user_fields = model.get_fields()

        columns = "("
        values = "("
        for k, v in model.__dict__.items():
            for key, value in user_fields.items():
                if k == key:
                    print(k,v)
                    columns += k +", "
                    if isinstance(v,str):
                        values += "'" + v +"', "
                    else:
                        values += str(v) +", "
        columns = columns.rstrip(", ") + ")"
        values = values.rstrip(", ") + ")"
        

        self.query(f"INSERT INTO {model.get_table_name()} {columns} VALUES {values}")

    def get(self, model_cls: type[Model], pk_value):
        sql = f"SELECT * FROM {model_cls.get_table_name()} WHERE pk = {pk_value} LIMIT 1"
        rows = self.query(sql)
        if not rows:
            return None
        row = dict(rows[0])
        return model_cls.load(row)

    def filter(self, model_cls: type[Model], **kwargs):
        """
        Fetch records with WHERE conditions.
        Usage: db.filter(User, age=25, name="Alice")
        """
        if not kwargs:
            sql = f"SELECT * FROM {model_cls.get_table_name()}"
        else:
            conditions = []
            for key, value in kwargs.items():
                if isinstance(value, str):
                    conditions.append(f"{key}='{value}'")
                else:
                    conditions.append(f"{key}={value}")
            where_clause = " AND ".join(conditions)
            sql = f"SELECT * FROM {model_cls.get_table_name()} WHERE {where_clause}"

        rows = self.query(sql)
        if not rows:
            return []

        # Convert each row to an instance
        return [model_cls.load(row) for row in rows]

    def update(self,model:Model):
        user_fields = model.get_fields()

        values = ""
        for k, v in model.__dict__.items():
            for key, value in user_fields.items():
                if k == key and k != "pk":
                    values += k+"="
                    if v == None: v = "NULL"
                    if isinstance(v,str):
                        values += "'" + v +"', "
                    else:
                        values += str(v) +", "

        values = values.rstrip(", ") + ""
        
        self.query(f"UPDATE {model.get_table_name()} SET {values} WHERE pk={model.pk}")

    def create(self, cls):
        user_fields = cls.get_fields()
        
        columns = []
        for key, field in user_fields.items():
            columns.append(field.get_type(key))
            
        for key, field in user_fields.items():
            # if the field is a foreignkey register the relationship
            # the related name and the class type
            if isinstance(field, ForeignKey):
                Relationships.init_relationship(field.related_name, key, cls)
                columns.append(field.get_for(key))
            

            
        columns_str = ", ".join(columns)
            

        sql = f"CREATE TABLE IF NOT EXISTS {cls.get_table_name()} ({columns_str})"
        self.query(sql)        

    def query(self, query: str):
        with self.lock:
            print("SQL:",query)
            self.cursor.execute(query)
            self.conn.commit()
            return self.cursor.fetchall()
