"""
SmartBus 2.0 Backend Test Suite
Verifies all 8 required REST API endpoints and data models.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.api import health, routes, stops, predictions, recommendations, crowd, analytics
from backend.schemas.transport import CrowdReportCreate

def run_tests():
    print("=========================================")
    print("Testing SmartBus 2.0 FastAPI Endpoints")
    print("=========================================")

    # 1. Health check
    h = health.health_check()
    assert h["status"] == "healthy", "Health check failed"
    print(f"[OK] GET /api/health passed: status={h['status']}, region={h['network_region']}, active_routes={h['active_routes_count']}")

    # 2. Routes listing
    r_list = routes.list_routes(origin=None, destination=None)
    assert len(r_list) > 0, "No routes returned"
    print(f"[OK] GET /api/routes passed: {len(r_list)} Chennai MTC routes returned")

    # 3. Route by ID
    r_single = routes.get_route("mtc_570")
    assert r_single.route_number == "570", "Failed to retrieve route 570"
    assert len(r_single.stops) > 0, "No stops in route 570"
    print(f"[OK] GET /api/routes/{{route_id}} passed: route {r_single.route_number} ({r_single.origin} to {r_single.destination}) with {len(r_single.stops)} stops")

    # 4. Stops
    s_list = stops.list_stops()
    assert len(s_list) > 0, "No stops returned"
    print(f"[OK] GET /api/stops passed: {len(s_list)} authenticated stops indexed")

    # 5. Crowd Predictions
    pred = predictions.get_crowd_prediction(route_id="mtc_570", stop_id="stop_guindy", hour=18, day_of_week=2)
    assert pred.predicted_crowd in ("LOW", "MODERATE", "HIGH", "VERY HIGH"), "Invalid crowd level"
    assert len(pred.hourly_trend) > 0, "No hourly trend curve"
    print(f"[OK] GET /api/crowd-predictions passed: {pred.route_number} at {pred.stop_name} (18:00): Level={pred.predicted_crowd}, Occupancy={pred.occupancy_percentage}%, Reliability={pred.reliability_score * 100}%")

    # 6. Recommendations
    recs = recommendations.get_recommendations(origin="Koyambedu (CMBT)", destination="SIPCOT Siruseri IT Park", preference="lowest_crowd")
    assert len(recs) > 0, "No recommendations returned"
    print(f"[OK] GET /api/recommendations passed: {len(recs)} alternatives ranked. Top: {recs[0].route_number} ({recs[0].predicted_crowd} crowd)")

    # 7. Submit Crowd Report
    new_report = crowd.submit_crowd_report(CrowdReportCreate(
        route_number="570",
        stop_name="Thoraipakkam Toll",
        crowd_level="HIGH",
        passenger_load_estimate=62,
        comments="Moderate rain causing delay; bus is packed"
    ))
    assert new_report.status == "APPROVED", "Report failed submission"
    print(f"[OK] POST /api/crowd-reports passed: id={new_report.id}, route={new_report.route_number}, validation={new_report.validation_status}")

    # 8. Operator Analytics
    op_data = analytics.get_operator_analytics()
    assert op_data.active_buses > 0, "No active buses"
    assert len(op_data.peak_hours) > 0, "No peak hours data"
    assert len(op_data.ai_recommendations) > 0, "No AI recommendations"
    print(f"[OK] GET /api/operator/analytics passed: {op_data.total_routes_monitored} monitored routes, {op_data.active_buses} fleet buses, {len(op_data.ai_recommendations)} AI dispatch actions")

    print("=========================================")
    print("ALL 8 API ENDPOINTS VALIDATED SUCCESSFULLY!")
    print("=========================================")

if __name__ == "__main__":
    run_tests()
