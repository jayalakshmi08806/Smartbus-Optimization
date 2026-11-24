from typing import List, Optional, Dict
from datetime import datetime
from backend.schemas.transport import BusRoute, BusStop, StopTiming, CrowdCategory

# Comprehensive authentic Chennai transit stops
CHENNAI_STOPS: List[Dict] = [
    {"id": "stop_cmbt", "name": "Koyambedu (CMBT)", "code": "CMBT", "lat": 13.0694, "lon": 80.2052, "locality": "Koyambedu", "zone": "West"},
    {"id": "stop_vadapalani", "name": "Vadapalani B.S", "code": "VDP", "lat": 13.0500, "lon": 80.2120, "locality": "Vadapalani", "zone": "West"},
    {"id": "stop_ashok_pillar", "name": "Ashok Pillar", "code": "APK", "lat": 13.0336, "lon": 80.2117, "locality": "Ashok Nagar", "zone": "Central"},
    {"id": "stop_guindy", "name": "Guindy Kathipara", "code": "GDY", "lat": 13.0067, "lon": 80.2025, "locality": "Guindy", "zone": "South"},
    {"id": "stop_velachery", "name": "Velachery Checkpost", "code": "VLC", "lat": 12.9800, "lon": 80.2228, "locality": "Velachery", "zone": "South"},
    {"id": "stop_perungudi", "name": "Perungudi OMR", "code": "PGD", "lat": 12.9647, "lon": 80.2447, "locality": "Perungudi", "zone": "South OMR"},
    {"id": "stop_thoraipakkam", "name": "Thoraipakkam Toll", "code": "TPK", "lat": 12.9431, "lon": 80.2374, "locality": "Thoraipakkam", "zone": "South OMR"},
    {"id": "stop_sholinganallur", "name": "Sholinganallur Junction", "code": "SLN", "lat": 12.9010, "lon": 80.2279, "locality": "Sholinganallur", "zone": "South OMR"},
    {"id": "stop_navalur", "name": "Navallur AGS", "code": "NVL", "lat": 12.8465, "lon": 80.2263, "locality": "Navalur", "zone": "OMR Outer"},
    {"id": "stop_siruseri", "name": "SIPCOT Siruseri IT Park", "code": "SRS", "lat": 12.8236, "lon": 80.2185, "locality": "Siruseri", "zone": "OMR Outer"},

    {"id": "stop_broadway", "name": "Broadway Bus Terminus", "code": "BDW", "lat": 13.0878, "lon": 80.2885, "locality": "Parrys", "zone": "North"},
    {"id": "stop_central", "name": "Chennai Central Railway Station", "code": "MAS", "lat": 13.0827, "lon": 80.2707, "locality": "Park Town", "zone": "Central"},
    {"id": "stop_dms", "name": "DMS / Anna Salai", "code": "DMS", "lat": 13.0448, "lon": 80.2482, "locality": "Teynampet", "zone": "Central"},
    {"id": "stop_nandanam", "name": "Nandanam Signal", "code": "NDM", "lat": 13.0305, "lon": 80.2394, "locality": "Nandanam", "zone": "Central"},
    {"id": "stop_saidapet", "name": "Saidapet Court", "code": "SDP", "lat": 13.0205, "lon": 80.2248, "locality": "Saidapet", "zone": "South"},
    {"id": "stop_airport", "name": "Chennai Airport (Tirusulam)", "code": "MAA", "lat": 12.9818, "lon": 80.1638, "locality": "Meenambakkam", "zone": "South-West"},
    {"id": "stop_pallavaram", "name": "Pallavaram Sandhai", "code": "PVM", "lat": 12.9675, "lon": 80.1491, "locality": "Pallavaram", "zone": "Suburban South"},
    {"id": "stop_chromepet", "name": "Chromepet MIT Gate", "code": "CMP", "lat": 12.9516, "lon": 80.1408, "locality": "Chromepet", "zone": "Suburban South"},
    {"id": "stop_tambaram", "name": "Tambaram Sanatorium / Terminus", "code": "TBM", "lat": 12.9249, "lon": 80.1278, "locality": "Tambaram", "zone": "Suburban South"},

    {"id": "stop_tidel", "name": "TIDEL Park", "code": "TDL", "lat": 12.9892, "lon": 80.2492, "locality": "Taramani", "zone": "South"},
    {"id": "stop_madhya_kailash", "name": "Madhya Kailash", "code": "MKL", "lat": 13.0071, "lon": 80.2471, "locality": "Adyar", "zone": "South"},
    {"id": "stop_adyar", "name": "Adyar Depot", "code": "ADY", "lat": 13.0064, "lon": 80.2575, "locality": "Adyar", "zone": "South"},
    {"id": "stop_thiruvanmiyur", "name": "Thiruvanmiyur Bus Stand", "code": "TVM", "lat": 12.9830, "lon": 80.2594, "locality": "Thiruvanmiyur", "zone": "South Coastal"},
    {"id": "stop_besant_nagar", "name": "Besant Nagar Beach Terminus", "code": "BSN", "lat": 12.9998, "lon": 80.2694, "locality": "Besant Nagar", "zone": "South Coastal"},
    {"id": "stop_mylapore", "name": "Mylapore Luz Corner", "code": "LUZ", "lat": 13.0382, "lon": 80.2638, "locality": "Mylapore", "zone": "Central"},
    {"id": "stop_gemini", "name": "Gemini / Anna Flyover", "code": "GMN", "lat": 13.0519, "lon": 80.2508, "locality": "Nungambakkam", "zone": "Central"},
    {"id": "stop_tnagar", "name": "T. Nagar Bus Terminus", "code": "TNG", "lat": 13.0405, "lon": 80.2337, "locality": "T. Nagar", "zone": "Central Commercial"},
    {"id": "stop_marina", "name": "Marina Beach / Anna Square", "code": "MRN", "lat": 13.0645, "lon": 80.2828, "locality": "Triplicane", "zone": "East Coastal"},
    {"id": "stop_perambur", "name": "Perambur B.S", "code": "PRB", "lat": 13.1098, "lon": 80.2343, "locality": "Perambur", "zone": "North"},
    {"id": "stop_egmore", "name": "Egmore Railway Station", "code": "EGM", "lat": 13.0784, "lon": 80.2606, "locality": "Egmore", "zone": "Central"},
]

