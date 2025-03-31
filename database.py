from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Modify the connection URL with your MySQL database credentials
# Example: mysql://username:password@hostname:port/database_name
SQLALCHEMY_DATABASE_URL = "mysql://root:root@127.0.0.1:3306/dermacare"

# Create the database engine with utf8 encoding
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Create a session maker to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Create a base class for declarative class definitions
Base = declarative_base()