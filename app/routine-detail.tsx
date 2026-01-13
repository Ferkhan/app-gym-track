import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RoutineDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { routines } = useApp();

  const routine = routines.find((r) => r.id === id);

  if (!routine) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Rutina no encontrada</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryColor = Colors.muscle[routine.category];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <IconSymbol name="xmark" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View
              style={[
                styles.categoryIndicator,
                { backgroundColor: categoryColor },
              ]}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{routine.name}</Text>
              <Text style={styles.category}>{routine.category}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ejercicios</Text>
            {routine.exercises.length === 0 ? (
              <View style={styles.emptyExercises}>
                <Text style={styles.emptyText}>No hay ejercicios en esta rutina</Text>
              </View>
            ) : (
              <View style={styles.exercisesList}>
                {routine.exercises.map((exercise, index) => (
                  <View key={exercise.id} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseNumber}>{index + 1}</Text>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                    </View>
                    <View style={styles.exerciseDetails}>
                      <Text style={styles.exerciseDetail}>
                        {exercise.sets} series
                      </Text>
                      <Text style={styles.exerciseDetail}>
                        {exercise.reps} repeticiones
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: categoryColor }]}
            onPress={() => router.push(`/routine-edit?id=${routine.id}`)}>
            <IconSymbol name="pencil" size={20} color={Colors.background} />
            <Text style={styles.editButtonText}>Editar rutina</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  categoryIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  category: {
    ...Typography.body,
    color: Colors.gray.dark,
    fontWeight: '500',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  exercisesList: {
    gap: Spacing.md,
  },
  exerciseCard: {
    backgroundColor: Colors.gray.light,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  exerciseNumber: {
    ...Typography.h3,
    color: Colors.muscle.Legs,
    marginRight: Spacing.md,
    width: 32,
  },
  exerciseName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingLeft: 40,
  },
  exerciseDetail: {
    ...Typography.caption,
    color: Colors.gray.dark,
  },
  emptyExercises: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.gray.dark,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Colors.ui.borderRadius,
    gap: Spacing.sm,
    ...Colors.ui.shadow,
  },
  editButtonText: {
    ...Typography.h3,
    color: Colors.background,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notFoundText: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  backButton: {
    backgroundColor: Colors.muscle.Legs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Colors.ui.borderRadius,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
});

