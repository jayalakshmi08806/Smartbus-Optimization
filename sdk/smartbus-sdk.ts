/**
 * SmartBus 2.0 Official Client SDK (TypeScript / JavaScript)
 * Lightweight, zero-dependency client SDK for integrating Chennai MTC crowd intelligence,
 * real-time predictions, route searches, and passenger demand telemetry.
 *
 * Compatible with React Native, Expo, Node.js, and Web.
 */

export interface BusRoute {
  id: string;
  route_number: string;
  name: string;
  origin: string;
  destination: string;
  distance_km: number;
  estimated_duration_min: number;
  frequency_min: number;
  bus_type: string;
  current_crowd_level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';
}

export interface CrowdPrediction {
  route_id: string;
  route_number: string;
  stop_name: string;
  predicted_crowd: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';
  expected_passenger_count: number;
  bus_capacity: number;
  occupancy_percentage: number;
  reliability_score: number;
  prediction_time: string;
}

export interface CrowdReportInput {
  route_number: string;
  stop_name: string;
  crowd_level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';
  passenger_load_estimate?: number;
  comments?: string;
  reporter_id?: string;
}

export class SmartBusSDK {
  private baseUrl: string;
  private apiKey?: string;

  constructor(options: { baseUrl?: string; apiKey?: string } = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:8000';
    this.apiKey = options.apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`SmartBus SDK Error [${res.status}]: ${errBody || res.statusText}`);
    }
    return res.json();
  }

  /**
   * Check backend health and Chennai MTC service connectivity.
   */
  async getHealth() {
    return this.request<{
      status: string;
      version: string;
      network_region: string;
      active_routes_count: number;
    }>('/api/health');
  }

  /**
   * Search available bus routes by origin and destination.
   */
  async getRoutes(params?: { origin?: string; destination?: string }): Promise<BusRoute[]> {
    const query = new URLSearchParams();
    if (params?.origin) query.append('origin', params.origin);
    if (params?.destination) query.append('destination', params.destination);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<BusRoute[]>(`/api/routes${qs}`);
  }

  /**
   * Retrieve complete stop sequence and timings for a specific route.
   */
  async getRouteById(routeId: string): Promise<BusRoute> {
    return this.request<BusRoute>(`/api/routes/${encodeURIComponent(routeId)}`);
  }

  /**
   * Fetch AI crowd predictions for a route and stop at a specific hour.
   */
  async getCrowdPrediction(params: {
    routeId: string;
    stopId?: string;
    hour?: number;
    dayOfWeek?: number;
  }): Promise<CrowdPrediction> {
    const query = new URLSearchParams();
    query.append('route_id', params.routeId);
    if (params.stopId) query.append('stop_id', params.stopId);
    if (params.hour !== undefined) query.append('hour', params.hour.toString());
    if (params.dayOfWeek !== undefined) query.append('day_of_week', params.dayOfWeek.toString());
    return this.request<CrowdPrediction>(`/api/crowd-predictions?${query.toString()}`);
  }

  /**
   * Submit a commuter crowd report with anti-spam protection.
   */
  async submitCrowdReport(report: CrowdReportInput) {
    return this.request('/api/crowd-reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  /**
   * Fetch operator analytics and fleet demand telemetry.
   */
  async getOperatorAnalytics() {
    return this.request('/api/operator/analytics');
  }
}

// Export default singleton instance
export const smartbus = new SmartBusSDK();
