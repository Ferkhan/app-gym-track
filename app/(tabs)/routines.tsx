import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
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

export default function RoutinesScreen() {
  const router = useRouter();
  const { routines, deleteRoutine } = useApp();

  const handleAddRoutine = () => {
    if (routines.length >= 5) {
      Alert.alert(
        "Límite alcanzado",
        "Solo puedes tener hasta 5 rutinas. Elimina una para crear otra nueva.",
      );
      return;
    }
    router.push("/routine-edit");
  };

  const handleDeleteRoutine = (routine: Routine) => {
    Alert.alert(
      "¿Eliminar rutina?",
      `¿Seguro que quieres eliminar "${routine.name}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: () => {
            deleteRoutine(routine.id);
          },
        },
      ],
    );
  };

  const handleEditRoutine = (routine: Routine) => {
    router.push(`/routine-edit?id=${routine.id}`);
  };

  const handleViewRoutine = (routine: Routine) => {
    router.push(`/routine-detail?id=${routine.id}`);
  };

  const renderRoutineItem = ({ item }: { item: Routine }) => {
    const categoryColor = Colors.muscle[item.category];

    return (
      <TouchableOpacity
        style={styles.routineCard}
        onPress={() => handleViewRoutine(item)}
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
              <Text style={styles.routineCategory}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.routineActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditRoutine(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="pencil" size={20} color={Colors.gray.dark} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteRoutine(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="trash" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.routineFooter}>
          <Text style={styles.exerciseCount}>
            {item.exercises.length} ejercicio
            {item.exercises.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Rutinas</Text>
        <Text style={styles.subtitle}>{routines.length}/5 rutinas creadas</Text>
      </View>

      {routines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.infoIcon}>
            <IconSymbol
              name="clipboard.fill"
              size={60}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.emptyTitle}>No hay rutinas</Text>
          <Text style={styles.emptyText}>
            Crea tu primera rutina para comenzar
          </Text>
        </View>
      ) : (
        <FlatList
          data={routines}
          renderItem={renderRoutineItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[
          styles.addButton,
          routines.length >= 5 && styles.addButtonDisabled,
        ]}
        activeOpacity={0.85}
        onPress={handleAddRoutine}
        disabled={routines.length >= 5}
      >
        <LinearGradient
          colors={
            routines.length >= 5
              ? [Colors.gray.medium, Colors.gray.medium]
              : [Colors.primary, Colors.primaryDark]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.addButtonGradient}
        >
          <IconSymbol name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Nueva Rutina</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  routineCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadiusLarge,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Colors.ui.shadow,
    borderWidth: 1,
    borderColor: Colors.border,
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
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  routineCategory: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  routineActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  routineFooter: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  exerciseCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    color: Colors.textSecondary,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    borderRadius: Colors.ui.borderRadius,
    overflow: "hidden",
    ...Colors.ui.shadowGlow,
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    ...Typography.h3,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  infoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
});
