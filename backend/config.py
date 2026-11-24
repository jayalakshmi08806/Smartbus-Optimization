import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "SmartBus 2.0 API"
    VERSION: str = "2.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    DATA_SOURCE_NOTICE: str = "Chennai MTC GTFS Demonstration Dataset & Real-Time Simulated Crowd ML Pipeline"

settings = Settings()
