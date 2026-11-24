import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  TextInput, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../src/constants/theme';
import { CHENNAI_ROUTES } from '../src/services/api';
import { CrowdBadge } from '../src/components/CrowdBadge';

export default function ProfileScreen() {
  const router = useRouter();
  const [crowdAlerts, setCrowdAlerts] = useState(true);
  const [departureReminders, setDepartureReminders] = useState(true);
  const [ecoRoutes, setEcoRoutes] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const savedRoutes = [CHENNAI_ROUTES[0], CHENNAI_ROUTES[2]]; // 570 and 21G

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    setFeedbackSent(true);
    setFeedback('');
    Alert.alert('Feedback Logged', 'Thank you! Your observations help calibrate the Chennai transit prediction engine.');
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Commuter Card */}
      <View style={[styles.profileCard, Shadows.card]}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>K</Text>
        </View>

        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.profileName}>Karthik Subramanian</Text>
          <Text style={styles.profileEmail}>karthik.s@example.com</Text>
          <View style={styles.commuterPill}>
            <Text style={styles.commuterPillText}>Regular MTC Commuter</Text>
          </View>
        </View>
      </View>

      {/* Saved Favorite Routes */}
      <View style={[styles.card, Shadows.soft]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="bookmark" size={16} color={Colors.teal} />
            <Text style={styles.cardTitle}>Saved Routes ({savedRoutes.length})</Text>
          </View>
          <Text style={styles.quickStatusTag}>1-Tap Crowd Status</Text>
        </View>

        {savedRoutes.map((route) => (
          <TouchableOpacity
            key={route.id}
            style={styles.savedRouteRow}
            onPress={() => router.push(`/route/${route.id}`)}
          >
            <View style={styles.savedPill}>
              <Text style={styles.savedPillText}>{route.route_number}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.savedRouteName}>{route.name}</Text>
              <Text style={styles.savedMeta}>Every {route.frequency_min}m • {route.estimated_duration_min} mins</Text>
            </View>
            <CrowdBadge level={route.current_crowd_level} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Notification Preferences */}
      <View style={[styles.card, Shadows.soft]}>
        <Text style={styles.cardTitle}>Transit Alerts & Notifications</Text>

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Overcrowding Surge Alerts</Text>
            <Text style={styles.settingDesc}>Notify when saved routes experience &gt;85% passenger crush</Text>
          </View>
          <Switch
            value={crowdAlerts}
            onValueChange={setCrowdAlerts}
            trackColor={{ false: '#CBD5E1', true: Colors.teal }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Optimal Departure Alerts</Text>
            <Text style={styles.settingDesc}>Alert 15 mins before less-crowded bus departure</Text>
          </View>
          <Switch
            value={departureReminders}
            onValueChange={setDepartureReminders}
            trackColor={{ false: '#CBD5E1', true: Colors.teal }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>AC Electric Recommendations</Text>
            <Text style={styles.settingDesc}>Prioritize comfortable AC electric buses along OMR</Text>
          </View>
          <Switch
            value={ecoRoutes}
            onValueChange={setEcoRoutes}
            trackColor={{ false: '#CBD5E1', true: Colors.teal }}
          />
        </View>
      </View>

      {/* Commuter Feedback Form */}
      <View style={[styles.card, Shadows.soft]}>
        <Text style={styles.cardTitle}>Commuter Feedback & Suggestions</Text>
        <Text style={styles.cardSubtitle}>Help us improve crowd prediction accuracy for Chennai routes.</Text>

        <TextInput
          style={styles.feedbackInput}
          placeholder="Share your experience with crowd predictions or delays..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
          value={feedback}
          onChangeText={setFeedback}
        />

        <TouchableOpacity 
          style={styles.sendFeedbackBtn}
          onPress={handleSendFeedback}
        >
          <Text style={styles.sendFeedbackText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Operator Dashboard Shortcut */}
      <TouchableOpacity 
        style={styles.operatorBtn}
        onPress={() => Alert.alert('Operator Mode', 'Transport Operator analytics available on desktop or tablet web portal.')}
      >
        <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
        <Text style={styles.operatorBtnText}>MTC Transport Operator Mode</Text>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  commuterPill: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  commuterPillText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '700',
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
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 6,
  },
  cardSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  quickStatusTag: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  savedRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  savedPill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savedPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  savedRouteName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  savedMeta: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  settingDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  feedbackInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    fontSize: 12,
    color: Colors.text,
    textAlignVertical: 'top',
    height: 70,
  },
  sendFeedbackBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  sendFeedbackText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  operatorBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  operatorBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
