import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../src/constants/theme';
import { mobileApi } from '../src/services/api';
import { BusRoute } from '../src/types';
import { CrowdBadge } from '../src/components/CrowdBadge';

export default function RoutesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ origin?: string; destination?: string }>();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'crowd' | 'duration' | 'transfers'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const list = await mobileApi.getRoutes(params.origin, params.destination);
        setRoutes(list);
      } finally {
        setLoading(false);
      }
    }
    fetchRoutes();
  }, [params.origin, params.destination]);

  const filteredRoutes = routes.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.route_number.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q) ||
      r.stops.some(s => s.stop_name.toLowerCase().includes(q))
    );
  }).sort((a, b) => {
    if (activeFilter === 'crowd') {
      const order = { LOW: 1, MODERATE: 2, HIGH: 3, 'VERY HIGH': 4 };
      return order[a.current_crowd_level] - order[b.current_crowd_level];
    }
    if (activeFilter === 'duration') {
      return a.estimated_duration_min - b.estimated_duration_min;
    }
    if (activeFilter === 'transfers') {
      return a.transfers - b.transfers;
    }
    return 0;
  });

  return (
    <View style={styles.container}>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputRow}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search route number, stop or locality..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>All Routes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'crowd' && styles.filterChipActive]}
            onPress={() => setActiveFilter('crowd')}
          >
            <Text style={[styles.filterText, activeFilter === 'crowd' && styles.filterTextActive]}>🟢 Lowest Crowd</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'duration' && styles.filterChipActive]}
            onPress={() => setActiveFilter('duration')}
          >
            <Text style={[styles.filterText, activeFilter === 'duration' && styles.filterTextActive]}>⚡ Shortest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'transfers' && styles.filterChipActive]}
            onPress={() => setActiveFilter('transfers')}
          >
            <Text style={[styles.filterText, activeFilter === 'transfers' && styles.filterTextActive]}>🔄 Direct</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Routes List */}
      {loading ? (
        <ActivityIndicator color={Colors.teal} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredRoutes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.routeCard, Shadows.soft]}
              onPress={() => router.push(`/route/${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.routePill}>
                  <Text style={styles.routeNumberText}>{item.route_number}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.routeNameText}>{item.name}</Text>
                  <Text style={styles.busTypeText}>{item.bus_type} • Every {item.frequency_min}m</Text>
                </View>
                <CrowdBadge level={item.current_crowd_level} />
              </View>

              <View style={styles.pathContainer}>
                <View style={styles.pathRow}>
                  <Ionicons name="radio-button-on" size={14} color={Colors.teal} />
                  <Text style={styles.pathStopName}>{item.origin}</Text>
                </View>
                <View style={styles.pathDivider} />
                <View style={styles.pathRow}>
                  <Ionicons name="location" size={14} color="#F97316" />
                  <Text style={styles.pathStopName}>{item.destination}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.metaText}>
                  {item.stops.length} stops • {item.estimated_duration_min} mins • ₹{item.fare_inr || 25}
                </Text>
                <View style={styles.chevronRow}>
                  <Text style={styles.viewStopsText}>View Schedule</Text>
                  <Ionicons name="chevron-forward" size={14} color={Colors.teal} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    marginLeft: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 14,
    paddingBottom: 28,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  routePill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  routeNumberText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  routeNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  busTypeText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  pathContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathDivider: {
    width: 2,
    height: 8,
    backgroundColor: '#CBD5E1',
    marginLeft: 6,
    marginVertical: 2,
  },
  pathStopName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  chevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewStopsText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.teal,
    marginRight: 2,
  },
});
