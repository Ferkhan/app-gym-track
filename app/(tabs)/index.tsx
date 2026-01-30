import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Spacing, Typography } from "@/constants/theme";
import { useApp } from "@/context/AppContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { user, routines, logs } = useApp();

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter((log) => log.date === today && log.completed);
  const todayRoutine = routines.find((r) =>
    todayLogs.some((log) => log.routineId === r.id),
  );

  // Calculate weekly progress (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekLogs = logs.filter(
    (log) =>
      log.completed &&
      new Date(log.date) >= sevenDaysAgo &&
      new Date(log.date) <= new Date(),
  );
  const weeklyProgress = weekLogs.length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hola, {user?.name || "Usuario"}
          </Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/log-workout")}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Rutina de hoy</Text>
              {todayRoutine && (
                <View
                  style={[
                    styles.categoryBadge,
                    {
                      backgroundColor:
                        Colors.muscle[todayRoutine.category] + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryBadgeText,
                      { color: Colors.muscle[todayRoutine.category] },
                    ]}
                  >
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
            <View style={styles.cardIndicator}>
              <View
                style={[
                  styles.indicatorDot,
                  todayRoutine && { backgroundColor: Colors.success },
                ]}
              />
              <Text style={styles.indicatorText}>
                {todayRoutine ? "Completada" : "Pendiente"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Progreso semanal</Text>
              <View style={styles.weekBadge}>
                <Text style={styles.weekBadgeText}>7 días</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.progressRow}>
                <Text style={styles.progressNumber}>{weeklyProgress}</Text>
                <Text style={styles.progressLabel}>/ 7</Text>
              </View>
              <Text style={styles.cardSubtext}>entrenamientos completados</Text>
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
          activeOpacity={0.85}
          onPress={() => router.push("/log-workout")}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.quickActionText}>
              Registrar entrenamiento
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{routines.length}</Text>
            <Text style={styles.statLabel}>Rutinas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {logs.filter((l) => l.completed).length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{weeklyProgress}</Text>
            <Text style={styles.statLabel}>Semana</Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  date: {
    ...Typography.body,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  cardsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadiusLarge,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Colors.ui.borderRadius,
  },
  categoryBadgeText: {
    ...Typography.captionMedium,
    fontWeight: "600",
  },
  weekBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Colors.ui.borderRadius,
    backgroundColor: Colors.primary + "20",
  },
  weekBadgeText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: "600",
  },
  cardContent: {
    gap: Spacing.xs,
  },
  cardText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  cardSubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  cardIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  indicatorText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  progressNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: -1,
  },
  progressLabel: {
    ...Typography.h2,
    color: Colors.textMuted,
    marginLeft: Spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 3,
    marginTop: Spacing.md,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  quickActionButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Colors.ui.borderRadius,
    overflow: "hidden",
    ...Colors.ui.shadowGlow,
  },
  gradientButton: {
    paddingVertical: Spacing.md + 2,
    alignItems: "center",
  },
  quickActionText: {
    ...Typography.h3,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.text,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
