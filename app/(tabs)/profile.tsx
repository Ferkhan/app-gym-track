import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser, logout, clearAllData } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSaveName = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    if (user) {
      setUser({ ...user, name: name.trim() });
    }
    setEditingName(false);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      'Eliminar todos los datos',
      '¿Estás seguro? Esta acción no se puede deshacer. Se eliminarán todas tus rutinas, registros y configuración.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Datos eliminados', 'Todos los datos han sido eliminados.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información personal</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre</Text>
              {editingName ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    placeholder="Tu nombre"
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveName}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setName(user?.name || '');
                      setEditingName(false);
                    }}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingName(true)}>
                  <Text style={styles.infoValue}>{user?.name || 'Sin nombre'}</Text>
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Correo electrónico</Text>
              <Text style={styles.infoValue}>{user?.email || 'No especificado'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleLogout}>
            <Text style={styles.settingsButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingsButton, styles.dangerButton]}
            onPress={handleClearData}>
            <Text style={[styles.settingsButtonText, styles.dangerButtonText]}>
              Eliminar todos los datos
            </Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  infoCard: {
    backgroundColor: Colors.background,
    borderRadius: Colors.ui.borderRadiusLarge,
    padding: Spacing.md,
    ...Colors.ui.shadow,
    borderWidth: 1,
    borderColor: Colors.gray.light,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.gray.dark,
    fontWeight: '500',
  },
  infoValue: {
    ...Typography.body,
    color: Colors.text,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  editButtonText: {
    ...Typography.caption,
    color: Colors.muscle.Legs,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.md,
  },
  editInput: {
    flex: 1,
    ...Typography.body,
    backgroundColor: Colors.gray.light,
    borderWidth: 1,
    borderColor: Colors.gray.medium,
    borderRadius: Colors.ui.borderRadius,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    color: Colors.text,
  },
  saveButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.muscle.Legs,
    borderRadius: Colors.ui.borderRadius,
  },
  saveButtonText: {
    ...Typography.caption,
    color: Colors.background,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  cancelButtonText: {
    ...Typography.caption,
    color: Colors.gray.dark,
  },
  settingsButton: {
    backgroundColor: Colors.background,
    borderRadius: Colors.ui.borderRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Colors.ui.shadow,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    alignItems: 'center',
  },
  settingsButtonText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '500',
  },
  dangerButton: {
    borderColor: Colors.error,
  },
  dangerButtonText: {
    color: Colors.error,
  },
});

