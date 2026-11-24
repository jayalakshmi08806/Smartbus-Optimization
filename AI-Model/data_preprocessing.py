"""
Data Preprocessing & Feature Engineering for SmartBus 2.0 AI Model
Processes GTFS transit schedules and historical commuter tap-in/crowd reports
into feature vectors suitable for regression and crowd classification.
"""

from typing import Dict, Any, List
import math
from datetime import datetime

class TransitFeatureExtractor:
    def __init__(self):
        self.crowd_classes = ["LOW", "MODERATE", "HIGH", "VERY HIGH"]

    def extract_features(
        self,
        hour: int,
        day_of_week: int,
        route_distance_km: float,
        stop_sequence_index: int,
        total_stops: int,
        is_ac_bus: bool,
        recent_crowd_report_avg: float = 0.0
    ) -> Dict[str, float]:
        """
        Extract normalized numerical features for the crowd prediction model.
        """
        # Cyclical encoding for hour of day (24-hour cycle)
        sin_hour = math.sin(2 * math.pi * hour / 24.0)
        cos_hour = math.cos(2 * math.pi * hour / 24.0)

        # Day of week features
        is_weekend = 1.0 if day_of_week in (5, 6) else 0.0

        # Relative stop position in the route (0.0 = origin, 1.0 = final destination)
        relative_stop_position = stop_sequence_index / max(1, total_stops)

        # Rush hour indicators (Chennai morning 8-10, evening 17-20)
        is_morning_rush = 1.0 if (8 <= hour <= 10) else 0.0
        is_evening_rush = 1.0 if (17 <= hour <= 20) else 0.0

        return {
            "hour": float(hour),
            "sin_hour": round(sin_hour, 4),
            "cos_hour": round(cos_hour, 4),
            "day_of_week": float(day_of_week),
            "is_weekend": is_weekend,
            "route_distance_km": float(route_distance_km),
            "relative_stop_pos": round(relative_stop_position, 3),
            "is_ac_bus": 1.0 if is_ac_bus else 0.0,
            "is_morning_rush": is_morning_rush,
            "is_evening_rush": is_evening_rush,
            "crowd_report_bias": float(recent_crowd_report_avg)
        }

    def occupancy_to_category(self, occupancy_ratio: float) -> str:
        if occupancy_ratio < 0.40:
            return "LOW"
        elif occupancy_ratio < 0.70:
            return "MODERATE"
        elif occupancy_ratio < 0.88:
            return "HIGH"
        else:
            return "VERY HIGH"
