import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useApp } from '@/context/AppContext';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { hasCompletedOnboarding, isAuthenticated } = useApp();

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

