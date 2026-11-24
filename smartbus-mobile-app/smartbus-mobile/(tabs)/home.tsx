import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../src/constants/theme';
import { mobileApi } from '../src/services/api';
import { BusRoute, RouteRecommendation } from '../src/types';
import { CrowdBadge } from '../src/components/CrowdBadge';

export default function HomeScreen() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [recommendations, setRecommendations] = useState<RouteRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const recs = await mobileApi.getRecommendations();
        setRecommendations(recs);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = () => {
    router.push({
      pathname: '/(tabs)/routes',
      params: { origin, destination }
    });
  };

  const handleQuickDestination = (dest: string) => {
    setDestination(dest);
    if (!origin) setOrigin('Koyambedu (CMBT)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* 1. Hero Journey Search Card */}
      <View style={[styles.heroCard, Shadows.card]}>
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles" size={13} color="#2DD4BF" />
          <Text style={styles.heroBadgeText}>AI Crowd Forecaster • Chennai MTC</Text>
        </View>

        <Text style={styles.heroTitle}>Travel Smarter.{'\n'}Avoid The Peak Rush.</Text>
        <Text style={styles.heroSubtitle}>
          Real-time predicted bus occupancy across Chennai city corridors.
        </Text>

        <View style={styles.searchBox}>
          {/* Origin */}
          <View style={styles.inputRow}>
            <Ionicons name="location" size={18} color={Colors.teal} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Starting stop (e.g. CMBT, Guindy)"
              placeholderTextColor="#94A3B8"
              value={origin}
              onChangeText={setOrigin}
            />
          </View>

          <View style={styles.inputDivider} />

          {/* Destination */}
          <View style={styles.inputRow}>
            <Ionicons name="navigate" size={18} color="#F97316" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Destination (e.g. Siruseri, Adyar)"
              placeholderTextColor="#94A3B8"
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.8}>
            <Ionicons name="search" size={18} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Find Buses</Text>
          </TouchableOpacity>
        </View>

        {/* Quick popular chips */}
        <View style={styles.chipsContainer}>
          <Text style={styles.chipsLabel}>Quick:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Siruseri IT Park', 'Guindy', 'T. Nagar', 'Central', 'Marina Beach'].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                onPress={() => handleQuickDestination(item)}
              >
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* 2. Live Corridor Crowd Pulse */}
      <View style={[styles.sectionCard, Shadows.soft]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="pulse" size={18} color={Colors.teal} />
            <Text style={styles.sectionTitle}>Chennai Transit Crowd Pulse</Text>
          </View>
          <Text style={styles.badgeSample}>Model Predicted</Text>
        </View>

        <View style={styles.corridorGrid}>
          <View style={styles.corridorItem}>
            <View style={styles.corridorHeader}>
              <Text style={styles.corridorName}>OMR IT Corridor</Text>
              <CrowdBadge level="HIGH" showDot={false} />
            </View>
            <Text style={styles.corridorDesc}>Perungudi to Siruseri</Text>
            <Text style={styles.corridorLoad}>~84% Occupancy</Text>
          </View>

          <View style={styles.corridorItem}>
            <View style={styles.corridorHeader}>
              <Text style={styles.corridorName}>Anna Salai Spine</Text>
              <CrowdBadge level="VERY HIGH" showDot={false} />
            </View>
            <Text style={styles.corridorDesc}>Saidapet to Guindy</Text>
            <Text style={styles.corridorLoad}>~94% Occupancy</Text>
          </View>

          <View style={styles.corridorItem}>
            <View style={styles.corridorHeader}>
              <Text style={styles.corridorName}>Coastal / Adyar</Text>
              <CrowdBadge level="LOW" showDot={false} />
            </View>
            <Text style={styles.corridorDesc}>Besant Nagar Beach</Text>
            <Text style={styles.corridorLoad}>~38% Occupancy</Text>
          </View>
        </View>
      </View>

      {/* 3. Less-Crowded Travel Recommendations */}
      <View style={styles.recommendationsSection}>
        <Text style={styles.sectionHeading}>Less-Crowded Alternatives</Text>
        <Text style={styles.sectionSubheading}>
          Comfortable journeys that avoid overcrowded transit bottlenecks.
        </Text>

        {loading ? (
          <ActivityIndicator color={Colors.teal} style={{ marginTop: 20 }} />
        ) : (
          recommendations.map((rec, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.recCard, Shadows.soft]}
              onPress={() => router.push(`/route/${rec.route_id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.recHeader}>
                <View style={styles.routePill}>
                  <Text style={styles.routeNumberText}>{rec.route_number}</Text>
                </View>
                <CrowdBadge level={rec.predicted_crowd} />
              </View>

              <Text style={styles.recRouteName}>
                {rec.origin} ➔ {rec.destination}
              </Text>
              <Text style={styles.recReason}>
                {rec.recommendation_reason}
              </Text>

              <View style={styles.recSavingsBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                <Text style={styles.recSavingsText}>{rec.savings_highlight}</Text>
              </View>

              <View style={styles.recFooter}>
                <Text style={styles.recMetaText}>
                  Est. {rec.estimated_duration_min} mins • ₹{rec.fare_inr}
                </Text>
                <View style={styles.viewRouteRow}>
                  <Text style={styles.viewRouteText}>View Stops</Text>
                  <Ionicons name="chevron-forward" size={14} color={Colors.teal} />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* 4. Crowd Reporting Action Card */}
      <TouchableOpacity
        style={[styles.reportBanner, Shadows.soft]}
        onPress={() => router.push('/report')}
        activeOpacity={0.85}
      >
        <View style={styles.reportIconCircle}>
          <Ionicons name="megaphone" size={20} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reportTitle}>Are you at a bus stop right now?</Text>
          <Text style={styles.reportSubtitle}>Help fellow Chennai commuters by sharing crowd levels in 15 seconds.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

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
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#2DD4BF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
    lineHeight: 18,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  inputDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  searchButton: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  chipsLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 6,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 6,
  },
  badgeSample: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  corridorGrid: {
    gap: 8,
  },
  corridorItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  corridorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  corridorName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  corridorDesc: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  corridorLoad: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
  },
  sectionSubheading: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
    marginTop: 2,
  },
  recCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routePill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  routeNumberText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  recRouteName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  recReason: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  recSavingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  recSavingsText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  recMetaText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  viewRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewRouteText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.teal,
    marginRight: 2,
  },
  reportBanner: {
    backgroundColor: '#0F766E',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  reportSubtitle: {
    color: '#CCFBF1',
    fontSize: 11,
    marginTop: 2,
  },
});
