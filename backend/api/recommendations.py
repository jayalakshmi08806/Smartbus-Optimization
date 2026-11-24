from fastapi import APIRouter, Query
from typing import List, Optional
from backend.schemas.transport import RouteRecommendation
from backend.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/api", tags=["Recommendations"])

@router.get("/recommendations", response_model=List[RouteRecommendation])
def get_recommendations(
    origin: Optional[str] = Query(None, description="Trip origin stop"),
    destination: Optional[str] = Query(None, description="Trip destination stop"),
    preference: Optional[str] = Query("lowest_crowd", description="Preference: lowest_crowd, shortest_time, min_transfers, earliest_arrival")
):
    return RecommendationService.get_recommendations(origin=origin, destination=destination, preference=preference)
