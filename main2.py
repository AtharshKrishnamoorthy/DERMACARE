# Importing necessary modules
import datetime
from fastapi import Depends, FastAPI, HTTPException, Form, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Patients, Base
from decimal import Decimal

# Dependencies for user Authentication
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError
import jwt
from passlib.context import CryptContext

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Creating FastAPI app
app = FastAPI()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for patient data
class PatientsModel(BaseModel):
    patient_id: int
    patient_name: str
    patient_mail: str
    patient_no: str
    patient_pass: str

# Secret key to sign JWT tokens
SECRET_KEY = "your-secret-key"
# Token expiration time
TOKEN_EXPIRATION = timedelta(minutes=30)

# Create a password context for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2PasswordBearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Function to verify user credentials
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Function to get user details by patient_name
def get_user(username: str, db: Session):
    return db.query(Patients).filter(Patients.patient_name == username).first()

# Function to authenticate user and issue JWT token
def authenticate_user(username: str, password: str, db: Session):
    user = get_user(username, db)
    if not user or not verify_password(password, user.patient_pass):
        return False
    return user

# Function to create JWT token
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# Pydantic model for the sign-up request body
class SignUpRequest(BaseModel):
    name: str
    password: str
    email: str
    phone_number: str

# Sign-up Endpoint
@app.post("/signup/", tags=['User Authentication'])
def sign_up(signup_request: SignUpRequest, db: Session = Depends(get_db)):
    # Check if the username is already taken
    existing_user = db.query(Patients).filter(Patients.patient_name == signup_request.name).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    # Hash the password before saving it
    hashed_password = pwd_context.hash(signup_request.password)

    # Create a new user record
    new_patient = Patients(
        patient_name=signup_request.name,
        patient_pass=hashed_password,
        patient_mail=signup_request.email,
        patient_no=signup_request.phone_number
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient

# Sign-in Endpoint
@app.post("/signin/", tags=['User Authentication'])
def sign_in(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    # Create JWT token
    access_token = create_access_token(data={"sub": user.patient_name}, expires_delta=TOKEN_EXPIRATION)
    return {"access_token": access_token, "token_type": "bearer"}

# Function to verify JWT token
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")