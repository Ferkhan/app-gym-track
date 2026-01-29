import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";

export default function RoutineDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { routines } = useApp();

  const routine = routines.find((r) => r.id === id);

  if (!routine) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <View style={styles.notFoundIcon}>
            <Text style={styles.notFoundEmoji}>🔍</Text>
          </View>
          <Text style={styles.notFoundText}>Rutina no encontrada</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryColor = Colors.muscle[routine.category];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol name="xmark" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
              <View style={styles.categoryBadge}>
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: categoryColor },
                  ]}
                />
                <Text style={styles.category}>{routine.category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{routine.exercises.length}</Text>
              <Text style={styles.statLabel}>Ejercicios</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {routine.exercises.reduce((acc, e) => acc + e.sets, 0)}
              </Text>
              <Text style={styles.statLabel}>Series Total</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ejercicios</Text>
            {routine.exercises.length === 0 ? (
              <View style={styles.emptyExercises}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyText}>
                  No hay ejercicios en esta rutina
                </Text>
              </View>
            ) : (
              <View style={styles.exercisesList}>
                {routine.exercises.map((exercise, index) => (
                  <View key={exercise.id} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <View
                        style={[
                          styles.exerciseNumber,
                          { backgroundColor: categoryColor + "20" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.exerciseNumberText,
                            { color: categoryColor },
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                    </View>
                    <View style={styles.exerciseDetails}>
                      <View style={styles.exerciseDetailItem}>
                        <Text style={styles.exerciseDetailValue}>
                          {exercise.sets}
                        </Text>
                        <Text style={styles.exerciseDetailLabel}>series</Text>
                      </View>
                      <Text style={styles.exerciseDetailDivider}>×</Text>
                      <View style={styles.exerciseDetailItem}>
                        <Text style={styles.exerciseDetailValue}>
                          {exercise.reps}
                        </Text>
                        <Text style={styles.exerciseDetailLabel}>reps</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.85}
            onPress={() => router.push(`/routine-edit?id=${routine.id}`)}
          >
            <LinearGradient
              colors={[categoryColor, categoryColor + "CC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.editButtonGradient}
            >
              <IconSymbol name="pencil" size={18} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Editar rutina</Text>
            </LinearGradient>
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
    alignItems: "flex-end",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  titleSection: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
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
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  category: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    ...Typography.h1,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.captionMedium,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  exercisesList: {
    gap: Spacing.sm,
  },
  exerciseCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  exerciseNumberText: {
    ...Typography.bodyMedium,
    fontWeight: "600",
  },
  exerciseName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    flex: 1,
  },
  exerciseDetails: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 48,
    gap: Spacing.sm,
  },
  exerciseDetailItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.xs,
  },
  exerciseDetailValue: {
    ...Typography.h3,
    color: Colors.text,
  },
  exerciseDetailLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  exerciseDetailDivider: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  emptyExercises: {
    padding: Spacing.xl,
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  editButton: {
    borderRadius: Colors.ui.borderRadius,
    overflow: "hidden",
    ...Colors.ui.shadow,
  },
  editButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  editButtonText: {
    ...Typography.h3,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  notFoundIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notFoundEmoji: {
    fontSize: 40,
  },
  notFoundText: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Colors.ui.borderRadius,
  },
  backButtonText: {
    ...Typography.bodyMedium,
    color: "#FFFFFF",
  },
});
