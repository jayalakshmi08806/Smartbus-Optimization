import uuid
from datetime import datetime, timedelta
from typing import List, Dict
from backend.schemas.transport import CrowdReportCreate, CrowdReportResponse

# In-memory storage for submitted reports
REPORTS_DATABASE: List[Dict] = [
    {
        "id": "rep_001",
        "route_number": "570",
        "stop_name": "Guindy Kathipara",
        "crowd_level": "VERY HIGH",
        "passenger_load_estimate": 78,
        "comments": "Long queue at the bus bay. Two buses passed full without stopping.",
        "submitted_at": (datetime.now() - timedelta(minutes=14)).strftime("%Y-%m-%d %H:%M"),
        "reporter_id": "commuter_882",
        "status": "APPROVED",
        "validation_status": "Verified by 3 nearby commuters"
    },
    {
        "id": "rep_002",
        "route_number": "570 AC",
        "stop_name": "Velachery Checkpost",
        "crowd_level": "LOW",
        "passenger_load_estimate": 22,
        "comments": "AC Electric bus has plenty of empty seats, AC working smoothly.",
        "submitted_at": (datetime.now() - timedelta(minutes=28)).strftime("%Y-%m-%d %H:%M"),
        "reporter_id": "commuter_104",
        "status": "APPROVED",
        "validation_status": "Reliable observation"
    },
    {
        "id": "rep_003",
        "route_number": "21G",
        "stop_name": "Saidapet Court",
        "crowd_level": "HIGH",
        "passenger_load_estimate": 68,
        "comments": "Crowded footboards near Saidapet. Takes 10 mins extra at signal.",
        "submitted_at": (datetime.now() - timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M"),
        "reporter_id": "commuter_491",
        "status": "APPROVED",
        "validation_status": "Consistent with historical peak"
    },
    {
        "id": "rep_004",
        "route_number": "29C",
        "stop_name": "Gemini / Anna Flyover",
        "crowd_level": "MODERATE",
        "passenger_load_estimate": 45,
        "comments": "Boarding was easy, moving comfortably towards Mylapore.",
        "submitted_at": (datetime.now() - timedelta(hours=1, minutes=10)).strftime("%Y-%m-%d %H:%M"),
        "reporter_id": "commuter_219",
        "status": "APPROVED",
        "validation_status": "Community verified"
    }
]

# Track recent submissions to prevent spamming
RECENT_SUBMISSION_HASHES: Dict[str, datetime] = {}

class CrowdService:
    @staticmethod
    def get_all_reports() -> List[CrowdReportResponse]:
        # Return sorted by submission time descending
        return [
            CrowdReportResponse(
                id=r["id"],
                route_number=r["route_number"],
                stop_name=r["stop_name"],
                crowd_level=r["crowd_level"],
                comments=r.get("comments"),
                submitted_at=r["submitted_at"],
                status=r.get("status", "RECEIVED"),
                validation_status=r.get("validation_status", "Community Pending")
            )
            for r in reversed(REPORTS_DATABASE)
        ]

    @staticmethod
    def submit_report(report_data: CrowdReportCreate) -> CrowdReportResponse:
        # Anti-spam check: prevent identical route + stop report from same IP/reporter within 3 minutes
        spam_key = f"{report_data.reporter_id}_{report_data.route_number}_{report_data.stop_name}".lower()
        now = datetime.now()
        
        if spam_key in RECENT_SUBMISSION_HASHES:
            last_time = RECENT_SUBMISSION_HASHES[spam_key]
            if now - last_time < timedelta(minutes=3):
                raise ValueError("Duplicate report detected. Please wait at least 3 minutes before reporting the same stop again.")

        RECENT_SUBMISSION_HASHES[spam_key] = now

        new_id = f"rep_{uuid.uuid4().hex[:6]}"
        record = {
            "id": new_id,
            "route_number": report_data.route_number.strip().upper(),
            "stop_name": report_data.stop_name.strip(),
            "crowd_level": report_data.crowd_level,
            "passenger_load_estimate": report_data.passenger_load_estimate or 50,
            "comments": report_data.comments.strip() if report_data.comments else None,
            "submitted_at": now.strftime("%Y-%m-%d %H:%M"),
            "reporter_id": report_data.reporter_id or "commuter_web",
            "status": "APPROVED",
            "validation_status": "Fresh Commuter Submission (Model Calibrated)"
        }
        REPORTS_DATABASE.append(record)

        return CrowdReportResponse(
            id=record["id"],
            route_number=record["route_number"],
            stop_name=record["stop_name"],
            crowd_level=record["crowd_level"],
            comments=record["comments"],
            submitted_at=record["submitted_at"],
            status=record["status"],
            validation_status=record["validation_status"]
        )
