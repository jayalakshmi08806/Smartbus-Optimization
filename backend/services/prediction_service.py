import math
from datetime import datetime
from typing import Dict, List, Optional
from backend.schemas.transport import CrowdPredictionResult, CrowdCategory
from backend.services.route_service import RouteService, STOPS_BY_ID

class PredictionService:
    @staticmethod
    def calculate_crowd_level(occupancy_pct: float) -> CrowdCategory:
        if occupancy_pct < 0.40:
            return "LOW"
        elif occupancy_pct < 0.70:
            return "MODERATE"
        elif occupancy_pct < 0.88:
            return "HIGH"
        else:
            return "VERY HIGH"

    @staticmethod
    def predict(
        route_id: Optional[str] = None,
        stop_id: Optional[str] = None,
        hour: Optional[int] = None,
        day_of_week: Optional[int] = None
    ) -> CrowdPredictionResult:
        now = datetime.now()
        current_hour = hour if hour is not None else now.hour
        current_day = day_of_week if day_of_week is not None else now.weekday()

        route = RouteService.get_route_by_id(route_id or "mtc_570")
        if not route:
            routes = RouteService.get_all_routes()
            route = routes[0]

        stop_name = "Overall Route Average"
        stop_multiplier = 1.0

        if stop_id:
            for s in route.stops:
                if s.stop_id == stop_id:
                    stop_name = s.stop_name
                    # intermediate stops near Guindy/Vadapalani have higher multipliers
                    if "guindy" in s.stop_id or "velachery" in s.stop_id or "tnagar" in s.stop_id:
                        stop_multiplier = 1.25
                    elif "siruseri" in s.stop_id or "marina" in s.stop_id or "navalur" in s.stop_id:
                        stop_multiplier = 0.75
                    break

        # Time-of-day demand model for Chennai urban transit:
        # Morning peak: 08:00 - 10:30 (Tech & office commute)
        # Afternoon lull: 12:00 - 15:30
        # Evening peak: 17:00 - 20:30 (IT corridor & market surge)
        # Night drop: after 21:30
        base_occupancy = 0.35

        # Morning Gaussian peak centered at 9.0
        m_peak = 0.52 * math.exp(-((current_hour - 9.0) ** 2) / 2.8)
        # Evening Gaussian peak centered at 18.2
        e_peak = 0.56 * math.exp(-((current_hour - 18.2) ** 2) / 3.4)
        
        # Weekend adjustment (Sundays have lower peak office transit, higher beach/retail)
        weekend_factor = 0.82 if current_day in (5, 6) else 1.05

        occupancy = (base_occupancy + m_peak + e_peak) * stop_multiplier * weekend_factor
        # Cap between 0.15 and 0.98
        occupancy = max(0.18, min(0.98, occupancy))

        crowd_category = PredictionService.calculate_crowd_level(occupancy)

        bus_capacity = 65  # 40 seated + 25 standing max capacity
        expected_passengers = int(occupancy * bus_capacity)

        # 24-hour prediction trend curve
        hourly_trend = []
        for h in range(5, 24):
            h_m = 0.52 * math.exp(-((h - 9.0) ** 2) / 2.8)
            h_e = 0.56 * math.exp(-((h - 18.2) ** 2) / 3.4)
            h_occ = max(0.18, min(0.98, (base_occupancy + h_m + h_e) * stop_multiplier * weekend_factor))
            hourly_trend.append({
                "hour": f"{h:02d}:00",
                "hour_num": h,
                "occupancy_pct": round(h_occ * 100, 1),
                "expected_passengers": int(h_occ * bus_capacity),
                "crowd_level": PredictionService.calculate_crowd_level(h_occ)
            })

        # Calculate model reliability score (higher during standard operating hours)
        reliability = 0.92 if (6 <= current_hour <= 22) else 0.78
        if "AC" in route.bus_type:
            reliability += 0.04

        factors = [
            f"Time of Day ({current_hour:02d}:00 - {'Peak hours' if (8 <= current_hour <= 10 or 17 <= current_hour <= 20) else 'Normal transit'})",
            f"Day profile ({'Weekend travel pattern' if current_day in (5, 6) else 'Weekday commuter rush'})",
            f"Route characteristic ({route.route_number} {route.bus_type})",
            "Stop boarding pressure based on historical MTC tap patterns"
        ]

        return CrowdPredictionResult(
            route_id=route.id,
            route_number=route.route_number,
            stop_id=stop_id,
            stop_name=stop_name,
            predicted_crowd=crowd_category,
            expected_passenger_count=expected_passengers,
            bus_capacity=bus_capacity,
            occupancy_percentage=round(occupancy * 100, 1),
            prediction_time=now.strftime("%Y-%m-%d %H:%M:%S"),
            last_updated="Just now (Simulated Inference Pipeline)",
            reliability_score=round(reliability, 2),
            data_source="SmartBus Heuristic ML Inference Model (MTC GTFS & Historical Calibrated Demand)",
            is_sample_data=True,
            hourly_trend=hourly_trend,
            factors=factors
        )
