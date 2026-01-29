import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser, logout, clearAllData } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleSaveName = () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }
    if (user) {
      setUser({ ...user, name: name.trim() });
    }
    setEditingName(false);
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Eliminar todos los datos",
      "¿Estás seguro? Esta acción no se puede deshacer. Se eliminarán todas tus rutinas, registros y configuración.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            Alert.alert(
              "Datos eliminados",
              "Todos los datos han sido eliminados.",
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(user?.name || "U").charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
          <Text style={styles.userEmail}>{user?.email || "Sin correo"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información personal</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <IconSymbol
                  name="person.fill"
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.infoLabel}>Nombre</Text>
              {editingName ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    placeholder="Tu nombre"
                    placeholderTextColor={Colors.textMuted}
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveName}
                    >
                      <Text style={styles.saveButtonText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setName(user?.name || "");
                        setEditingName(false);
                      }}
                    >
                      <IconSymbol name="xmark" size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingName(true)}
                >
                  <Text style={styles.infoValue}>
                    {user?.name || "Sin nombre"}
                  </Text>
                  <View style={styles.editIcon}>
                    <IconSymbol
                      name="pencil"
                      size={14}
                      color={Colors.primary}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <View style={[styles.infoRow, styles.infoRowLast]}>
              <View style={styles.infoIcon}>
                <IconSymbol
                  name="envelope.fill"
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.infoLabel}>Correo</Text>
              <Text style={styles.infoValue}>
                {user?.email || "No especificado"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleLogout}
          >
            <View style={styles.settingsIcon}>
              <IconSymbol
                name="rectangle.portrait.and.arrow.right"
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            <Text style={styles.settingsButtonText}>Cerrar sesión</Text>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={Colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingsButton, styles.dangerButton]}
            onPress={handleClearData}
          >
            <View style={[styles.settingsIcon, styles.dangerIcon]}>
              <IconSymbol name="trash.fill" size={20} color={Colors.error} />
            </View>
            <Text style={[styles.settingsButtonText, styles.dangerButtonText]}>
              Eliminar todos los datos
            </Text>
            <IconSymbol name="chevron.right" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GymTrack v1.5.0</Text>
          <Text style={styles.footerSubtext}>Hecho para los ganadores</Text>
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
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    ...Colors.ui.shadowGlow,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userName: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.captionMedium,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  infoCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadiusLarge,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  editIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  editContainer: {
    flex: 1,
    flexDirection: "column",
    gap: Spacing.sm,
  },
  editInput: {
    ...Typography.body,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Colors.ui.borderRadius,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    color: Colors.text,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: Spacing.sm,
  },
  saveButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: Colors.ui.borderRadius,
  },
  saveButtonText: {
    ...Typography.captionMedium,
    color: "#FFFFFF",
  },
  cancelButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.errorLight + "15",
    borderRadius: Colors.ui.borderRadius,
  },
  cancelButtonText: {
    ...Typography.body,
    color: Colors.error,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundElevated,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  settingsButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    flex: 1,
  },
  dangerButton: {
    borderColor: Colors.error + "30",
    backgroundColor: Colors.error + "08",
  },
  dangerIcon: {
    backgroundColor: Colors.error + "15",
  },
  dangerButtonText: {
    color: Colors.error,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  footerSubtext: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
