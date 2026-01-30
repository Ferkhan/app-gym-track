import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
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

// Avatares predefinidos
const PREDEFINED_AVATARS = [
  { id: "avatar_1", emoji: "💪" },
  { id: "avatar_2", emoji: "🏋️" },
  { id: "avatar_3", emoji: "🏃" },
  { id: "avatar_4", emoji: "⚡" },
  { id: "avatar_5", emoji: "🔥" },
  { id: "avatar_6", emoji: "🌟" },
  { id: "avatar_7", emoji: "🎯" },
  { id: "avatar_8", emoji: "🏆" },
  { id: "avatar_9", emoji: "👤" },
  { id: "avatar_10", emoji: "🦁" },
  { id: "avatar_11", emoji: "🐺" },
  { id: "avatar_12", emoji: "🦅" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser, logout, clearAllData } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Obtener el avatar actual
  const getCurrentAvatar = () => {
    if (!user?.avatar) return null;

    // Si es un avatar predefinido (emoji)
    const predefined = PREDEFINED_AVATARS.find((a) => a.id === user.avatar);
    if (predefined) return { type: "emoji" as const, value: predefined.emoji };

    // Si es una URL de imagen
    if (user.avatar.startsWith("file://") || user.avatar.startsWith("http")) {
      return { type: "image" as const, value: user.avatar };
    }

    return null;
  };

  const currentAvatar = getCurrentAvatar();

  const handleSelectPredefinedAvatar = (avatarId: string) => {
    if (user) {
      setUser({ ...user, avatar: avatarId });
    }
    setShowAvatarModal(false);
  };

  const handlePickImage = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso necesario",
        "Para elegir una foto, necesitamos acceso a tu galería. Puedes habilitarlo en Configuración.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (user) {
        setUser({ ...user, avatar: result.assets[0].uri });
      }
      setShowAvatarModal(false);
    }
  };

  const handleTakePhoto = async () => {
    // Solicitar permisos de cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso necesario",
        "Para tomar una foto, necesitamos acceso a tu cámara. Puedes habilitarlo en Configuración.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (user) {
        setUser({ ...user, avatar: result.assets[0].uri });
      }
      setShowAvatarModal(false);
    }
  };

  const handleRemoveAvatar = () => {
    if (user) {
      setUser({ ...user, avatar: undefined });
    }
    setShowAvatarModal(false);
  };

  const handleSaveName = () => {
    if (!name.trim()) {
      Alert.alert(
        "Nombre vacío",
        "Tu nombre no puede estar vacío. ¿Cómo te llamamos?",
      );
      return;
    }
    if (user) {
      setUser({ ...user, name: name.trim() });
    }
    setEditingName(false);
  };

  const handleLogout = () => {
    Alert.alert("¿Ya te vas?", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Me quedo", style: "cancel" },
      {
        text: "Sí, salir",
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
      "Momento importante",
      "Esto eliminará todas tus rutinas, registros y configuración. Esta acción no se puede deshacer. ¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar todo",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            Alert.alert(
              "Listo",
              "Todos los datos han sido eliminados. ¡Empezamos de cero!",
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
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => setShowAvatarModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarContainer}>
              {currentAvatar?.type === "image" ? (
                <Image
                  source={{ uri: currentAvatar.value }}
                  style={styles.avatarImage}
                />
              ) : currentAvatar?.type === "emoji" ? (
                <Text style={styles.avatarEmoji}>{currentAvatar.value}</Text>
              ) : (
                <Text style={styles.avatarText}>
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <View style={styles.avatarEditBadge}>
              <IconSymbol name="pencil" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
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

      {/* Modal de selección de avatar */}
      <Modal
        visible={showAvatarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar foto de perfil</Text>
              <TouchableOpacity
                onPress={() => setShowAvatarModal(false)}
                style={styles.modalCloseButton}
              >
                <IconSymbol name="xmark" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Opciones de foto */}
            <View style={styles.photoOptions}>
              <TouchableOpacity
                style={styles.photoOptionButton}
                onPress={handlePickImage}
              >
                <View style={styles.photoOptionIcon}>
                  <IconSymbol
                    name="photo.fill"
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.photoOptionText}>Galería</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoOptionButton}
                onPress={handleTakePhoto}
              >
                <View style={styles.photoOptionIcon}>
                  <IconSymbol
                    name="camera.fill"
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.photoOptionText}>Cámara</Text>
              </TouchableOpacity>
            </View>

            {/* Avatares predefinidos */}
            <Text style={styles.avatarSectionTitle}>O elige un avatar</Text>
            <View style={styles.avatarGrid}>
              {PREDEFINED_AVATARS.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    user?.avatar === avatar.id && styles.avatarOptionSelected,
                  ]}
                  onPress={() => handleSelectPredefinedAvatar(avatar.id)}
                >
                  <Text style={styles.avatarOptionEmoji}>{avatar.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botón para eliminar avatar */}
            {user?.avatar && (
              <TouchableOpacity
                style={styles.removeAvatarButton}
                onPress={handleRemoveAvatar}
              >
                <IconSymbol name="trash.fill" size={16} color={Colors.error} />
                <Text style={styles.removeAvatarText}>Eliminar foto</Text>
              </TouchableOpacity>
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
  avatarWrapper: {
    position: "relative",
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Colors.ui.shadowGlow,
    overflow: "hidden",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.background,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: Colors.ui.borderRadiusXL,
    borderTopRightRadius: Colors.ui.borderRadiusXL,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  photoOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  photoOptionButton: {
    alignItems: "center",
  },
  photoOptionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  photoOptionText: {
    ...Typography.caption,
    color: Colors.text,
  },
  avatarSectionTitle: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundElevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "15",
  },
  avatarOptionEmoji: {
    fontSize: 28,
  },
  removeAvatarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  removeAvatarText: {
    ...Typography.body,
    color: Colors.error,
  },
});
