export interface GameState {
  solvedGroups: SolvedGroup[];
  answers: GameAnswer[];
  missedGuesses: number;
}

export interface SolvedGroup {
  answers: GameAnswer[];
  level: 0 | 1 | 2 | 3;
  group: string;
}

export interface GameAnswer {
  memberText: string;
  level: 0 | 1 | 2 | 3;
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
