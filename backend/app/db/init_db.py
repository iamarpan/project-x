from app.db.session import engine
from app.models.base import Base
from app.models.candidate import Candidate
from app.models.interview import Interview

def init_db():
    Base.metadata.create_all(bind=engine) 