import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Routine } from '@/types';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LogWorkoutScreen() {
  const router = useRouter();
  const { routines, logs, logWorkout } = useApp();
  const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((log) => log.date === today && log.completed);
  const completedToday = todayLogs.map((log) => log.routineId);

  const handleLogWorkout = (routine: Routine) => {
    if (completedToday.includes(routine.id)) {
      Alert.alert(
        'Rutina ya completada',
        `La rutina "${routine.name}" ya fue marcada como completada hoy. ¿Deseas desmarcarla?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desmarcar',
            onPress: () => {
              logWorkout(routine.id, today);
              Alert.alert('Éxito', 'Rutina desmarcada');
            },
          },
        ]
      );
    } else {
      logWorkout(routine.id, today);
      Alert.alert('¡Éxito!', `Rutina "${routine.name}" registrada para hoy.`, [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }
  };

  const renderRoutineItem = ({ item }: { item: Routine }) => {
    const categoryColor = Colors.muscle[item.category];
    const isCompleted = completedToday.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.routineCard,
          isCompleted && styles.routineCardCompleted,
        ]}
        onPress={() => handleLogWorkout(item)}>
        <View style={styles.routineHeader}>
          <View style={styles.routineInfo}>
            <View
              style={[
                styles.categoryIndicator,
                { backgroundColor: categoryColor },
              ]}
            />
            <View style={styles.routineDetails}>
              <Text style={styles.routineName}>{item.name}</Text>
              <Text style={styles.routineCategory}>{item.category}</Text>
            </View>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <IconSymbol name="checkmark" size={20} color={Colors.success} />
            </View>
          )}
        </View>
        <View style={styles.routineFooter}>
          <Text style={styles.exerciseCount}>
            {item.exercises.length} ejercicio{item.exercises.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (routines.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <IconSymbol name="xmark" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registrar Entrenamiento</Text>
          <View style={styles.closeButton} />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💪</Text>
          <Text style={styles.emptyTitle}>No hay rutinas</Text>
          <Text style={styles.emptyText}>
            Crea una rutina primero para poder registrarla
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              router.back();
              router.push('/routine-edit');
            }}>
            <Text style={styles.createButtonText}>Crear rutina</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <IconSymbol name="xmark" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Entrenamiento</Text>
        <View style={styles.closeButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Selecciona la rutina que completaste hoy
        </Text>

        <FlatList
          data={routines}
          renderItem={renderRoutineItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  closeButton: {
    padding: Spacing.xs,
    width: 40,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.gray.dark,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  routineCard: {
    backgroundColor: Colors.background,
    borderRadius: Colors.ui.borderRadiusLarge,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Colors.ui.shadow,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  routineCardCompleted: {
    borderColor: Colors.success,
    borderWidth: 2,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  routineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  routineDetails: {
    flex: 1,
  },
  routineName: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  routineCategory: {
    ...Typography.caption,
    color: Colors.gray.dark,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineFooter: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  exerciseCount: {
    ...Typography.caption,
    color: Colors.gray.dark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.gray.dark,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  createButton: {
    backgroundColor: Colors.muscle.Legs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Colors.ui.borderRadius,
    ...Colors.ui.shadow,
  },
  createButtonText: {
    ...Typography.h3,
    color: Colors.background,
    fontWeight: '600',
  },
});

