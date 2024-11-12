export interface GameState {
  solvedThemes: SolvedTheme[];
  choices: Choice[];
}

export interface SolvedTheme {
  choices: Choice[];
  color: string;
  theme: string;
}

export interface Choice {
  memberText: string;
  level: number;
  group: string;
  isSelected: boolean;
  isAvailableToChoose: boolean;
}

// format of puzzles in "the archive" in data/connections.json
export interface Puzzle {
  id: number;
  date: string; // YYYY-MM-DD format
  answers: Answer[];
}

export interface Answer {
  level: number;
  group: string;
  members: string[];
}
