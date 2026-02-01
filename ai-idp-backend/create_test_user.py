#!/usr/bin/env python
"""Create a test user for the application"""
import sys
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.models import User
from app.core.security import hash_password

def create_test_user(email: str = "test@example.com", password: str = "test123"):
    db: Session = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"User {email} already exists! Deleting and recreating...")
            db.delete(existing_user)
            db.commit()
        
        # Create new user
        user = User(
            email=email,
            hashed_password=hash_password(password),
            is_active=True,
            role="user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"✅ Created user: {email} with password: {password}")
        print(f"   User ID: {user.id}")
        print(f"   Role: {user.role}")
        print(f"   Hashed Password: {user.hashed_password[:50]}...")
        return user
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating user: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "test@example.com"
    password = sys.argv[2] if len(sys.argv) > 2 else "test123"
    create_test_user(email, password)
