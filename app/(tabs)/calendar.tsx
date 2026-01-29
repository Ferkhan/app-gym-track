import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { Routine } from "@/types";

export default function CalendarScreen() {
  const router = useRouter();
  const { routines, logs, deleteRoutine } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>("");
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
      (log) => log.date === day.dateString && log.completed,
    );
    setSelectedDate(day.dateString);
    setSelectedLogs(dateLogs);
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendario</Text>
        <Text style={styles.subtitle}>Visualiza tu progreso</Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={{
            backgroundColor: Colors.backgroundCard,
            calendarBackground: Colors.backgroundCard,
            textSectionTitleColor: Colors.textSecondary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: Colors.text,
            todayTextColor: Colors.primary,
            dayTextColor: Colors.text,
            textDisabledColor: Colors.textMuted,
            dotColor: Colors.primary,
            selectedDotColor: Colors.text,
            arrowColor: Colors.primary,
            monthTextColor: Colors.text,
            textDayFontWeight: "500",
            textMonthFontWeight: "600",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={styles.calendar}
        />
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Categorías</Text>
        <View style={styles.legendItems}>
          {Object.entries(Colors.muscle).map(([category, color]) => (
            <View key={category} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{formatDate(selectedDate)}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol
                  name="xmark"
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {selectedLogs.length === 0 ? (
              <View style={styles.emptyModalContent}>
                <Text style={styles.emptyModalIcon}>📅</Text>
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
                      activeOpacity={0.8}
                      onPress={() => handleViewRoutine(routine)}
                    >
                      <View
                        style={[
                          styles.logCategoryIndicator,
                          { backgroundColor: Colors.muscle[routine.category] },
                        ]}
                      />
                      <View style={styles.logItemContent}>
                        <Text style={styles.logItemName}>{routine.name}</Text>
                        <View style={styles.logItemMeta}>
                          <View
                            style={[
                              styles.logCategoryDot,
                              {
                                backgroundColor:
                                  Colors.muscle[routine.category],
                              },
                            ]}
                          />
                          <Text style={styles.logItemCategory}>
                            {routine.category}
                          </Text>
                        </View>
                      </View>
                      <IconSymbol
                        name="chevron.right"
                        size={16}
                        color={Colors.textMuted}
                      />
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
    paddingTop: Spacing.xl,
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
  calendarContainer: {
    marginHorizontal: Spacing.lg,
    borderRadius: Colors.ui.borderRadiusLarge,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calendar: {
    backgroundColor: Colors.backgroundCard,
  },
  legendContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendTitle: {
    ...Typography.captionMedium,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: Colors.ui.borderRadiusXL,
    borderTopRightRadius: Colors.ui.borderRadiusXL,
    padding: Spacing.lg,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.text,
    textTransform: "capitalize",
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    gap: Spacing.sm,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundElevated,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  logItemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  logCategoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  logItemCategory: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  emptyModalContent: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyModalIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyModalText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
