import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>Regístrate para comenzar</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  placeholderTextColor={Colors.gray.medium}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@correo.com"
                  placeholderTextColor={Colors.gray.medium}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.gray.medium}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.loginLink}>Inicia sesión</Text>
                  </TouchableOpacity>
                </Link>
              </View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.gray.dark,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.text,
    marginBottom: Spacing.xs,
    fontWeight: '600',
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
  button: {
    backgroundColor: Colors.muscle.Legs,
    paddingVertical: Spacing.md,
    borderRadius: Colors.ui.borderRadius,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Colors.ui.shadow,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...Typography.h3,
    color: Colors.background,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  loginText: {
    ...Typography.body,
    color: Colors.gray.dark,
  },
  loginLink: {
    ...Typography.body,
    color: Colors.muscle.Legs,
    fontWeight: '600',
  },
});

