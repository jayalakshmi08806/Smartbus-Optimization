from fastapi import APIRouter
from datetime import datetime
from backend.config import settings
from backend.services.route_service import RouteService

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
def health_check():
    routes = RouteService.get_all_routes()
    stops = RouteService.get_all_stops()
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now().isoformat(),
        "network_region": "Chennai Metropolitan Transport Corporation (MTC)",
        "active_routes_count": len(routes),
        "total_stops_monitored": len(stops),
        "ai_model_mode": "Heuristic ML Hybrid Calibrated Predictor",
        "data_notice": settings.DATA_SOURCE_NOTICE
    }
