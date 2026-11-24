from fastapi import APIRouter, HTTPException, status
from typing import List
from backend.schemas.transport import CrowdReportCreate, CrowdReportResponse
from backend.services.crowd_service import CrowdService

router = APIRouter(prefix="/api", tags=["Crowd Reports"])

@router.get("/crowd-reports", response_model=List[CrowdReportResponse])
def get_crowd_reports():
    return CrowdService.get_all_reports()

@router.post("/crowd-reports", response_model=CrowdReportResponse, status_code=status.HTTP_201_CREATED)
def submit_crowd_report(report: CrowdReportCreate):
    try:
        return CrowdService.submit_report(report)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
