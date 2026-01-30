import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Routine, DailyLog, RoutineCategory } from '@/types';

interface AppContextType {
  user: User | null;
  routines: Routine[];
  logs: DailyLog[];
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  updateRoutine: (id: string, routine: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  logWorkout: (routineId: string, date?: string) => void;
  completeOnboarding: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@gymtrack_user',
  USERS_DB: '@gymtrack_users_db',
  ROUTINES: '@gymtrack_routines',
  LOGS: '@gymtrack_logs',
  ONBOARDING: '@gymtrack_onboarding',
};

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, routinesData, logsData, onboardingData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.ROUTINES),
        AsyncStorage.getItem(STORAGE_KEYS.LOGS),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING),
      ]);

      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (routinesData) {
        setRoutines(JSON.parse(routinesData));
      }
      if (logsData) {
        setLogs(JSON.parse(logsData));
      }
      if (onboardingData === 'true') {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      }
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const saveRoutines = async (routinesData: Routine[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routinesData));
      setRoutines(routinesData);
    } catch (error) {
      console.error('Error saving routines:', error);
    }
  };

  const saveLogs = async (logsData: DailyLog[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logsData));
      setLogs(logsData);
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Obtener usuarios registrados
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];
      
      // Buscar usuario por email
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!foundUser) {
        throw new Error('Usuario no encontrado. ¿Ya te registraste?');
      }
      
      // Verificar contraseña
      if (foundUser.password !== password) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Login exitoso - guardar sesión (sin password)
      const sessionUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };
      await saveUser(sessionUser);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Obtener usuarios existentes
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];
      
      // Verificar si el email ya existe
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('Este correo ya está registrado');
      }
      
      // Crear nuevo usuario
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
      };
      
      // Guardar en "base de datos" local
      const updatedUsers = [...users, newUser];
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(updatedUsers));
      
      // Iniciar sesión automáticamente
      const sessionUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      await saveUser(sessionUser);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await saveUser(null);
  };

  const addRoutine = (routineData: Omit<Routine, 'id'>) => {
    const newRoutine: Routine = {
      ...routineData,
      id: Date.now().toString(),
    };
    const updatedRoutines = [...routines, newRoutine];
    saveRoutines(updatedRoutines);
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    const updatedRoutines = routines.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    saveRoutines(updatedRoutines);
  };

  const deleteRoutine = (id: string) => {
    const updatedRoutines = routines.filter((r) => r.id !== id);
    const updatedLogs = logs.filter((l) => l.routineId !== id);
    saveRoutines(updatedRoutines);
    saveLogs(updatedLogs);
  };

  const logWorkout = (routineId: string, date?: string) => {
    const logDate = date || new Date().toISOString().split('T')[0];
    const existingLogIndex = logs.findIndex(
      (l) => l.date === logDate && l.routineId === routineId
    );

    let updatedLogs: DailyLog[];
    if (existingLogIndex >= 0) {
      // Update existing log
      updatedLogs = logs.map((l, index) =>
        index === existingLogIndex ? { ...l, completed: !l.completed } : l
      );
    } else {
      // Create new log
      const newLog: DailyLog = {
        id: Date.now().toString(),
        date: logDate,
        routineId,
        completed: true,
      };
      updatedLogs = [...logs, newLog];
    }
    saveLogs(updatedLogs);
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const clearAllData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.ROUTINES),
        AsyncStorage.removeItem(STORAGE_KEYS.LOGS),
        AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING),
      ]);
      setUser(null);
      setRoutines([]);
      setLogs([]);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const value: AppContextType = {
    user,
    routines,
    logs,
    isAuthenticated: !!user,
    hasCompletedOnboarding,
    setUser: saveUser,
    login,
    register,
    logout,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    logWorkout,
    completeOnboarding,
    clearAllData,
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

