import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import { Colors, Spacing, Typography } from '@/constants/theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Bienvenido a GymTrack',
    description: 'Lleva un registro completo de tus rutinas y progreso en el gimnasio de manera sencilla y organizada.',
    icon: '💪',
  },
  {
    id: 2,
    title: 'Organiza tus Rutinas',
    description: 'Crea y gestiona hasta 5 rutinas personalizadas con ejercicios, series y repeticiones.',
    icon: '📋',
  },
  {
    id: 3,
    title: 'Visualiza tu Progreso',
    description: 'Lleva un seguimiento diario de tus entrenamientos y observa tu evolución en el calendario.',
    icon: '📊',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { completeOnboarding } = useApp();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(pageIndex);
  };

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentPage + 1) * width, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace('/login');
  };

  const handleSkip = () => {
    handleFinish();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Omitir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}>
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{slide.icon}</Text>
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentPage === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentPage === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipContainer: {
    padding: Spacing.md,
    alignItems: 'flex-end',
  },
  skipText: {
    ...Typography.body,
    color: Colors.muscle.Legs,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.gray.dark,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray.medium,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: Colors.muscle.Legs,
  },
  buttonContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.muscle.Legs,
    paddingVertical: Spacing.md,
    borderRadius: Colors.ui.borderRadius,
    alignItems: 'center',
    ...Colors.ui.shadow,
  },
  buttonText: {
    ...Typography.h3,
    color: Colors.background,
    fontWeight: '600',
  },
});

