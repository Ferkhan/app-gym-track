import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { Exercise, RoutineCategory } from "@/types";

const CATEGORIES: RoutineCategory[] = ["Legs", "Back", "Chest", "Arms"];

export default function RoutineEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { routines, addRoutine, updateRoutine } = useApp();

  const isEditing = !!id;
  const existingRoutine = isEditing ? routines.find((r) => r.id === id) : null;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<RoutineCategory>("Legs");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (existingRoutine) {
      setName(existingRoutine.name);
      setCategory(existingRoutine.category);
      setExercises(existingRoutine.exercises);
    }
  }, [existingRoutine]);

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      sets: 3,
      reps: 10,
    };
    setExercises([...exercises, newExercise]);
  };

  const handleUpdateExercise = (
    exerciseId: string,
    updates: Partial<Exercise>,
  ) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex,
      ),
    );
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(
        "Falta el nombre",
        "Dale un nombre a tu rutina para poder guardarla.",
      );
      return;
    }

    const validExercises = exercises.filter((ex) => ex.name.trim() !== "");
    if (validExercises.length === 0) {
      Alert.alert(
        "Sin ejercicios",
        "Agrega al menos un ejercicio a tu rutina.",
      );
      return;
    }

    if (isEditing && existingRoutine) {
      updateRoutine(id!, {
        name: name.trim(),
        category,
        exercises: validExercises,
      });
    } else {
      addRoutine({
        name: name.trim(),
        category,
        exercises: validExercises,
      });
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="xmark" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Editar Rutina" : "Nueva Rutina"}
          </Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre de la rutina</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Rutina de piernas"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Categoría</Text>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && {
                        backgroundColor: Colors.muscle[cat],
                      },
                      category === cat && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === cat && styles.categoryButtonTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.exercisesSection}>
              <View style={styles.exercisesHeader}>
                <Text style={styles.label}>Ejercicios</Text>
                <TouchableOpacity
                  style={styles.addExerciseButton}
                  onPress={handleAddExercise}
                >
                  <IconSymbol name="plus" size={18} color={Colors.primary} />
                  <Text style={styles.addExerciseText}>Agregar</Text>
                </TouchableOpacity>
              </View>

              {exercises.map((exercise, index) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseCardHeader}>
                    <Text style={styles.exerciseNumber}>
                      Ejercicio {index + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(exercise.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <IconSymbol name="trash" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.exerciseInputs}>
                    <View style={styles.exerciseInput}>
                      <Text style={styles.exerciseLabel}>Nombre</Text>
                      <TextInput
                        style={styles.exerciseTextInput}
                        placeholder="Nombre del ejercicio"
                        placeholderTextColor={Colors.textMuted}
                        value={exercise.name}
                        onChangeText={(text) =>
                          handleUpdateExercise(exercise.id, { name: text })
                        }
                      />
                    </View>

                    <View style={styles.exerciseInputRow}>
                      <View
                        style={[styles.exerciseInput, styles.exerciseInputHalf]}
                      >
                        <Text style={styles.exerciseLabel}>Series</Text>
                        <TextInput
                          style={styles.exerciseTextInput}
                          placeholder="3"
                          placeholderTextColor={Colors.textMuted}
                          value={exercise.sets.toString()}
                          onChangeText={(text) => {
                            const sets = parseInt(text) || 0;
                            handleUpdateExercise(exercise.id, { sets });
                          }}
                          keyboardType="numeric"
                        />
                      </View>

                      <View
                        style={[styles.exerciseInput, styles.exerciseInputHalf]}
                      >
                        <Text style={styles.exerciseLabel}>Reps</Text>
                        <TextInput
                          style={styles.exerciseTextInput}
                          placeholder="10"
                          placeholderTextColor={Colors.textMuted}
                          value={exercise.reps.toString()}
                          onChangeText={(text) => {
                            const reps = parseInt(text) || 0;
                            handleUpdateExercise(exercise.id, { reps });
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              {exercises.length === 0 && (
                <View style={styles.emptyExercises}>
                  <Text style={styles.emptyText}>
                    No hay ejercicios. Toca "Agregar" para agregar uno.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
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
  saveButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Colors.ui.borderRadius,
  },
  saveButtonText: {
    ...Typography.bodyMedium,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  form: {
    padding: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Colors.ui.borderRadius,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.text,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Colors.ui.borderRadius,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
  },
  categoryButtonActive: {
    // Border color is set dynamically in the component
  },
  categoryButtonText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: Colors.text,
    fontWeight: "600",
  },
  exercisesSection: {
    marginTop: Spacing.md,
  },
  exercisesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + "15",
    borderRadius: Colors.ui.borderRadius,
  },
  addExerciseText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
  exerciseCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  exerciseNumber: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  exerciseInputs: {
    gap: Spacing.sm,
  },
  exerciseInput: {
    marginBottom: Spacing.sm,
  },
  exerciseInputRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  exerciseInputHalf: {
    flex: 1,
  },
  exerciseLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  exerciseTextInput: {
    ...Typography.body,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Colors.ui.borderRadius,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    color: Colors.text,
  },
  emptyExercises: {
    padding: Spacing.xl,
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
