from typing import List, Optional
from backend.schemas.transport import RouteRecommendation, CrowdCategory
from backend.services.route_service import RouteService

class RecommendationService:
    @staticmethod
    def get_recommendations(
        origin: Optional[str] = None,
        destination: Optional[str] = None,
        preference: Optional[str] = "lowest_crowd"
    ) -> List[RouteRecommendation]:
        
        # Comprehensive curated recommendations for major Chennai corridors
        results = [
            RouteRecommendation(
                route_id="mtc_570_ac",
                route_number="570 AC",
                origin=origin or "Koyambedu (CMBT)",
                destination=destination or "SIPCOT Siruseri IT Park",
                bus_type="Electric AC Deluxe",
                estimated_duration_min=68,
                predicted_crowd="LOW",
                waiting_time_min=8,
                transfers=0,
                fare_inr=55,
                comfort_score=94,
                recommendation_reason="Guaranteed seat availability and 45% less crowded than regular 570 during OMR office commute.",
                savings_highlight="Saves 35 passengers standing crowd density"
            ),
            RouteRecommendation(
                route_id="mtc_19b",
                route_number="19B",
                origin="Saidapet Court",
                destination="SIPCOT Siruseri IT Park",
                bus_type="Deluxe",
                estimated_duration_min=55,
                predicted_crowd="MODERATE",
                waiting_time_min=5,
                transfers=1,
                fare_inr=35,
                comfort_score=82,
                recommendation_reason="Bypasses Guindy Kathipara congestion via Madhya Kailash corridor.",
                savings_highlight="13 minutes faster total transit time"
            ),
            RouteRecommendation(
                route_id="mtc_570",
                route_number="570 (Delayed Departure)",
                origin=origin or "Koyambedu (CMBT)",
                destination=destination or "SIPCOT Siruseri IT Park",
                bus_type="Deluxe Express",
                estimated_duration_min=75,
                predicted_crowd="MODERATE",
                waiting_time_min=20,
                transfers=0,
                fare_inr=32,
                comfort_score=76,
                recommendation_reason="Departing 20 mins later avoids the 18:00 IT shift peak rush, cutting crowd by 40%.",
                savings_highlight="Drops crowd from VERY HIGH to MODERATE"
            ),
            RouteRecommendation(
                route_id="mtc_27b",
                route_number="27B",
                origin="Koyambedu (CMBT)",
                destination="Marina Beach / Central",
                bus_type="Express Deluxe",
                estimated_duration_min=45,
                predicted_crowd="LOW",
                waiting_time_min=6,
                transfers=0,
                fare_inr=28,
                comfort_score=90,
                recommendation_reason="Direct coastal connector with 60% empty seating off-peak.",
                savings_highlight="Lowest crowded route to Central coast"
            )
        ]

        if preference == "shortest_time":
            results.sort(key=lambda r: r.estimated_duration_min + r.waiting_time_min)
        elif preference == "min_transfers":
            results.sort(key=lambda r: (r.transfers, r.estimated_duration_min))
        elif preference == "earliest_arrival":
            results.sort(key=lambda r: r.waiting_time_min)
        else: # lowest_crowd
            crowd_order = {"LOW": 1, "MODERATE": 2, "HIGH": 3, "VERY HIGH": 4}
            results.sort(key=lambda r: (crowd_order.get(r.predicted_crowd, 2), -r.comfort_score))

        return results