STOPS_BY_ID = {s["id"]: s for s in CHENNAI_STOPS}

RAW_ROUTES = [
    {
        "id": "mtc_570",
        "route_number": "570",
        "name": "CMBT (Koyambedu) to SIPCOT Siruseri",
        "origin": "Koyambedu (CMBT)",
        "destination": "SIPCOT Siruseri IT Park",
        "distance_km": 34.5,
        "estimated_duration_min": 75,
        "frequency_min": 10,
        "first_bus": "05:15",
        "last_bus": "22:45",
        "bus_type": "Deluxe Express",
        "current_crowd_level": "HIGH",
        "crowd_trend": "Rising due to evening tech shift change",
        "transfers": 0,
        "stops_data": [
            ("stop_cmbt", "00", 0.0, "MODERATE", 38),
            ("stop_vadapalani", "10", 3.8, "HIGH", 56),
            ("stop_ashok_pillar", "18", 6.2, "HIGH", 64),
            ("stop_guindy", "28", 10.5, "VERY HIGH", 72),
            ("stop_velachery", "42", 17.2, "VERY HIGH", 76),
            ("stop_perungudi", "52", 22.1, "HIGH", 68),
            ("stop_thoraipakkam", "60", 25.8, "MODERATE", 54),
            ("stop_sholinganallur", "68", 29.7, "MODERATE", 45),
            ("stop_navalur", "74", 32.5, "LOW", 28),
            ("stop_siruseri", "80", 34.5, "LOW", 16)
        ]
    },
    {
        "id": "mtc_570_ac",
        "route_number": "570 AC",
        "name": "CMBT (Koyambedu) to SIPCOT Siruseri (Volvo AC)",
        "origin": "Koyambedu (CMBT)",
        "destination": "SIPCOT Siruseri IT Park",
        "distance_km": 34.5,
        "estimated_duration_min": 68,
        "frequency_min": 25,
        "first_bus": "06:30",
        "last_bus": "21:30",
        "bus_type": "Electric AC Deluxe",
        "current_crowd_level": "LOW",
        "crowd_trend": "Steady, guaranteed seat availability",
        "transfers": 0,
        "stops_data": [
            ("stop_cmbt", "00", 0.0, "LOW", 18),
            ("stop_vadapalani", "08", 3.8, "MODERATE", 28),
            ("stop_ashok_pillar", "15", 6.2, "MODERATE", 32),
            ("stop_guindy", "24", 10.5, "MODERATE", 39),
            ("stop_velachery", "36", 17.2, "MODERATE", 41),
            ("stop_perungudi", "45", 22.1, "MODERATE", 36),
            ("stop_thoraipakkam", "52", 25.8, "LOW", 29),
            ("stop_sholinganallur", "59", 29.7, "LOW", 22),
            ("stop_navalur", "64", 32.5, "LOW", 15),
            ("stop_siruseri", "68", 34.5, "LOW", 8)
        ]
    },
    {
        "id": "mtc_21g",
        "route_number": "21G",
        "name": "Broadway to Tambaram Sanatorium",
        "origin": "Broadway Bus Terminus",
        "destination": "Tambaram Sanatorium / Terminus",
        "distance_km": 29.2,
        "estimated_duration_min": 70,
        "frequency_min": 8,
        "first_bus": "04:45",
        "last_bus": "23:15",
        "bus_type": "Ordinary Standard",
        "current_crowd_level": "VERY HIGH",
        "crowd_trend": "Severe peak across Guindy & Airport spine",
        "transfers": 0,
        "stops_data": [
            ("stop_broadway", "00", 0.0, "MODERATE", 42),
            ("stop_central", "08", 2.1, "HIGH", 66),
            ("stop_dms", "22", 6.8, "HIGH", 69),
            ("stop_nandanam", "30", 9.4, "HIGH", 71),
            ("stop_saidapet", "38", 12.0, "VERY HIGH", 78),
            ("stop_guindy", "46", 14.5, "VERY HIGH", 82),
            ("stop_airport", "56", 18.9, "HIGH", 65),
            ("stop_pallavaram", "63", 21.6, "HIGH", 58),
            ("stop_chromepet", "70", 24.8, "MODERATE", 47),
            ("stop_tambaram", "78", 29.2, "LOW", 25)
        ]
    },
    {
        "id": "mtc_19b",
        "route_number": "19B",
        "name": "Saidapet to Kelambakkam / Siruseri",
        "origin": "Saidapet Court",
        "destination": "SIPCOT Siruseri IT Park",
        "distance_km": 25.4,
        "estimated_duration_min": 55,
        "frequency_min": 12,
        "first_bus": "05:30",
        "last_bus": "22:15",
        "bus_type": "Deluxe",
        "current_crowd_level": "MODERATE",
        "crowd_trend": "Comfortable travel option via Madhya Kailash",
        "transfers": 0,
        "stops_data": [
            ("stop_saidapet", "00", 0.0, "LOW", 25),
            ("stop_madhya_kailash", "10", 3.2, "MODERATE", 44),
            ("stop_tidel", "18", 5.9, "HIGH", 62),
            ("stop_perungudi", "26", 9.4, "HIGH", 59),
            ("stop_thoraipakkam", "35", 13.2, "MODERATE", 51),
            ("stop_sholinganallur", "44", 17.8, "MODERATE", 42),
            ("stop_navalur", "50", 22.0, "LOW", 26),
            ("stop_siruseri", "55", 25.4, "LOW", 14)
        ]
    },
    {
        "id": "mtc_29c",
        "route_number": "29C",
        "name": "Perambur to Besant Nagar",
        "origin": "Perambur B.S",
        "destination": "Besant Nagar Beach Terminus",
        "distance_km": 19.8,
        "estimated_duration_min": 52,
        "frequency_min": 12,
        "first_bus": "05:00",
        "last_bus": "22:30",
        "bus_type": "Ordinary Standard",
        "current_crowd_level": "MODERATE",
        "crowd_trend": "Evenly distributed passenger boarding",
        "transfers": 0,
        "stops_data": [
            ("stop_perambur", "00", 0.0, "LOW", 24),
            ("stop_egmore", "16", 5.2, "MODERATE", 46),
            ("stop_gemini", "26", 8.8, "HIGH", 58),
            ("stop_mylapore", "36", 12.3, "MODERATE", 51),
            ("stop_adyar", "45", 16.5, "MODERATE", 39),
            ("stop_besant_nagar", "52", 19.8, "LOW", 18)
        ]
    },
    {
        "id": "mtc_27b",
        "route_number": "27B",
        "name": "CMBT to Marina Beach / Anna Square",
        "origin": "Koyambedu (CMBT)",
        "destination": "Marina Beach / Anna Square",
        "distance_km": 14.8,
        "estimated_duration_min": 45,
        "frequency_min": 15,
        "first_bus": "05:30",
        "last_bus": "22:00",
        "bus_type": "Express Deluxe",
        "current_crowd_level": "LOW",
        "crowd_trend": "Off-peak beach connector, plenty of seating",
        "transfers": 0,
        "stops_data": [
            ("stop_cmbt", "00", 0.0, "LOW", 19),
            ("stop_egmore", "22", 7.5, "MODERATE", 38),
            ("stop_central", "32", 10.8, "MODERATE", 44),
            ("stop_marina", "45", 14.8, "LOW", 28)
        ]
    },
    {
        "id": "mtc_47a",
        "route_number": "47A",
        "name": "Villivakkam to Thiruvanmiyur",
        "origin": "Koyambedu (CMBT)",
        "destination": "Thiruvanmiyur Bus Stand",
        "distance_km": 21.0,
        "estimated_duration_min": 58,
        "frequency_min": 14,
        "first_bus": "05:45",
        "last_bus": "22:15",
        "bus_type": "Ordinary Standard",
        "current_crowd_level": "HIGH",
        "crowd_trend": "Busy through T. Nagar & Guindy transit hubs",
        "transfers": 0,
        "stops_data": [
            ("stop_cmbt", "00", 0.0, "MODERATE", 35),
            ("stop_vadapalani", "12", 3.8, "HIGH", 54),
            ("stop_tnagar", "25", 8.2, "VERY HIGH", 74),
            ("stop_saidapet", "34", 11.1, "HIGH", 66),
            ("stop_guindy", "41", 13.6, "HIGH", 60),
            ("stop_velachery", "50", 17.5, "MODERATE", 45),
            ("stop_thiruvanmiyur", "58", 21.0, "LOW", 22)
        ]
    },
    {
        "id": "mtc_d70",
        "route_number": "D70",
        "name": "Ambattur to Velachery Express",
        "origin": "Koyambedu (CMBT)",
        "destination": "Velachery Checkpost",
        "distance_km": 16.5,
        "estimated_duration_min": 42,
        "frequency_min": 12,
        "first_bus": "05:15",
        "last_bus": "22:45",
        "bus_type": "Express",
        "current_crowd_level": "HIGH",
        "crowd_trend": "High demand along Inner Ring Road",
        "transfers": 0,
        "stops_data": [
            ("stop_cmbt", "00", 0.0, "MODERATE", 40),
            ("stop_vadapalani", "10", 3.8, "HIGH", 61),
            ("stop_ashok_pillar", "18", 6.2, "HIGH", 68),
            ("stop_guindy", "28", 10.5, "VERY HIGH", 75),
            ("stop_velachery", "42", 16.5, "MODERATE", 38)
        ]
    }
]

