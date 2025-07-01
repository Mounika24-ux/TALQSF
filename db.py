# backend/db.py

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"  # or your Atlas connection string

client = AsyncIOMotorClient(MONGO_URL)
db = client.legal  # database name
