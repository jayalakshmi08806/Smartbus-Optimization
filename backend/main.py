from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.api import health, routes, stops, predictions, recommendations, crowd, analytics

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Backend API service for SmartBus 2.0 – Next-Generation AI-Powered Public Transport Platform (Chennai MTC)."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(routes.router)
app.include_router(stops.router)
app.include_router(predictions.router)
app.include_router(recommendations.router)
app.include_router(crowd.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to SmartBus 2.0 API Platform",
        "documentation": "/docs",
        "health_check": "/api/health",
        "region": "Chennai MTC Transport Network"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
