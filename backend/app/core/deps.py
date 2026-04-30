from fastapi import Depends, HTTPException, Cookie
from jose import jwt
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.db.database import SessionLocal
from app.db.models import User
from app.core.auth import SECRET_KEY, ALGORITHM

security = HTTPBearer(auto_error=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()





def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    access_token: str = Cookie(None, alias="access_token"),  # 🔥 ADD alias
    db: Session = Depends(get_db),
):
    token = None

    # ✅ priority: header (backward compatible)
    if creds:
        token = creds.credentials
    elif access_token:
        token = access_token

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user