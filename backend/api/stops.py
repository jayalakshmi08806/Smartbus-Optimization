from fastapi import APIRouter
from typing import List
from backend.schemas.transport import BusStop
from backend.services.route_service import RouteService

router = APIRouter(prefix="/api", tags=["Stops"])

@router.get("/stops", response_model=List[BusStop])
def list_stops():
    return RouteService.get_all_stops()
