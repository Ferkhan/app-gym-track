import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Typography } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user, routines, logs } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((log) => log.date === today && log.completed);
  const todayRoutine = routines.find((r) =>
    todayLogs.some((log) => log.routineId === r.id)
  );

  // Calculate weekly progress (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekLogs = logs.filter(
    (log) =>
      log.completed &&
      new Date(log.date) >= sevenDaysAgo &&
      new Date(log.date) <= new Date()
  );
  const weeklyProgress = weekLogs.length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hola, {user?.name || 'Usuario'}
          </Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/log-workout')}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Rutina de hoy</Text>
              {todayRoutine && (
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: Colors.muscle[todayRoutine.category] },
                  ]}>
                  <Text style={styles.categoryBadgeText}>
                    {todayRoutine.category}
                  </Text>
                </View>
              )}
            </View>
            {todayRoutine ? (
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{todayRoutine.name}</Text>
                <Text style={styles.cardSubtext}>
                  {todayRoutine.exercises.length} ejercicios
                </Text>
              </View>
            ) : (
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>No hay rutina programada</Text>
                <Text style={styles.cardSubtext}>
                  Toca para registrar un entrenamiento
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Progreso semanal</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.progressNumber}>{weeklyProgress}</Text>
              <Text style={styles.cardSubtext}>
                entrenamientos completados
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min((weeklyProgress / 7) * 100, 100)}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => router.push('/log-workout')}>
          <Text style={styles.quickActionText}>Registrar entrenamiento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  date: {
    ...Typography.body,
    color: Colors.gray.dark,
    textTransform: 'capitalize',
  },
  cardsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Colors.ui.borderRadiusLarge,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Colors.ui.shadow,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Colors.ui.borderRadius,
  },
  categoryBadgeText: {
    ...Typography.caption,
    color: Colors.background,
    fontWeight: '600',
  },
  cardContent: {
    gap: Spacing.xs,
  },
  cardText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '500',
  },
  cardSubtext: {
    ...Typography.caption,
    color: Colors.gray.dark,
  },
  progressNumber: {
    ...Typography.h1,
    color: Colors.muscle.Legs,
    fontSize: 48,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray.light,
    borderRadius: 4,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.muscle.Legs,
    borderRadius: 4,
  },
  quickActionButton: {
    backgroundColor: Colors.muscle.Legs,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Colors.ui.borderRadius,
    alignItems: 'center',
    ...Colors.ui.shadow,
  },
  quickActionText: {
    ...Typography.h3,
    color: Colors.background,
    fontWeight: '600',
  },
});
