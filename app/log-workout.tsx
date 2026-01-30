import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { Routine } from "@/types";

export default function LogWorkoutScreen() {
  const router = useRouter();
  const { routines, logs, logWorkout } = useApp();
  const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter((log) => log.date === today && log.completed);
  const completedToday = todayLogs.map((log) => log.routineId);

  const handleLogWorkout = (routine: Routine) => {
    if (completedToday.includes(routine.id)) {
      Alert.alert(
        "Ya entrenaste esto hoy",
        `"${routine.name}" ya está marcada como completada. ¿Quieres desmarcarla?`,
        [
          { text: "Mantener", style: "cancel" },
          {
            text: "Desmarcar",
            onPress: () => {
              logWorkout(routine.id, today);
              Alert.alert(
                "Listo",
                "Rutina desmarcada. La puedes completar después.",
              );
            },
          },
        ],
      );
    } else {
      logWorkout(routine.id, today);
      Alert.alert(
        "Excelente trabajo",
        `"${routine.name}" registrada. ¡Sigue así!`,
        [
          {
            text: "Gracias",
            onPress: () => router.back(),
          },
        ],
      );
    }
  };

  const renderRoutineItem = ({ item }: { item: Routine }) => {
    const categoryColor = Colors.muscle[item.category];
    const isCompleted = completedToday.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.routineCard, isCompleted && styles.routineCardCompleted]}
        activeOpacity={0.8}
        onPress={() => handleLogWorkout(item)}
      >
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
              <View style={styles.categoryBadge}>
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: categoryColor },
                  ]}
                />
                <Text style={styles.routineCategory}>{item.category}</Text>
              </View>
            </View>
          </View>
          {isCompleted ? (
            <View style={styles.completedBadge}>
              <IconSymbol name="checkmark" size={18} color={Colors.success} />
            </View>
          ) : (
            <View style={styles.addBadge}>
              <IconSymbol name="plus" size={18} color={Colors.textMuted} />
            </View>
          )}
        </View>
        <View style={styles.routineFooter}>
          <View style={styles.exerciseInfo}>
            <IconSymbol name="flame.fill" size={14} color={Colors.textMuted} />
            <Text style={styles.exerciseCount}>
              {item.exercises.length} ejercicio
              {item.exercises.length !== 1 ? "s" : ""}
            </Text>
          </View>
          {isCompleted && (
            <Text style={styles.completedText}>✓ Completada</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (routines.length === 0) {
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
          <Text style={styles.headerTitle}>Registrar Entrenamiento</Text>
          <View style={styles.closeButton} />
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>💪</Text>
          </View>
          <Text style={styles.emptyTitle}>No hay rutinas</Text>
          <Text style={styles.emptyText}>
            Crea una rutina primero para poder registrarla
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.85}
            onPress={() => {
              router.back();
              router.push("/routine-edit");
            }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createButtonGradient}
            >
              <Text style={styles.createButtonText}>Crear rutina</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  routineCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadiusLarge,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routineCardCompleted: {
    borderColor: Colors.success,
    borderWidth: 2,
    backgroundColor: Colors.success + "08",
  },
  routineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  routineInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  routineDetails: {
    flex: 1,
  },
  routineName: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  routineCategory: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  completedBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  addBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundElevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routineFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  exerciseCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  completedText: {
    ...Typography.captionMedium,
    color: Colors.success,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  createButton: {
    borderRadius: Colors.ui.borderRadius,
    overflow: "hidden",
    ...Colors.ui.shadowGlow,
  },
  createButtonGradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  createButtonText: {
    ...Typography.h3,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
