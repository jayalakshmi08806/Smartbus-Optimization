"""
Prediction inference module for SmartBus 2.0
Can be called directly by external services or backend prediction routes.
"""

from typing import Dict, Any
from data_preprocessing import TransitFeatureExtractor

class SmartBusPredictor:
    def __init__(self):
        self.extractor = TransitFeatureExtractor()

    def predict_crowd(
        self,
        hour: int,
        day_of_week: int,
        route_distance_km: float = 30.0,
        stop_sequence_index: int = 5,
        total_stops: int = 10,
        is_ac_bus: bool = False
    ) -> Dict[str, Any]:
        feats = self.extractor.extract_features(
            hour=hour,
            day_of_week=day_of_week,
            route_distance_km=route_distance_km,
            stop_sequence_index=stop_sequence_index,
            total_stops=total_stops,
            is_ac_bus=is_ac_bus
        )

        # Baseline inference formula
        import math
        m_peak = 0.52 * math.exp(-((hour - 9.0) ** 2) / 3.0)
        e_peak = 0.58 * math.exp(-((hour - 18.2) ** 2) / 3.5)
        pos_weight = 1.15 if (0.3 <= feats["relative_stop_pos"] <= 0.7) else 0.85
        ac_weight = 0.72 if is_ac_bus else 1.05

        occupancy = (0.35 + m_peak + e_peak) * pos_weight * ac_weight
        occupancy = max(0.18, min(0.98, occupancy))

        category = self.extractor.occupancy_to_category(occupancy)
        confidence = 0.91 if (6 <= hour <= 22) else 0.76

        return {
            "predicted_occupancy_ratio": round(occupancy, 3),
            "predicted_percentage": round(occupancy * 100, 1),
            "crowd_level": category,
            "confidence_score": confidence,
            "is_peak_hour": bool(feats["is_morning_rush"] or feats["is_evening_rush"]),
            "is_demo_prediction": True
        }

if __name__ == "__main__":
    predictor = SmartBusPredictor()
    res = predictor.predict_crowd(hour=18, day_of_week=2, is_ac_bus=False)
    print("Inference Result (18:00 Weekday Standard Bus):", res)
