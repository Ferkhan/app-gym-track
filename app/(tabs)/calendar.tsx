import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Routine, RoutineCategory } from '@/types';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CalendarScreen() {
  const router = useRouter();
  const { routines, logs, deleteRoutine } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLogs, setSelectedLogs] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Create marked dates
  const markedDates: any = {};
  logs.forEach((log) => {
    if (log.completed) {
      const routine = routines.find((r) => r.id === log.routineId);
      if (routine) {
        if (markedDates[log.date]) {
          markedDates[log.date].dots?.push({
            color: Colors.muscle[routine.category],
            selectedColor: Colors.muscle[routine.category],
          });
        } else {
          markedDates[log.date] = {
            dots: [
              {
                color: Colors.muscle[routine.category],
                selectedColor: Colors.muscle[routine.category],
              },
            ],
            marked: true,
          };
        }
      }
    }
  });

  const handleDayPress = (day: DateData) => {
    const dateLogs = logs.filter(
      (log) => log.date === day.dateString && log.completed
    );
    setSelectedDate(day.dateString);
    setSelectedLogs(dateLogs);
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoutineForLog = (logId: string) => {
    const log = logs.find((l) => l.id === logId);
    return routines.find((r) => r.id === log?.routineId);
  };

  const handleDeleteLog = (logId: string) => {
    // In a real app, you'd have a deleteLog function in context
    // For now, we'll just close the modal
    setModalVisible(false);
  };

  const handleViewRoutine = (routine: Routine) => {
    setModalVisible(false);
    router.push(`/routine-detail?id=${routine.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendario</Text>
        <Text style={styles.subtitle}>Visualiza tu progreso</Text>
      </View>

      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: Colors.background,
          calendarBackground: Colors.background,
          textSectionTitleColor: Colors.text,
          selectedDayBackgroundColor: Colors.muscle.Legs,
          selectedDayTextColor: Colors.background,
          todayTextColor: Colors.muscle.Legs,
          dayTextColor: Colors.text,
          textDisabledColor: Colors.gray.medium,
          dotColor: Colors.muscle.Legs,
          selectedDotColor: Colors.background,
          arrowColor: Colors.muscle.Legs,
          monthTextColor: Colors.text,
          textDayFontWeight: '500',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {formatDate(selectedDate)}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <IconSymbol name="xmark" size={24} color={Colors.gray.dark} />
              </TouchableOpacity>
            </View>

            {selectedLogs.length === 0 ? (
              <View style={styles.emptyModalContent}>
                <Text style={styles.emptyModalText}>
                  No hay entrenamientos registrados para este día
                </Text>
              </View>
            ) : (
              <View style={styles.modalBody}>
                {selectedLogs.map((log) => {
                  const routine = getRoutineForLog(log.id);
                  if (!routine) return null;

                  return (
                    <TouchableOpacity
                      key={log.id}
                      style={styles.logItem}
                      onPress={() => handleViewRoutine(routine)}>
                      <View
                        style={[
                          styles.logCategoryIndicator,
                          { backgroundColor: Colors.muscle[routine.category] },
                        ]}
                      />
                      <View style={styles.logItemContent}>
                        <Text style={styles.logItemName}>{routine.name}</Text>
                        <Text style={styles.logItemCategory}>
                          {routine.category}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    color: Colors.gray.dark,
  },
  calendar: {
    marginHorizontal: Spacing.lg,
    borderRadius: Colors.ui.borderRadius,
    ...Colors.ui.shadow,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Colors.ui.borderRadiusLarge,
    borderTopRightRadius: Colors.ui.borderRadiusLarge,
    padding: Spacing.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  modalBody: {
    gap: Spacing.md,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
  },
  logCategoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  logItemContent: {
    flex: 1,
  },
  logItemName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  logItemCategory: {
    ...Typography.caption,
    color: Colors.gray.dark,
  },
  emptyModalContent: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyModalText: {
    ...Typography.body,
    color: Colors.gray.dark,
    textAlign: 'center',
  },
});

