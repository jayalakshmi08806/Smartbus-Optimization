from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

CrowdCategory = Literal["LOW", "MODERATE", "HIGH", "VERY HIGH"]

class BusStop(BaseModel):
    id: str
    name: str
    code: str
    latitude: float
    longitude: float
    locality: str
    zone: str

class StopTiming(BaseModel):
    stop_id: str
    stop_name: str
    sequence: int
    scheduled_arrival: str
    scheduled_departure: str
    distance_km: float
    predicted_crowd: CrowdCategory
    expected_passenger_load: int

class BusRoute(BaseModel):
    id: str
    route_number: str
    name: str
    origin: str
    destination: str
    distance_km: float
    estimated_duration_min: int
    frequency_min: int
    first_bus: str
    last_bus: str
    bus_type: str  # e.g., "Ordinary", "Deluxe", "Express", "AC Electric"
    stops: List[StopTiming]
    current_crowd_level: CrowdCategory
    crowd_trend: str
    transfers: int = 0

class CrowdPredictionQuery(BaseModel):
    route_id: Optional[str] = None
    stop_id: Optional[str] = None
    hour: Optional[int] = Field(default=None, ge=0, le=23)
    day_of_week: Optional[int] = Field(default=None, ge=0, le=6)

class CrowdPredictionResult(BaseModel):
    route_id: str
    route_number: str
    stop_id: Optional[str]
    stop_name: Optional[str]
    predicted_crowd: CrowdCategory
    expected_passenger_count: int
    bus_capacity: int
    occupancy_percentage: float
    prediction_time: str
    last_updated: str
    reliability_score: float  # e.g. 0.89 for 89%
    data_source: str
    is_sample_data: bool
    hourly_trend: List[dict]
    factors: List[str]

class CrowdReportCreate(BaseModel):
    route_number: str
    stop_name: str
    crowd_level: CrowdCategory
    passenger_load_estimate: Optional[int] = None
    comments: Optional[str] = None
    reporter_id: Optional[str] = "anonymous"

class CrowdReportResponse(BaseModel):
    id: str
    route_number: str
    stop_name: str
    crowd_level: CrowdCategory
    comments: Optional[str]
    submitted_at: str
    status: str
    validation_status: str

class RouteRecommendation(BaseModel):
    route_id: str
    route_number: str
    origin: str
    destination: str
    bus_type: str
    estimated_duration_min: int
    predicted_crowd: CrowdCategory
    waiting_time_min: int
    transfers: int
    fare_inr: int
    comfort_score: int  # 1 to 100
    recommendation_reason: str
    savings_highlight: str

class OperatorAnalytics(BaseModel):
    total_routes_monitored: int
    active_buses: int
    average_network_occupancy: float
    overcrowded_routes_count: int
    reports_submitted_today: int
    peak_hours: List[dict]
    route_demand_ranking: List[dict]
    critical_alerts: List[dict]
    ai_recommendations: List[dict]
