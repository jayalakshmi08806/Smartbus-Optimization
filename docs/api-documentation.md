# SmartBus 2.0 REST API Documentation

Base URL: `http://localhost:8000` (Configurable via `VITE_API_BASE_URL`)

---

## 1. System Health
### `GET /api/health`
Returns system status, active route count, and AI model mode.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "app_name": "SmartBus 2.0 API",
  "version": "2.0.0",
  "timestamp": "2026-10-31T12:00:00",
  "network_region": "Chennai Metropolitan Transport Corporation (MTC)",
  "active_routes_count": 8,
  "total_stops_monitored": 30,
  "ai_model_mode": "Heuristic ML Hybrid Calibrated Predictor"
}
```

---

## 2. Bus Routes
### `GET /api/routes`
List all bus routes with optional origin and destination filters.

**Query Parameters:**
- `origin` *(optional)*: Starting stop or locality.
- `destination` *(optional)*: Destination stop or locality.

### `GET /api/routes/{route_id}`
Returns complete stop sequence, timings, distances, and current crowd status for a specific route.

---

## 3. Bus Stops
### `GET /api/stops`
Returns all indexed bus stops with geographical coordinates, zone, and locality.

---

## 4. AI Crowd Predictions
### `GET /api/crowd-predictions`
Predicts crowd levels for a specified route and stop.

**Query Parameters:**
- `route_id`: Route ID (e.g., `mtc_570`)
- `stop_id` *(optional)*: Specific stop ID (e.g., `stop_guindy`)
- `hour` *(optional, 0-23)*: Hour of day
- `day_of_week` *(optional, 0-6)*: 0=Monday, 6=Sunday

**Response (200 OK):**
```json
{
  "route_id": "mtc_570",
  "route_number": "570",
  "stop_name": "Guindy Kathipara",
  "predicted_crowd": "VERY HIGH",
  "expected_passenger_count": 64,
  "bus_capacity": 65,
  "occupancy_percentage": 98.0,
  "reliability_score": 0.92,
  "is_sample_data": true,
  "hourly_trend": [ ... ]
}
```

---

## 5. Alternative Recommendations
### `GET /api/recommendations`
Returns alternative bus journeys ranked by passenger preferences.

**Query Parameters:**
- `origin`: Trip origin stop
- `destination`: Trip destination stop
- `preference`: `lowest_crowd` | `shortest_time` | `min_transfers` | `earliest_arrival`

---

## 6. Crowd Reports
### `GET /api/crowd-reports`
Returns recent commuter observations.

### `POST /api/crowd-reports`
Submits a passenger crowd report.

**Request Body:**
```json
{
  "route_number": "570",
  "stop_name": "Guindy Kathipara",
  "crowd_level": "VERY HIGH",
  "passenger_load_estimate": 70,
  "comments": "Bus doors packed with standing commuters"
}
```

---

## 7. Operator Analytics
### `GET /api/operator/analytics`
Returns network-wide metrics, route demand rankings, peak hours, and AI dispatch recommendations.
