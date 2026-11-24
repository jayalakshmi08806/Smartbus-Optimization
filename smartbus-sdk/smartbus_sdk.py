"""
SmartBus 2.0 Official Python SDK
Client library for IoT bus hardware, transport dispatchers, and external AI agents.
"""

import urllib.request
import urllib.parse
import json
from typing import Dict, Any, Optional, List

class SmartBusSDK:
    def __init__(self, base_url: str = "http://localhost:8000", api_key: Optional[str] = None):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key

    def _request(self, endpoint: str, method: str = "GET", data: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        body = json.dumps(data).encode("utf-8") if data is not None else None
        req = urllib.request.Request(url, data=body, headers=headers, method=method)

        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return json.loads(res_body)

    def get_health(self) -> Dict[str, Any]:
        return self._request("/api/health")

    def get_routes(self, origin: Optional[str] = None, destination: Optional[str] = None) -> List[Dict[str, Any]]:
        params = {}
        if origin:
            params["origin"] = origin
        if destination:
            params["destination"] = destination
        qs = f"?{urllib.parse.urlencode(params)}" if params else ""
        return self._request(f"/api/routes{qs}")

    def get_crowd_prediction(
        self,
        route_id: str = "mtc_570",
        stop_id: Optional[str] = None,
        hour: Optional[int] = None,
        day_of_week: Optional[int] = None
    ) -> Dict[str, Any]:
        params = {"route_id": route_id}
        if stop_id:
            params["stop_id"] = stop_id
        if hour is not None:
            params["hour"] = hour
        if day_of_week is not None:
            params["day_of_week"] = day_of_week
        qs = f"?{urllib.parse.urlencode(params)}"
        return self._request(f"/api/crowd-predictions{qs}")

    def submit_crowd_report(
        self,
        route_number: str,
        stop_name: str,
        crowd_level: str,
        passenger_load_estimate: Optional[int] = None,
        comments: Optional[str] = None
    ) -> Dict[str, Any]:
        payload = {
            "route_number": route_number,
            "stop_name": stop_name,
            "crowd_level": crowd_level,
            "passenger_load_estimate": passenger_load_estimate,
            "comments": comments
        }
        return self._request("/api/crowd-reports", method="POST", data=payload)

    def get_operator_analytics(self) -> Dict[str, Any]:
        return self._request("/api/operator/analytics")
