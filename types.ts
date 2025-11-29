import React from 'react';

export type Language = 'tr' | 'en';

export enum PuzzleType {
  TRIANGLE_MATH = 'TRIANGLE_MATH',
  MATRIX_LOGIC = 'MATRIX_LOGIC',
  BALANCE_SCALE = 'BALANCE_SCALE',
  CUBE_FOLDING = 'CUBE_FOLDING',
  SYMBOL_EQUATION = 'SYMBOL_EQUATION',
  ODD_ONE_OUT = 'ODD_ONE_OUT',
  WORD_PROBLEM = 'WORD_PROBLEM', // New
  ANALYTIC_GEO = 'ANALYTIC_GEO', // New
}

export type PuzzleCategory = 'NUMERICAL' | 'VISUAL' | 'LOGIC';

export enum GameState {
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS',
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestConfig {
  questionCount: number;
  durationMinutes: number | 'UNTIMED';
  difficulty: Difficulty;
}

export interface PuzzleOption {
  id: string;
  value: string | number | React.ReactNode; 
  visualData?: any; 
}

export interface TriangleData {
  top: number;
  left: number;
  right: number;
  center: number | '?';
  ruleDescription?: string;
}

export interface MatrixData {
  grid: number[][]; 
  rotation: number;
  shapeType: 'arrow' | 'circle' | 'square';
}

export interface BalanceData {
  scales: {
    left: { shape: string; count: number }[];
    right: { shape: string; count: number }[];
  }[];
  question: {
    left: { shape: string; count: number }[];
  };
}

export interface CubeData {
  net: string[]; 
}

export interface SymbolEquationData {
  equations: {
    items: (string | number)[]; // e.g. ["circle", "+", "square", "=", 24]
    result: number | string;
  }[];
  question: {
    items: (string | number)[];
    result: "?";
  };
}

export interface OddOneOutData {
  ruleType: 'count' | 'position' | 'shape' | 'color';
}

// New Data Interface for Text-based puzzles
export interface TextPuzzleData {
  text: string;
  subText?: string;
}

export interface Puzzle {
  id: string;
  type: PuzzleType;
  category: PuzzleCategory;
  difficulty: Difficulty;
  data: TriangleData | MatrixData | BalanceData | CubeData | SymbolEquationData | OddOneOutData | TextPuzzleData;
  question: string;
  options: PuzzleOption[];
  correctOptionId: string;
  explanation: string;
}

export interface HistoryItem {
  puzzle: Puzzle;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface UserSession {
  score: number;
  totalQuestions: number;
  correctCount: number;
  history: HistoryItem[];
}