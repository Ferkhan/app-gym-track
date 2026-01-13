import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { RoutineCategory, Exercise } from '@/types';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CATEGORIES: RoutineCategory[] = ['Legs', 'Back', 'Chest', 'Arms'];

export default function RoutineEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { routines, addRoutine, updateRoutine } = useApp();

  const isEditing = !!id;
  const existingRoutine = isEditing ? routines.find((r) => r.id === id) : null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<RoutineCategory>('Legs');
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
      name: '',
      sets: 3,
      reps: 10,
    };
    setExercises([...exercises, newExercise]);
  };

  const handleUpdateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, ...updates } : ex))
    );
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre de la rutina es requerido');
      return;
    }

    const validExercises = exercises.filter((ex) => ex.name.trim() !== '');
    if (validExercises.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos un ejercicio');
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <IconSymbol name="xmark" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar Rutina' : 'Nueva Rutina'}
          </Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre de la rutina</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Rutina de piernas"
                placeholderTextColor={Colors.gray.medium}
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
                    onPress={() => setCategory(cat)}>
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === cat && styles.categoryButtonTextActive,
                      ]}>
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
                  onPress={handleAddExercise}>
                  <IconSymbol name="add" size={20} color={Colors.muscle.Legs} />
                  <Text style={styles.addExerciseText}>Agregar</Text>
                </TouchableOpacity>
              </View>

              {exercises.map((exercise, index) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseCardHeader}>
                    <Text style={styles.exerciseNumber}>Ejercicio {index + 1}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(exercise.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <IconSymbol name="trash" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.exerciseInputs}>
                    <View style={styles.exerciseInput}>
                      <Text style={styles.exerciseLabel}>Nombre</Text>
                      <TextInput
                        style={styles.exerciseTextInput}
                        placeholder="Nombre del ejercicio"
                        placeholderTextColor={Colors.gray.medium}
                        value={exercise.name}
                        onChangeText={(text) =>
                          handleUpdateExercise(exercise.id, { name: text })
                        }
                      />
                    </View>

                    <View style={styles.exerciseInputRow}>
                      <View style={[styles.exerciseInput, styles.exerciseInputHalf]}>
                        <Text style={styles.exerciseLabel}>Series</Text>
                        <TextInput
                          style={styles.exerciseTextInput}
                          placeholder="3"
                          placeholderTextColor={Colors.gray.medium}
                          value={exercise.sets.toString()}
                          onChangeText={(text) => {
                            const sets = parseInt(text) || 0;
                            handleUpdateExercise(exercise.id, { sets });
                          }}
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={[styles.exerciseInput, styles.exerciseInputHalf]}>
                        <Text style={styles.exerciseLabel}>Reps</Text>
                        <TextInput
                          style={styles.exerciseTextInput}
                          placeholder="10"
                          placeholderTextColor={Colors.gray.medium}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
    fontWeight: '600',
  },
  saveButton: {
    padding: Spacing.xs,
  },
  saveButtonText: {
    ...Typography.body,
    color: Colors.muscle.Legs,
    fontWeight: '600',
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
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.gray.light,
    borderWidth: 1,
    borderColor: Colors.gray.medium,
    borderRadius: Colors.ui.borderRadius,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.text,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Colors.ui.borderRadius,
    borderWidth: 2,
    borderColor: Colors.gray.medium,
    backgroundColor: Colors.gray.light,
  },
  categoryButtonActive: {
    // Border color is set dynamically in the component
  },
  categoryButtonText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: Colors.background,
    fontWeight: '600',
  },
  exercisesSection: {
    marginTop: Spacing.md,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  addExerciseText: {
    ...Typography.body,
    color: Colors.muscle.Legs,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: Colors.gray.light,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  exerciseNumber: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  exerciseInputs: {
    gap: Spacing.sm,
  },
  exerciseInput: {
    marginBottom: Spacing.sm,
  },
  exerciseInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  exerciseInputHalf: {
    flex: 1,
  },
  exerciseLabel: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  exerciseTextInput: {
    ...Typography.body,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.gray.medium,
    borderRadius: Colors.ui.borderRadius,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    color: Colors.text,
  },
  emptyExercises: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.gray.dark,
    textAlign: 'center',
  },
});

