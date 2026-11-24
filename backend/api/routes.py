from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from backend.schemas.transport import BusRoute
from backend.services.route_service import RouteService

router = APIRouter(prefix="/api", tags=["Routes"])

@router.get("/routes", response_model=List[BusRoute])
def list_routes(
    origin: Optional[str] = Query(None, description="Starting stop or locality"),
    destination: Optional[str] = Query(None, description="Destination stop or locality")
):
    if origin or destination:
        return RouteService.search_routes(origin or "", destination or "")
    return RouteService.get_all_routes()

@router.get("/routes/{route_id}", response_model=BusRoute)
def get_route(route_id: str):
    route = RouteService.get_route_by_id(route_id)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route '{route_id}' not found in Chennai MTC database.")
    return route