class RouteService:
    @staticmethod
    def get_all_routes() -> List[BusRoute]:
        result = []
        for r in RAW_ROUTES:
            stops = []
            for seq, (stop_id, min_offset, dist, crowd, pass_load) in enumerate(r["stops_data"]):
                st_info = STOPS_BY_ID.get(stop_id, {"name": stop_id})
                stops.append(StopTiming(
                    stop_id=stop_id,
                    stop_name=st_info.get("name", stop_id),
                    sequence=seq + 1,
                    scheduled_arrival=f"+{min_offset}m",
                    scheduled_departure=f"+{int(min_offset)+1}m",
                    distance_km=dist,
                    predicted_crowd=crowd,
                    expected_passenger_load=pass_load
                ))
            result.append(BusRoute(
                id=r["id"],
                route_number=r["route_number"],
                name=r["name"],
                origin=r["origin"],
                destination=r["destination"],
                distance_km=r["distance_km"],
                estimated_duration_min=r["estimated_duration_min"],
                frequency_min=r["frequency_min"],
                first_bus=r["first_bus"],
                last_bus=r["last_bus"],
                bus_type=r["bus_type"],
                stops=stops,
                current_crowd_level=r["current_crowd_level"],
                crowd_trend=r["crowd_trend"],
                transfers=r["transfers"]
            ))
        return result

    @staticmethod
    def get_route_by_id(route_id: str) -> Optional[BusRoute]:
        routes = RouteService.get_all_routes()
        for r in routes:
            if r.id.lower() == route_id.lower() or r.route_number.lower() == route_id.lower():
                return r
        return None

    @staticmethod
    def get_all_stops() -> List[BusStop]:
        return [
            BusStop(
                id=s["id"],
                name=s["name"],
                code=s["code"],
                latitude=s["lat"],
                longitude=s["lon"],
                locality=s["locality"],
                zone=s["zone"]
            )
            for s in CHENNAI_STOPS
        ]

    @staticmethod
    def search_routes(origin: str, destination: str) -> List[BusRoute]:
        all_routes = RouteService.get_all_routes()
        if not origin and not destination:
            return all_routes

        origin_clean = origin.strip().lower()
        dest_clean = destination.strip().lower()

        matched = []
        for r in all_routes:
            stop_names = [s.stop_name.lower() for s in r.stops] + [r.origin.lower(), r.destination.lower()]
            
            origin_match = any(origin_clean in s for s in stop_names) if origin_clean else True
            dest_match = any(dest_clean in s for s in stop_names) if dest_clean else True

            if origin_match and dest_match:
                # check directional order if both present
                if origin_clean and dest_clean:
                    orig_idx = next((i for i, s in enumerate(stop_names) if origin_clean in s), -1)
                    dest_idx = next((i for i, s in enumerate(stop_names) if dest_clean in s), -1)
                    if orig_idx != -1 and dest_idx != -1 and orig_idx < dest_idx:
                        matched.append(r)
                    elif orig_idx != -1 and dest_idx != -1:
                        # Allow anyway for demo matching if direct order isn't strict
                        matched.append(r)
                else:
                    matched.append(r)

        return matched if matched else all_routes[:4]
