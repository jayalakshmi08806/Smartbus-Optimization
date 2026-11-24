# SmartBus 2.0 Firestore Database Schema

The platform is designed around 5 primary Firebase Firestore collections:

---

## 1. `users` Collection
- **Path**: `/users/{uid}`
- **Fields**:
  - `uid` (string, Document ID)
  - `displayName` (string): Full name
  - `email` (string): User email address
  - `role` (string): `"passenger"` | `"operator"`
  - `commuterType` (string): `"Regular Commuter"` | `"Student Pass"` | `"Senior Citizen"` | `"Transport Official"`
  - `savedRoutes` (array of strings): IDs of favorite routes (e.g. `["mtc_570", "mtc_21g"]`)
  - `preferences` (map):
    - `crowdAlerts` (boolean)
    - `departureReminders` (boolean)
    - `ecoRecommendations` (boolean)
  - `createdAt` (timestamp)
  - `lastLogin` (timestamp)

---

## 2. `crowdReports` Collection
- **Path**: `/crowdReports/{reportId}`
- **Fields**:
  - `routeNumber` (string): Bus route number (e.g. `"570"`)
  - `stopName` (string): Name of observed stop (e.g. `"Guindy Kathipara"`)
  - `crowdLevel` (string): `"LOW"` | `"MODERATE"` | `"HIGH"` | `"VERY HIGH"`
  - `passengerEstimate` (number): Estimated onboard count
  - `comments` (string, optional): Commuter observation notes
  - `reporterId` (string): Commuter UID or `"anonymous"`
  - `reportedAt` (timestamp): Submission timestamp
  - `verifiedCount` (number): Community upvotes/validations
  - `status` (string): `"APPROVED"` | `"FLAGGED"`

---

## 3. `crowdPredictions` Collection
- **Path**: `/crowdPredictions/{routeId_stopId_hour}`
- **Fields**:
  - `routeId` (string)
  - `stopId` (string)
  - `hour` (number): 0 - 23
  - `dayOfWeek` (number): 0 - 6
  - `predictedCrowd` (string): `"LOW"` | `"MODERATE"` | `"HIGH"` | `"VERY HIGH"`
  - `expectedPassengers` (number)
  - `modelConfidence` (number): Float between 0.0 and 1.0
  - `generatedAt` (timestamp)

---

## 4. `feedback` Collection
- **Path**: `/feedback/{feedbackId}`
- **Fields**:
  - `userId` (string)
  - `rating` (number): 1 to 5 stars
  - `category` (string): `"crowd_accuracy"` | `"bus_timing"` | `"route_coverage"` | `"app_ui"`
  - `message` (string): User comments and suggestions
  - `submittedAt` (timestamp)

---

## 5. `notifications` Collection
- **Path**: `/notifications/{notificationId}`
- **Fields**:
  - `targetUserId` (string): User UID or `"all"`
  - `title` (string)
  - `body` (string)
  - `type` (string): `"crowd_surge"` | `"route_diversion"` | `"dispatch_update"`
  - `read` (boolean)
  - `timestamp` (timestamp)
