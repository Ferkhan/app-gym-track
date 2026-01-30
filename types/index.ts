export type RoutineCategory = "Legs" | "Back" | "Chest" | "Arms";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

export interface Routine {
  id: string;
  name: string;
  category: RoutineCategory;
  exercises: Exercise[];
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD format
  routineId: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string; // URL de imagen o ID de avatar predefinido
}
