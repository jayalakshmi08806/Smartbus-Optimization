import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../src/constants/theme';
import { mobileApi, CHENNAI_ROUTES } from '../src/services/api';
import { CrowdPredictionResult } from '../src/types';
import { CrowdBadge } from '../src/components/CrowdBadge';

export default function CrowdScreen() {
  const router = useRouter();
  const [selectedRouteId, setSelectedRouteId] = useState('mtc_570');
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [prediction, setPrediction] = useState<CrowdPredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPred() {
      setLoading(true);
      try {
        const res = await mobileApi.getPrediction(selectedRouteId, selectedHour);
        setPrediction(res);
      } finally {
        setLoading(false);
      }
    }
    fetchPred();
  }, [selectedRouteId, selectedHour]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Route Selector Horizontal Scroll */}
      <View style={styles.selectorSection}>
        <Text style={styles.selectorLabel}>Select Bus Route:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CHENNAI_ROUTES.map((r) => {
            const isSelected = r.id === selectedRouteId;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.routeSelectChip, isSelected && styles.routeSelectChipActive]}
                onPress={() => setSelectedRouteId(r.id)}
              >
                <Text style={[styles.routeChipText, isSelected && styles.routeChipTextActive]}>
                  {r.route_number}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Time Picker Slider Quick Slots */}
      <View style={[styles.card, Shadows.soft]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Time of Travel</Text>
          <Text style={styles.selectedHourText}>{selectedHour.toString().padStart(2, '0')}:00 hrs</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {[6, 8, 9, 11, 13, 16, 18, 19, 21].map((hr) => (
            <TouchableOpacity
              key={hr}
              style={[styles.hourSlot, selectedHour === hr && styles.hourSlotActive]}
              onPress={() => setSelectedHour(hr)}
            >
              <Text style={[styles.hourText, selectedHour === hr && styles.hourTextActive]}>
                {hr:02d ? `${hr.toString().padStart(2, '0')}:00` : `${hr}:00`}
              </Text>
              {hr >= 8 && hr <= 10 && <Text style={styles.peakTag}>Morning Rush</Text>}
              {hr >= 17 && hr <= 19 && <Text style={styles.peakTag}>Evening Rush</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Prediction Output Card */}
      {loading || !prediction ? (
        <ActivityIndicator color={Colors.teal} style={{ marginTop: 30 }} />
      ) : (
        <>
          <View style={[styles.predictionHeroCard, Shadows.card]}>
            <View style={styles.predTopRow}>
              <View>
                <Text style={styles.routeHeaderNumber}>Route {prediction.route_number}</Text>
                <Text style={styles.predictionTimeText}>
                  Forecast for {selectedHour.toString().padStart(2, '0')}:00 hrs
                </Text>
              </View>
              <CrowdBadge level={prediction.predicted_crowd} />
            </View>

            {/* Occupancy Rate Banner */}
            <View style={styles.occupancyBarContainer}>
              <View style={styles.occupancyHeader}>
                <Text style={styles.occupancyLabel}>Expected Bus Occupancy</Text>
                <Text style={styles.occupancyValue}>{prediction.occupancy_percentage}%</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${prediction.occupancy_percentage}%`,
                      backgroundColor: prediction.occupancy_percentage > 85 ? Colors.crowd.veryHigh : prediction.occupancy_percentage > 70 ? Colors.crowd.high : Colors.teal
                    }
                  ]} 
                />
              </View>
            </View>

            {/* Expected Passenger Count Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Expected Commuters</Text>
                <Text style={styles.metricNumber}>~{prediction.expected_passenger_count}</Text>
                <Text style={styles.metricSub}>of {prediction.bus_capacity} max capacity</Text>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Model Reliability</Text>
                <Text style={styles.metricNumber}>{Math.round(prediction.reliability_score * 100)}%</Text>
                <Text style={styles.metricSub}>Calibrated prediction</Text>
              </View>
            </View>

            <View style={styles.factorsRow}>
              <Ionicons name="information-circle-outline" size={14} color="#94A3B8" />
              <Text style={styles.factorsText}>
                Factors: {prediction.factors.join(' • ')}
              </Text>
            </View>
          </View>

          {/* 24-Hour Trend Hourly Bars */}
          <View style={[styles.card, Shadows.soft]}>
            <Text style={styles.cardTitle}>24-Hour Predicted Demand Curve</Text>
            <Text style={styles.cardSubtitle}>
              Hourly forecast showing peak congestion and quiet windows.
            </Text>

            <View style={styles.barChartContainer}>
              {prediction.hourly_trend.slice(0, 10).map((pt, i) => (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barValue}>{pt.occupancy_pct}%</Text>
                  <View style={styles.barTrack}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          height: `${pt.occupancy_pct}%`,
                          backgroundColor: pt.occupancy_pct > 80 ? Colors.crowd.veryHigh : pt.occupancy_pct > 60 ? Colors.crowd.high : Colors.teal
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{pt.hour.split(':')[0]}h</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Crowd Category Guide */}
          <View style={[styles.guideCard, Shadows.soft]}>
            <Text style={styles.guideTitle}>Crowd Level Reference</Text>
            
            <View style={styles.guideItem}>
              <View style={[styles.guideDot, { backgroundColor: Colors.crowd.low }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.guideName}>LOW (0-40%)</Text>
                <Text style={styles.guideDesc}>Guaranteed seats, smooth boarding.</Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <View style={[styles.guideDot, { backgroundColor: Colors.crowd.moderate }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.guideName}>MODERATE (40-70%)</Text>
                <Text style={styles.guideDesc}>Standing room readily available.</Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <View style={[styles.guideDot, { backgroundColor: Colors.crowd.high }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.guideName}>HIGH (70-88%)</Text>
                <Text style={styles.guideDesc}>Shoulder-to-shoulder standing rush.</Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <View style={[styles.guideDot, { backgroundColor: Colors.crowd.veryHigh }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.guideName}>VERY HIGH (88-100%+)</Text>
                <Text style={styles.guideDesc}>Severe crush load, footboards full.</Text>
              </View>
            </View>
          </View>
        </>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  selectorSection: {
    marginBottom: 14,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  routeSelectChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  routeSelectChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  routeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  routeChipTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  cardSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  selectedHourText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.teal,
  },
  hourSlot: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hourSlotActive: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  hourText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  hourTextActive: {
    color: '#FFFFFF',
  },
  peakTag: {
    fontSize: 9,
    color: '#F97316',
    fontWeight: '700',
    marginTop: 2,
  },
  predictionHeroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  predTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  routeHeaderNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  predictionTimeText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  occupancyBarContainer: {
    marginBottom: 14,
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  occupancyLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  occupancyValue: {
    fontSize: 14,
    color: '#2DD4BF',
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  metricSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  factorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  factorsText: {
    fontSize: 10,
    color: '#94A3B8',
    flex: 1,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 70,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 4,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  guideDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: 10,
  },
  guideName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  guideDesc: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
