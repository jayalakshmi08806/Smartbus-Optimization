from fastapi import APIRouter, Query
from typing import Optional
from backend.schemas.transport import CrowdPredictionResult
from backend.services.prediction_service import PredictionService

router = APIRouter(prefix="/api", tags=["Predictions"])

@router.get("/crowd-predictions", response_model=CrowdPredictionResult)
def get_crowd_prediction(
    route_id: Optional[str] = Query(None, description="Bus Route ID or Number"),
    stop_id: Optional[str] = Query(None, description="Specific Bus Stop ID"),
    hour: Optional[int] = Query(None, ge=0, le=23, description="Hour of the day (0-23)"),
    day_of_week: Optional[int] = Query(None, ge=0, le=6, description="0=Monday, 6=Sunday")
):
    return PredictionService.predict(route_id=route_id, stop_id=stop_id, hour=hour, day_of_week=day_of_week)
