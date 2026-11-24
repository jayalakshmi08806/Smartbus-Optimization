# SmartBus 2.0 System Architecture

SmartBus 2.0 is an AI-powered public transportation platform designed for urban bus networks, with an initial target deployment on the **Chennai Metropolitan Transport Corporation (MTC)** network in Chennai, India.

---

## 1. High-Level Architecture Overview

```
 ┌─────────────────────────────────────────────────────────────┐
 │                        CLIENT LAYER                         │
 │                                                             │
 │   React 18 + TypeScript + Tailwind CSS (Mobile-First / PWA) │
 │                                                             │
 │   ┌───────────────────────────┐ ┌─────────────────────────┐ │
 │   │    PASSENGER INTERFACE    │ │   OPERATOR DASHBOARD    │ │
 │   │  - Route Search           │ │  - Overview Metrics     │ │
 │   │  - Stop Sequence Timeline │ │  - Route Analytics      │ │
 │   │  - AI Crowd Forecaster    │ │  - AI Insights Dispatch │ │
 │   │  - Less-Crowded Recs      │ │  - CSV Reports Export   │ │
 │   │  - Commuter Crowd Reports │ │  - Threshold Controls   │ │
 │   └───────────────────────────┘ └─────────────────────────┘ │
 └──────────────────────────────┬──────────────────────────────┘
                                │ RESTful API & Fallback Layer
 ┌──────────────────────────────▼──────────────────────────────┐
 │                    API & SERVICES LAYER                     │
 │                                                             │
 │   FastAPI Python 3.14 Microservice (backend/main.py)        │
 │   - Health & Metadata (/api/health)                         │
 │   - Routes & Stops (/api/routes, /api/stops)                │
 │   - AI Crowd Inference (/api/crowd-predictions)             │
 │   - Journey Recommender (/api/recommendations)              │
 │   - Community Reports (/api/crowd-reports)                  │
 │   - Fleet Analytics (/api/operator/analytics)               │
 └──────────────┬──────────────────────────────┬───────────────┘
                │                              │
 ┌──────────────▼──────────────┐ ┌─────────────▼───────────────┐
 │       AI & ML PIPELINE      │ │       DATA PERSISTENCE      │
 │                             │ │                             │
 │   AI-Model/                 │ │   Firebase Firestore Models │
 │   - data_preprocessing.py   │ │   - users                   │
 │   - train_model.py          │ │   - crowdReports            │
 │   - predict.py              │ │   - crowdPredictions        │
 │   - evaluate_model.py       │ │   - feedback                │
 │   - Heuristic Regression    │ │   - notifications           │
 └─────────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Core Subsystems

### A. Client Application (Frontend)
- **Framework**: React 18, TypeScript, Tailwind CSS, Lucide icons, Recharts for analytics.
- **PWA Capabilities**: App manifest (`manifest.json`), responsive layout with bottom navigation on mobile devices and responsive sidebars/header on tablets and desktops.
- **Resilience**: Features automatic backend connectivity detection. When the FastAPI backend is running, it streams real-time endpoints; when disconnected, it uses calibrated local transit models with zero degradation of functionality.

### B. Backend Microservice (FastAPI)
- **FastAPI / Uvicorn**: High-throughput asynchronous REST server.
- **Schemas**: Strict Pydantic models for transit routes, stops, predictions, and reports.
- **Anti-Spam Rate Limiting**: Enforces deduplication of community crowd reports based on route, stop, and time windows.

### C. AI Crowd Intelligence Pipeline
- Models passenger occupancy based on:
  - Time-of-day Gaussian rush-hour distribution (Chennai morning 08:00-10:30, evening 17:00-20:00).
  - Day-of-week profiles (Weekday office commute vs Weekend leisure/beach).
  - Stop sequence positioning along high-density bottlenecks (Guindy Kathipara, Madhya Kailash, OMR TIDEL Park).
  - Bus fleet characteristics (AC Deluxe vs Ordinary Standard).
  - Community-submitted crowd observations.
