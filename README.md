# SmartBus 2.0 – AI-Powered Public Transport Platform

**SmartBus 2.0** is a modern, responsive, full-stack public transportation platform engineered for passengers and transport operators in **Chennai, India** (Chennai MTC transport network).

The platform leverages predictive machine learning heuristics and commuter crowd reporting to provide real-time crowd level visibility, recommend less crowded journey alternatives, and empower transit authorities to dynamically optimize fleet capacity.

---

## 🌟 Key Features

### 🚌 Passenger Application
1. **Home Dashboard**:
   - Origin and destination trip search with Chennai landmark suggestions (CMBT, Guindy, Siruseri IT Park, T. Nagar, Central, Velachery).
   - Live AI transit demand pulse across major Chennai corridors (OMR IT Expressway, Anna Salai Spine, Coastal Adyar).
   - "Less-Crowded Travel Recommendations" carousel.
   - Quick 1-click re-search from recent journeys.
   - 15-second community crowd reporting trigger.
2. **Bus Route Search**:
   - Filter and rank by: *Lowest Predicted Crowd*, *Shortest Journey*, *Direct / Min Transfers*, and *Earliest Arrival*.
   - Interactive side-by-side **Route Comparison Modal** (duration, crowd, frequency, transfers, fare).
   - Route bookmarking / save to favorites.
3. **Route Details & Stop Timeline**:
   - Stop-by-stop sequence with distance, scheduled arrival offset, predicted stop-level crowd, and estimated passenger load.
   - 24-hour predictive demand curve chart (Recharts) identifying peak morning (08:30–10:00) and evening (17:30–19:30) choke points.
   - Live passenger-submitted reports audit trail.
4. **AI Crowd Intelligence Forecaster**:
   - Route and stop selector with interactive time-of-day slider (05:00 to 23:00) and day-of-week profile (Weekday vs Weekend).
   - Color-coded crowd tiers: **LOW (Green)**, **MODERATE (Yellow)**, **HIGH (Orange)**, **VERY HIGH (Red)**.
   - Expected passenger counts, bus capacity, model reliability confidence score, and contributing factors breakdown.
   - Transparent data source disclosure (Model Prediction vs Passenger Report vs Sample Data).
5. **Alternative Bus Recommendations Engine**:
   - Recommends comfort-optimized journeys with explicit rationale (e.g. *"Guaranteed seat availability and 45% less crowded than regular 570 during OMR office commute"*).
6. **Community Crowd Reporting**:
   - Form with anti-spam / anti-duplicate rate limiting (1 report per 3 minutes).
   - Celebratory micro-animations (`canvas-confetti`).
   - Upvoting and community verification indicators.
7. **User Profile & Commuter Settings**:
   - Saved routes management.
   - Notification preferences (Overcrowding alerts, departure reminders, eco recommendations).
   - Commuter feedback form logging to Firestore feedback collection.

### 🛡️ Operator Dashboard
1. **Overview**:
   - Network KPIs: 48 routes monitored, 642 active fleet buses, 68.4% average occupancy, 4 critical alerts.
   - Active choke points watchlist (Guindy Kathipara, Anna Salai, 100-ft Road).
   - Live commuter report feed with 1-click dispatch verification.
2. **Route Analytics**:
   - Route-wise daily passenger volume bar chart.
   - Network-wide hourly commuter flow curve.
   - Route risk assessment table.
3. **AI Fleet Insights**:
   - Actionable fleet adjustments (e.g. *"Inject 3 Short-Loop Shuttles on Guindy-Sholinganallur Corridor"*).
   - 1-click "Approve & Dispatch" action simulation.
4. **Reports & Functional CSV Data Export**:
   - Download Daily Route Demand Summary (`smartbus_daily_demand_report.csv`).
   - Download Hourly Peak Congestion Analysis (`smartbus_hourly_demand_curve.csv`).
   - Download Commuter Crowd Reports Log (`smartbus_commuter_crowd_reports.csv`).
5. **Operator Settings**:
   - Crowd threshold sliders, alert toggles, and backend health monitor.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide icons, Recharts, Canvas-Confetti, Vite.
- **Backend**: Python 3.14, FastAPI, Uvicorn, Pydantic.
- **AI / ML Pipeline**: Transit feature engineering, Gaussian mixture rush-hour demand curves, synthetic GTFS calibration.
- **Database Architecture**: Firebase Firestore collection schemas (`users`, `crowdReports`, `crowdPredictions`, `feedback`, `notifications`) with dual real-or-local fallback client.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ or v24+)
- **Python** (3.10+ or 3.14+)

### 2. Running the Frontend
```bash
# Navigate to the frontend directory
cd frontend

# Run the development server
npm run dev

# Open http://localhost:5173 in your browser
```

Or from the root directory:
```bash
npm run dev
```

### 3. Running the Python FastAPI Backend (Optional)
```bash
# From root directory:
python -m uvicorn backend.main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

*Note: SmartBus 2.0 features an automatic backend health detector. If the FastAPI backend is running, it connects seamlessly; if offline, it operates on the high-fidelity local calibrated Chennai transit dataset with full interactive persistence!*

### 4. Running Backend Unit Tests & AI Model Evaluation
```bash
# Test all 8 REST API endpoints:
python backend/test_suite.py

# Run AI model demand evaluation:
python AI-Model/evaluate_model.py
```

---

## 📂 Project Structure

```
SynchroBus/
├── frontend/                     # React + TypeScript + Tailwind CSS Web App
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, Logo, CrowdBadge, ReliabilityBadge
│   │   │   ├── passenger/        # Home, RouteSearch, RouteDetails, CrowdPredictionView,
│   │   │   │                     # RecommendationsView, UserProfileView, CrowdReportModal
│   │   │   └── operator/         # OperatorDashboard (Overview, Analytics, AI Insights, Reports)
│   │   ├── services/
│   │   │   ├── api.ts            # FastAPI client & local calibrated transit fallback
│   │   │   └── firebase.ts       # Firestore collections structure & session state
│   │   ├── types/                # TypeScript interfaces & types
│   │   ├── App.tsx               # Root component & role/navigation orchestration
│   │   └── main.tsx
│   ├── public/manifest.json      # PWA App Manifest
│   └── package.json
├── backend/                      # Python FastAPI REST Microservice
│   ├── api/                      # Routes: health, routes, stops, predictions, recommendations, crowd, analytics
│   ├── schemas/                  # Pydantic transport & prediction schemas
│   ├── services/                 # RouteService, PredictionService, CrowdService, RecommendationService
│   ├── main.py                   # FastAPI server entrypoint
│   ├── config.py                 # Configuration settings & CORS
│   └── test_suite.py             # Full API endpoint test suite
├── AI-Model/                     # AI Machine Learning Demand Model
│   ├── data_preprocessing.py     # Feature engineering from GTFS and commuter tap data
│   ├── train_model.py            # Model training & synthetic data generation
│   ├── predict.py                # Standalone inference service
│   └── evaluate_model.py         # Performance evaluation (accuracy, MAE)
├── docs/                         # Technical Documentation
│   ├── architecture.md           # System architecture & data flow
│   ├── api-documentation.md      # REST API specification
│   ├── database-schema.md        # Firebase Firestore collections design
│   └── research-notes.md         # Mathematical formulation & rush-hour Gaussian modeling
└── package.json                  # Root runner scripts
```

---

## 📜 Academic Project & Research Note
SmartBus 2.0 was designed as a university major project and hackathon demonstration platform, showcasing how AI-powered crowd forecasting and capacity rebalancing can transform urban public transit.
