import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../src/constants/theme';
import { CHENNAI_STOPS, CHENNAI_ROUTES } from '../src/services/api';
import { CrowdBadge } from '../src/components/CrowdBadge';

export default function MapScreen() {
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedStop, setSelectedStop] = useState<any>(CHENNAI_STOPS[3]); // Guindy by default

  const zones = ['All', 'South OMR', 'Central', 'West', 'South'];

  const filteredStops = CHENNAI_STOPS.filter(s => {
    if (selectedZone === 'All') return true;
    return s.zone.includes(selectedZone);
  });

  return (
    <View style={styles.container}>
      
      {/* Zone Filter Chips */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {zones.map((z, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.zoneChip, selectedZone === z && styles.zoneChipActive]}
              onPress={() => setSelectedZone(z)}
            >
              <Text style={[styles.zoneText, selectedZone === z && styles.zoneTextActive]}>
                {z} Zone
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transit Network Map Schematic */}
      <View style={[styles.mapCanvas, Shadows.soft]}>
        <View style={styles.mapHeaderRow}>
          <View style={styles.liveIndicator}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveText}>Chennai MTC Transit Grid</Text>
          </View>
          <Text style={styles.regionTag}>Tamil Nadu Transport</Text>
        </View>

        {/* Network diagram representation */}
        <View style={styles.networkSchematic}>
          <View style={styles.corridorLine}>
            <View style={[styles.nodePoint, { top: 20, left: '15%', backgroundColor: Colors.teal }]} />
            <Text style={[styles.nodeLabel, { top: 38, left: '10%' }]}>CMBT</Text>

            <View style={[styles.nodePoint, { top: 60, left: '40%', backgroundColor: Colors.crowd.veryHigh }]} />
            <Text style={[styles.nodeLabel, { top: 78, left: '35%' }]}>Guindy (Choke)</Text>

            <View style={[styles.nodePoint, { top: 100, left: '65%', backgroundColor: Colors.crowd.high }]} />
            <Text style={[styles.nodeLabel, { top: 118, left: '60%' }]}>TIDEL OMR</Text>

            <View style={[styles.nodePoint, { top: 140, left: '85%', backgroundColor: Colors.crowd.low }]} />
            <Text style={[styles.nodeLabel, { top: 158, left: '80%' }]}>Siruseri</Text>
          </View>
        </View>

        <Text style={styles.mapNotice}>
          Tap any stop below to inspect passing routes & current passenger density.
        </Text>
      </View>

      {/* Selected Stop Details Drawer */}
      {selectedStop && (
        <View style={[styles.stopDetailCard, Shadows.card]}>
          <View style={styles.stopDetailHeader}>
            <View>
              <Text style={styles.stopDetailName}>{selectedStop.name}</Text>
              <Text style={styles.stopDetailZone}>{selectedStop.locality} • {selectedStop.zone}</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewScheduleBtn}
              onPress={() => router.push(`/stop/${selectedStop.id}`)}
            >
              <Text style={styles.viewScheduleText}>Schedule</Text>
              <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.passingRoutesRow}>
            <Text style={styles.passingLabel}>Passing Buses:</Text>
            <View style={styles.badgePillRow}>
              {['570', '570 AC', '21G', 'D70'].map((num, i) => (
                <View key={i} style={styles.routeTag}>
                  <Text style={styles.routeTagText}>{num}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Stop List */}
      <FlatList
        data={filteredStops}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.stopListContent}
        renderItem={({ item }) => {
          const isSelected = selectedStop?.id === item.id;
          return (
            <TouchableOpacity
              style={[styles.stopRow, isSelected && styles.stopRowActive]}
              onPress={() => setSelectedStop(item)}
            >
              <View style={styles.stopPinCircle}>
                <Ionicons name="bus" size={14} color={isSelected ? Colors.teal : Colors.textMuted} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.stopRowName, isSelected && { color: Colors.teal, fontWeight: '700' }]}>
                  {item.name}
                </Text>
                <Text style={styles.stopRowLocality}>{item.locality}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          );
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  zoneChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
  },
  zoneChipActive: {
    backgroundColor: Colors.primary,
  },
  zoneText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  zoneTextActive: {
    color: '#FFFFFF',
  },
  mapCanvas: {
    backgroundColor: Colors.primary,
    margin: 12,
    borderRadius: 20,
    padding: 16,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2DD4BF',
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  regionTag: {
    color: '#94A3B8',
    fontSize: 10,
  },
  networkSchematic: {
    height: 190,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  corridorLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(45, 212, 191, 0.4)',
    transform: [{ rotate: '25deg' }],
  },
  nodePoint: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nodeLabel: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  mapNotice: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  stopDetailCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 16,
    padding: 14,
  },
  stopDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopDetailName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  stopDetailZone: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  viewScheduleBtn: {
    backgroundColor: Colors.teal,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewScheduleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 2,
  },
  passingRoutesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  passingLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginRight: 8,
  },
  badgePillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  routeTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  routeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  stopListContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  stopRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopRowActive: {
    borderWidth: 1,
    borderColor: Colors.teal,
    backgroundColor: '#F0FDFA',
  },
  stopPinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopRowName: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  stopRowLocality: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
