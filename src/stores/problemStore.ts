import { create } from 'zustand';
import { Problem } from '@/types/types';

// Store interface
interface ProblemStore {
  problems: Problem[]; // List of problems
  currentProblem: Problem | null; // Currently selected problem

  // CRUD operations
  addProblem: (problem: Problem) => void;
  updateProblem: (id: string, updates: Partial<Problem>) => void;
  removeProblem: (id: string) => void;
  setProblems: (problems: Problem[]) => void;
  clearProblems: () => void;

  // Manage the current problem
  setCurrentProblem: (problem: Problem | null) => void;
  clearCurrentProblem: () => void;
}

// Zustand store
export const useProblemStore = create<ProblemStore>((set) => ({
  problems: [],
  currentProblem: null,

  // Add a new problem
  addProblem: (problem) =>
    set((state) => ({
      problems: [...state.problems, problem],
    })),

  // Update a problem by id
  updateProblem: (id, updates) =>
    set((state) => ({
      problems: state.problems.map((problem) =>
        problem.id === id ? { ...problem, ...updates } : problem
      ),
    })),

  // Remove a problem by id
  removeProblem: (id) =>
    set((state) => ({
      problems: state.problems.filter((problem) => problem.id !== id),
    })),

  // Set a list of problems
  setProblems: (problems) =>
    set(() => ({
      problems,
    })),

  // Clear all problems
  clearProblems: () =>
    set(() => ({
      problems: [],
    })),

  // Set the current problem
  setCurrentProblem: (problem) =>
    set(() => ({
      currentProblem: problem,
    })),

  // Clear the current problem
  clearCurrentProblem: () =>
    set(() => ({
      currentProblem: null,
    })),
}));
